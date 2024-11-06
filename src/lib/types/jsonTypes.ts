import { Prisma } from "@prisma/client";

//Recipe before saving to the database
export type UserRecipe = {
  tags?: string[];
  url: string;
  title: string;
  slug: string;
  author: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: Prisma.JsonValue;
  userId: string | null;
  id: number;
};

export type SaveRecipeResponse = {
  success: boolean;
  data?: {
    id: number;
    url: string;
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
