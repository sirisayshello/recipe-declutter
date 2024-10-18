type Ingredient = string;

type Instruction = string;

type Recipe =
  | {
      ingredients: Ingredient[];
      instructions: Instruction[];
    }
  | { message: string };
