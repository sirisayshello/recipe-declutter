"use server";
import prisma from "./db";

// queries we run from client components:
// (server components can have the queries in the file)

export const deleteRecipeById = async (id: number) => {
  try {
    await prisma.recipe.delete({
      where: {
        id: id,
      },
    });
    console.log("deleted recipe successfully");
  } catch (error) {
    console.log(error);
  }
};
