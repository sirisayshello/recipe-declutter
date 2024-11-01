type Ingredient = string;

type Instruction = string;

type Recipe = {
  title: string;
  author: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
};

type UserRecipe = {
  id: number;
  title: string;
  slug: string;
  author: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  userId: string | null;
};

type Author = {
  "@type": "Person";
  name: string;
};

type ScrapedAuthor = Author | Author[];

type RecipeError = {
  message: string;
};

type GraphObject = {
  "@type": string | unknown[];
  recipeIngredient?: Ingredient[];
  recipeInstructions?: Instruction[];
  name?: string;
  author?: ScrapedAuthor;
  totalTime?: string;
  recipeYield?: string | number;
};

type RawRecipeData = GraphObject | { "@graph": GraphObject[] } | GraphObject[];

type SaveRecipeResponse = {
  success: boolean;
  data?: {
    id: number;
    title: string;
    slug?: string;
    ingredients: string[];
    instructions: string[];
    author: string;
    time: string;
    yield: string;
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

type HowToStep = {
  "@type": "HowToStep";
  text: string;
  name?: string;
  url?: string;
  image?: string;
};

type HowToSection = {
  "@type": "HowToSection";
  name: string;
  itemListElement: HowToStep[];
};

type ScrapedInstruction = HowToStep | HowToSection | string;
