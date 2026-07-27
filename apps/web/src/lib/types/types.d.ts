type Ingredient = string;

type Instruction = string;

type SectionInstruction = {
  name: string;
  text: Instruction[];
};

type Instructions = Instruction[] | SectionInstruction[];

type SimpleInstructions = Instruction[];

type SectionedInstructions = SectionInstruction[];

type Tag = {
  id?: number;
  name: string;
};

type Recipe = {
  url: string;
  title: string;
  author: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: Instructions;
};

type UserRecipe = {
  tags?: {
    tag: Tag;
  }[];
  url: string;
  title: string;
  slug?: string;
  author: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: Instructions;
  userId?: string | null;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

// type SaveRecipeResponse = {
//   success: boolean;
//   data?: {
//     id: number;
//     url: string;
//     title: string;
//     slug?: string;
//     ingredients: string[];
//     instructions: Instructions;
//     author: string;
//     time: string;
//     yield: string;
//   };
//   error?: {
//     message: string;
//   };
// };

type FormValues = {
  title: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: SimpleInstructions | SectionedInstructions;
};

type Author = {
  "@type": "Person";
  name: string;
};

type ScrapedAuthor = Author | Author[];

type Yield = string | number;

type ScrapedYield = Yield | Yield[];

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
  url?: string;
};

type RawRecipeData = GraphObject | { "@graph": GraphObject[] } | GraphObject[];

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

type EditableItem = {
  id: string;
  text: string;
};

type SetListItem = React.Dispatch<React.SetStateAction<EditableItem[]>>;
type SetListSection = React.Dispatch<
  React.SetStateAction<{ text: EditableItem[] }[]>
>;

type SetListFunction = SetListItem | SetListSection;
