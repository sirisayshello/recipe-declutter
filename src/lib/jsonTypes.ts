import { Prisma } from "@prisma/client";

export type UserRecipe = {
  tags?: string[];
  id: number;
  url: string;
  title: string;
  slug: string;
  author: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: Prisma.InputJsonArray;
  userId: string | null;
};

export type SaveRecipeResponse = {
  success: boolean;
  data?: {
    id: number;
    url: string;
    title: string;
    slug?: string;
    ingredients: string[];
    instructions: Prisma.InputJsonArray;
    author: string;
    time: string;
    yield: string;
  };
  error?: {
    message: string;
  };
};
