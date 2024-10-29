type Ingredient = string;

type Instruction = string;

type Recipe = {
  title: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
};

type userRecipe = {
  id: number;
  title: string;
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
  recipe?: Recipe;
  error?: {
    message: string;
  };
};
