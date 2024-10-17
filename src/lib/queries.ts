"use server";
import prisma from "./db";

export const getRecipes = async () => {
  const recipes = await prisma.recipe.findMany();
  return recipes;
};
