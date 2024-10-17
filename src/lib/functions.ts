import he from "he"

// Type for instruction object
export type Instruction = {
  text: string
}

export type GraphObject = {
  "@type": string | unknown[]
  recipeIngredient?: string[]
  recipeInstructions?: Instruction[]
}

export type RawRecipeData =
  | GraphObject
  | { "@graph": GraphObject[] }
  | GraphObject[]

export function findGraphObjectWithRecipeData(inputData: GraphObject[]) {
  const result = inputData.find((obj: GraphObject) => {
    return obj["@type"] === "Recipe"
  })

  return result
}

//Function to generate array of recipeInstructions
export function generateStringArray(
  recipeInstructions: Instruction[]
): string[] {
  return recipeInstructions.map((instruction) => instruction.text)
}

// Function to decode ingredients and instructions
export function decodeData(data: string[]): string[] {
  return data.map((item: string) => he.decode(item))
}

// function to use in catch blocks
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
