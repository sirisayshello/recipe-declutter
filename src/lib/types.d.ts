type Ingredient = string;

type Instruction = string;

type Recipe = {
  ingredients: Ingredient[];
  instructions: Instruction[];
};

type RecipeError = {
  message: string;
};

type GraphObject = {
  "@type": string | unknown[];
  recipeIngredient?: Ingredient[];
  recipeInstructions?: Instruction[];
};

type RawRecipeData = GraphObject | { "@graph": GraphObject[] } | GraphObject[];
