type Ingredient = string;

type Instruction = string;

type Recipe = {
  title: string;
  id: number;
  slug: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  userId: string | null;
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
