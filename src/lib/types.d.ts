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
  name?: string;
};

type RawRecipeData = GraphObject | { "@graph": GraphObject[] } | GraphObject[];

type SaveRecipeResponse = {
  success: boolean;
  data?: {
    id: number;
    title: string;
    ingredients: string[];
    instructions: string[];
  };
  error?: {
    message: string;
  };
};

type GetScrapedRecipeResponse = {
  success: boolean;
  data?: {
    title: string;
    ingredients: string[];
    instructions: string[];
  };
  error?: {
    message: string;
  };
};
