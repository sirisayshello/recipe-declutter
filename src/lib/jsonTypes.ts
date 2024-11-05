import { Prisma } from "@prisma/client";

export type UserRecipe = {
  tags?: string[];
  id: number;
  title: string;
  slug: string;
  author: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: Prisma.JsonValue;
  userId: string | null;
};

export type SaveRecipeResponse = {
  success: boolean;
  data?: {
    id: number;
    title: string;
    slug?: string;
    ingredients: string[];
    instructions: Prisma.JsonValue;
    author: string;
    time: string;
    yield: string;
  };
  error?: {
    message: string;
  };
};
