"use server";

import {
  decodeData,
  findGraphObjectWithRecipeData,
  generateStringArray,
  getErrorMessage,
} from "@/lib/utils";

import { Browser, chromium, Page } from "playwright";

export const getScrapedRecipe = async (
  url: string
): Promise<GetScrapedRecipeResponse> => {
  try {
    const browser: Browser = await chromium.launch({
      headless: true,
    });

    const page: Page = await browser.newPage();
    await page.goto(url);

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

    console.log("Hello");

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
        "Oh no! The provided URL does not contain the necessary recipe data."
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
        "Oh no! The provided URL does not contain the necessary recipe data."
      );
    }

    if (!recipeData.recipeIngredient) {
      console.log("Ingredients array not found");
      throw new Error(
        "Oh no! The provided URL does not contain the necessary recipe data."
      );
    }

    const ingredientsData = recipeData.recipeIngredient;
    let instructionsArray: ScrapedInstruction[];
    let instructionsData: string[] = [];

    if (
      Array.isArray(recipeData.recipeInstructions) &&
      recipeData.recipeInstructions.length > 0
    ) {
      instructionsArray = recipeData.recipeInstructions;
    } else {
      console.log("Instructions is either not an array, or it is empty");
      throw new Error(
        "Oh no! The provided URL does not contain the necessary recipe data."
      );
    }

    // the array of instructions comes wither as an array of strings,
    // or as an array of objects which should fall under "HowToStep" or "HowToSection",
    // see https://developers.google.com/search/docs/appearance/structured-data/recipe#recipe-properties

    // case string:
    if (typeof instructionsArray[0] === "string") {
      instructionsData = instructionsArray as string[];

      // case HowToSection:
    } else if (
      typeof instructionsArray[0] === "object" &&
      instructionsArray[0]["@type"] === "HowToSection"
    ) {
      const sections = instructionsArray as HowToSection[];
      sections.forEach((section) => {
        const items = generateStringArray(section.itemListElement);
        instructionsData.push(...items);
      });

      // case HowToStep:
    } else if (
      typeof instructionsArray[0] === "object" &&
      instructionsArray[0]["@type"] === "HowToStep"
    ) {
      const steps = instructionsArray as HowToStep[];
      instructionsData = generateStringArray(steps);

      // (case error:)
    } else {
      console.log("Instructions must be of either type objects or strings");
      throw new Error(
        "Oh no! The provided URL does not contain the necessary recipe data."
      );
    }

    const decodedIngredients: Ingredient[] = decodeData(ingredientsData);
    const decodedInstructions: Instruction[] = decodeData(instructionsData);

    console.log("decodedIngredients", decodedIngredients);
    console.log("decodedInstructions", decodedInstructions);

    // get the title from the url as a fallback
    let recipeTitle =
      new URL(url).pathname.split("/").filter(Boolean).pop() || "";
    // replace dashes and underscores with spaces
    recipeTitle = recipeTitle.replace(/[-_]/g, " ");

    // if the recipeData object has a name property, use that as the title
    if ("name" in recipeData && typeof recipeData.name === "string") {
      recipeTitle = recipeData.name;
    }

    return {
      success: true,
      recipe: {
        title: recipeTitle,
        ingredients: decodedIngredients,
        instructions: decodedInstructions,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: {
        message: getErrorMessage(error),
      },
    };
  }
};
