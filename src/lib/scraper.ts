"use server";

import { Browser, chromium, Page } from "playwright";
import he from "he";

import {
  convertTime,
  decodeData,
  findGraphObjectWithRecipeData,
  generateStringArray,
  getErrorMessage,
  isValidUrl,
} from "@/lib/utils";

export const getScrapedRecipe = async (
  url: string
): Promise<GetScrapedRecipeResponse> => {
  try {
    const browser: Browser = await chromium.launch({
      headless: true,
    });

    // trim any potential leading/trailing whitespace
    url = url.trim();

    if (url == "") {
      throw new Error("The input field is empty. Please provide a URL.");
    }

    if (!isValidUrl(url)) {
      throw new Error("Invalid URL. Please provide a valid URL.");
    }

    const page: Page = await browser.newPage();

    // don't catch errors thrown by page.goto, since they aren't formatted as user-friendly error messages
    await page.goto(url).catch(() => {});

    // Sometimes the scripts are loaded after the initial page load - wait 500ms
    await page
      .waitForSelector('script[type="application/ld+json"]', { timeout: 500 })
      .catch(() => {}); // If timeout, do nothing since we catch errors with "No application/ld+json scripts" below

    // Get all scripts of type "application/ld+json" from the provided url
    const jsonLdData: string[] = await page.evaluate(() => {
      const scriptTags: NodeListOf<HTMLScriptElement> =
        document.querySelectorAll('script[type="application/ld+json"]');

      const data: string[] = [];

      scriptTags.forEach((scriptTag: HTMLScriptElement) => {
        data.push(scriptTag.innerHTML);
      });

      return data;
    });

    await browser.close();

    let scriptWithRecipeData: string = "";

    // Find the correct json string
    jsonLdData.forEach((jsonString: string) => {
      if (
        jsonString.includes("recipeIngredient") &&
        jsonString.includes("recipeInstructions")
      ) {
        scriptWithRecipeData = jsonString;
      }
    });

    if (!scriptWithRecipeData) {
      console.log("No application/ld+json scripts");
      throw new Error(
        "The provided URL does not contain the necessary recipe data."
      );
    }

    // Parse the correct json string
    const rawRecipeData: RawRecipeData = JSON.parse(scriptWithRecipeData);

    let recipeData: GraphObject | GraphObject[] | undefined;

    if ("@graph" in rawRecipeData) {
      const graph: GraphObject[] = rawRecipeData["@graph"];

      recipeData = findGraphObjectWithRecipeData(graph);
    } else if (Array.isArray(rawRecipeData)) {
      recipeData = findGraphObjectWithRecipeData(rawRecipeData);
    } else {
      recipeData = rawRecipeData;
    }

    if (!recipeData) {
      console.log("recipeData not found");
      throw new Error(
        "The provided URL does not contain the necessary recipe data."
      );
    }

    if (!recipeData.recipeIngredient) {
      console.log("Ingredients array not found");
      throw new Error(
        "The provided URL does not contain the necessary recipe data."
      );
    }

    const ingredientsData = recipeData.recipeIngredient;
    const decodedIngredients: Ingredient[] = decodeData(ingredientsData);
    let instructionsArray: ScrapedInstruction[] = [];
    let decodedInstructions: string[] | SectionInstruction[] = [];

    if (
      Array.isArray(recipeData.recipeInstructions) &&
      recipeData.recipeInstructions.length > 0
    ) {
      instructionsArray = recipeData.recipeInstructions;
    } else {
      console.log("Instructions is either not an array, or it is empty");
      throw new Error(
        "The provided URL does not contain the necessary recipe data."
      );
    }

    // the array of instructions comes wither as an array of strings,
    // or as an array of objects which should fall under "HowToStep" or "HowToSection",
    // see https://developers.google.com/search/docs/appearance/structured-data/recipe#recipe-properties

    // case string:
    if (typeof instructionsArray[0] === "string") {
      const instructions = instructionsArray as string[];
      decodedInstructions = decodeData(instructions);

      // case HowToSection:
    } else if (
      typeof instructionsArray[0] === "object" &&
      instructionsArray[0]["@type"] === "HowToSection"
    ) {
      const sections = instructionsArray as HowToSection[];
      decodedInstructions = sections.map((section) => ({
        name: he.decode(section.name),
        text: decodeData(section.itemListElement.map((item) => item.text)),
      }));

      // case HowToStep:
    } else if (
      typeof instructionsArray[0] === "object" &&
      instructionsArray[0]["@type"] === "HowToStep"
    ) {
      const steps = instructionsArray as HowToStep[];
      decodedInstructions = decodeData(generateStringArray(steps));

      // (case error:)
    } else {
      console.log("Instructions must be of either type objects or strings");
      throw new Error(
        "The provided URL does not contain the necessary recipe data."
      );
    }

    console.log("decodedIngredients", decodedIngredients);
    console.log("decodedInstructions", decodedInstructions);

    // get the title from the url as a fallback
    let recipeTitle =
      new URL(url).pathname.split("/").filter(Boolean).pop() || "";
    // replace dashes and underscores with spaces
    recipeTitle = recipeTitle.replace(/[-_]/g, " ");

    // if the recipeData object has a name property, use that as the title
    if ("name" in recipeData && typeof recipeData.name === "string") {
      recipeTitle = he.decode(recipeData.name);
    }

    // Get author
    let recipeAuthor = "Unknown";
    if ("author" in recipeData) {
      if (recipeData.author === null) {
        recipeAuthor = "Unknown";
      } else if (Array.isArray(recipeData.author)) {
        recipeAuthor = recipeData.author[0].name;
      } else if (typeof recipeData.author === "object") {
        recipeAuthor = recipeData.author.name;
      }
    }

    //Total time
    let recipeTime = "-";
    if ("totalTime" in recipeData && typeof recipeData.totalTime === "string") {
      recipeTime = convertTime(recipeData.totalTime);
    }

    // // Get yield (servings)
    let recipeYield = "-";
    if ("recipeYield" in recipeData && recipeData.recipeYield) {
      if (Array.isArray(recipeData.recipeYield)) {
        recipeYield = recipeData.recipeYield[0].toString();
      }
      if (typeof recipeData.recipeYield === "string") {
        // Search for "undefined" and remove it + whitespace
        recipeYield = recipeData.recipeYield
          .replace(/undefined/g, "")
          .trim()
          .replace(/\s+/g, " ");
      } else if (typeof recipeData.recipeYield === "number") {
        // Convert to string for consistency
        recipeYield = recipeData.recipeYield.toString();
      }
    }

    return {
      success: true,
      recipe: {
        url: url,
        title: recipeTitle,
        author: recipeAuthor,
        time: recipeTime,
        yield: recipeYield,
        ingredients: decodedIngredients,
        instructions: decodedInstructions,
      },
    };
  } catch (error) {
    console.error(getErrorMessage(error));

    return {
      success: false,
      error: {
        message: getErrorMessage(error),
      },
    };
  }
};
