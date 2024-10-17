type Ingredient = {
  text: string;
};

type Instruction = {
  text: string;
};

type Recipe =
  | {
      ingredients: Ingredient[];
      instructions: Instruction[];
    }
  | { message: string };
