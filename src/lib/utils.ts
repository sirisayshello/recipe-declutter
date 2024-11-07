import he from "he";

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

// function to use in catch blocks
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .normalize("NFD") // Normalize special characters (é -> e)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-+/, "") // Remove leading dashes
    .replace(/-+$/, ""); // Remove trailing dashes
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

export function isSectionedInstruction(
  instructions: Instructions
): instructions is SectionedInstructions {
  return (
    Array.isArray(instructions) &&
    instructions.length > 0 &&
    typeof instructions[0] === "object" &&
    instructions[0] !== null &&
    "name" in instructions[0] &&
    "text" in instructions[0]
  );
}

export function isSimpleInstruction(
  instructions: Instructions
): instructions is SimpleInstructions {
  return (
    Array.isArray(instructions) &&
    (instructions.length === 0 || typeof instructions[0] === "string")
  );
}
