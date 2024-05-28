import he from "he";
import { Browser, chromium, Page } from "playwright";

// Type for instruction object
type Instruction = {
  text: string;
};

type GraphObject = {
  "@type": string | any[];
  recipeIngredient?: string[];
  recipeInstructions?: Instruction[];
};

type RawRecipeData = GraphObject | { "@graph": GraphObject[] } | GraphObject[];

function findGraphObjectWithRecipeData(inputData: GraphObject[]) {
  const result = inputData.find((obj: GraphObject) => {
    return obj["@type"] === "Recipe";
  });

  return result;
}

//Function to generate array of recipeInstructions
function generateStringArray(recipeInstructions: Instruction[]): string[] {
  return recipeInstructions.map((instruction) => instruction.text);
}

// Function to decode ingredients and instructions
function decodeData(data: string[]): string[] {
  return data.map((item: string) => he.decode(item));
}

// function to use in catch blocks
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const getScrapedRecipe = async (
  url: string
): Promise<
  { ingredients: string[]; instructions: string[] } | { message: string }
> => {
  try {
    const browser: Browser = await chromium.launch({
      headless: true,
    });

    const page: Page = await browser.newPage();
    await page.goto(url);

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
        "The provided URL does not contain the necessary recipe data"
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
        "The provided URL does not contain the necessary recipe data"
      );
    }

    if (!recipeData.recipeIngredient) {
      console.log("Ingredients array not found");
      throw new Error(
        "The provided URL does not contain the necessary recipe data"
      );
    }

    const ingredientsData = recipeData.recipeIngredient;
    let instructionsArray: any[] = []; // Initialize as an array of any type
    let instructionsData: string[] = [];

    if (
      Array.isArray(recipeData.recipeInstructions) &&
      recipeData.recipeInstructions.length > 0
    ) {
      instructionsArray = recipeData.recipeInstructions;
    } else {
      console.log("Instructions is either not an array, or it is empty");
      throw new Error(
        "The provided URL does not contain the necessary recipe data"
      );
    }

    // the array of instructions comes wither as an array of strings,
    // or as an object which should fall under "HowToStep" or "HowToSection" below
    // see https://developers.google.com/search/docs/appearance/structured-data/recipe#recipe-properties
    if (typeof instructionsArray[0] === "string") {
      instructionsData = instructionsArray as string[];
    } else if (
      typeof instructionsArray[0] === "object" &&
      instructionsArray[0]["@type"] === "HowToSection"
    ) {
      instructionsArray.forEach((section) => {
        const items = generateStringArray(section.itemListElement);
        instructionsData.push(...items);
      });
    } else if (
      typeof instructionsArray[0] === "object" &&
      instructionsArray[0]["@type"] === "HowToStep"
    ) {
      instructionsData = generateStringArray(instructionsArray);
    } else {
      console.log("Instructions must be of either type objects or strings");
      throw new Error(
        "The provided URL does not contain the necessary recipe data"
      );
    }

    const decodedIngredients: string[] = decodeData(ingredientsData);
    const decodedInstructions: string[] = decodeData(instructionsData);

    return {
      ingredients: decodedIngredients,
      instructions: decodedInstructions,
    };
  } catch (error) {
    console.error(error);
    return { message: getErrorMessage(error) };
  }
};
