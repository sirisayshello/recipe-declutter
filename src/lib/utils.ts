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
export function generateStringArray(recipeInstructions: Instruction[]) {
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
