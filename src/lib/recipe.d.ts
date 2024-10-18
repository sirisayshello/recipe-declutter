type Ingredient = string;

type Instruction = string;

type Recipe = {
  ingredients: Ingredient[];
  instructions: Instruction[];
};

type RecipeError = {
  message: string;
};
