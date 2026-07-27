import he from "he";

export type Ingredient = string;

export type Instruction = string;

export type SectionInstruction = {
  name: string;
  text: Instruction[];
};

type Instructions = Instruction[] | SectionInstruction[];

export type Recipe = {
  url: string;
  title: string;
  author: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: Instructions;
};

export type GetScrapedRecipeResponse = {
  success: boolean;
  recipe?: Recipe;
  error?: {
    message: string;
  };
};

type Author = {
  "@type": "Person";
  name: string;
};

export type ScrapedAuthor = Author | Author[];

export type GraphObject = {
  "@type": string | unknown[];
  recipeIngredient?: Ingredient[];
  recipeInstructions?: Instruction[];
  name?: string;
  author?: ScrapedAuthor;
  totalTime?: string;
  recipeYield?: string | number;
  url?: string;
};

export type RawRecipeData =
  | GraphObject
  | { "@graph": GraphObject[] }
  | GraphObject[];

export type HowToStep = {
  "@type": "HowToStep";
  text: string;
  name?: string;
  url?: string;
  image?: string;
};

export type HowToSection = {
  "@type": "HowToSection";
  name: string;
  itemListElement: HowToStep[];
};

export type ScrapedInstruction = HowToStep | HowToSection | string;

export function findGraphObjectWithRecipeData(inputData: GraphObject[]) {
  const result = inputData.find((obj: GraphObject) => {
    if (typeof obj["@type"] === "string") {
      return obj["@type"] === "Recipe";
    }

    if (Array.isArray(obj["@type"])) {
      return obj["@type"].includes("Recipe");
    }
  });

  return result;
}

// Function to generate array of recipeInstructions
export function generateStringArray(recipeInstructions: HowToStep[]): string[] {
  return recipeInstructions.map((instruction) => instruction.text);
}

// Function to decode ingredients and instructions
export function decodeData(data: string[]): string[] {
  return data.map((item: string) => he.decode(item));
}

// Function to see all potential errors,
// regardless of whether they are instances of Error or something else
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Function to convert ISO 8601 duration format to hours and minutes
export function convertTime(duration: string) {
  // Check if the input is a plain number (e.g., "75")
  const plainMinutes = parseInt(duration);
  if (!isNaN(plainMinutes)) {
    return `${plainMinutes} min`;
  }

  // Regex to match ISO 8601 format (for example "P0Y0M0DT0H75M0S")
  const regex =
    /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?T(?:(\d+(\.\d+)?)H)?(?:(\d+(\.\d+)?)M)?(?:(\d+(\.\d+)?)S)?/;
  const matches = duration.match(regex);

  // If no matches are found, and we can't parse the time because it's written in the wrong format,
  // simply return a dash, which will be the value saved in the users recipe.
  if (!matches) {
    console.log(
      `Could not collect recipe time data. Invalid duration format: "${duration}"`
    );
    return "-";
  }

  // Extract hours and minutes from the T section
  const hours = matches[4] ? Math.floor(parseFloat(matches[4])) : 0; // 0 if undefined
  const minutes = matches[6] ? Math.floor(parseInt(matches[6])) : 0; // 0 if undefined

  // Format the result as "h min"
  return (
    `${hours > 0 ? hours + " h" : ""} ${
      minutes > 0 ? minutes + " min" : ""
    }`.trim() || "0 min"
  );
}

// Function to check if the input is a valid url
export const isValidUrl = (urlToCheck: string): boolean => {
  try {
    // Handle empty or non-string input
    if (!urlToCheck || typeof urlToCheck !== "string") {
      return false;
    }

    // Add https:// prefix if needed
    if (urlToCheck.startsWith("www.")) {
      urlToCheck = "https://" + urlToCheck;
    } else if (
      !urlToCheck.includes("://") &&
      /^[a-zA-Z0-9-]+\.[a-zA-Z0-9.]/.test(urlToCheck)
    ) {
      urlToCheck = "https://" + urlToCheck;
    }

    // Try creating a URL object - validates basic URL structure
    const url = new URL(urlToCheck);

    // Check for supported protocols
    const supportedProtocols = ["http:", "https:"];
    if (!supportedProtocols.includes(url.protocol)) {
      return false;
    }

    // Validate hostname (must have at least one dot and valid characters)
    const hostname = url.hostname;
    if (
      !hostname ||
      !hostname.includes(".") ||
      /[^a-zA-Z0-9-._]/.test(hostname)
    ) {
      return false;
    }

    // Additional checks for common URL patterns
    // - Must have a TLD of at least 2 characters
    // - Hostname must be at least 1 character before the dot
    const hostnameParts = hostname.split(".");
    if (
      hostnameParts.length < 2 ||
      hostnameParts[0].length < 1 ||
      hostnameParts[hostnameParts.length - 1].length < 2
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
