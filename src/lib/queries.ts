"use server";
import prisma from "./db";
import { generateSlug } from "./utils";

// Wrapper function to use when we want to fetch all recipes in a client component:
export const getRecipes = async () => {
  const recipes = await prisma.recipe.findMany();
  return recipes;
};

// Delete recipe by id. Function is called on a click event.
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

// Save a recipe to the database as a logged in user:
export const saveRecipe = async (
  userEmail: string | null | undefined,
  recipe: Recipe | undefined
): Promise<SaveRecipeResponse> => {
  try {
    if (!userEmail) {
      return {
        success: false,
        error: {
          message: "You must be logged in to save recipes",
        },
      };
    }

    // get the authenticated user from the db, by email
    // maybe change to query by id instead?
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return {
        success: false,
        error: {
          message: "User not found",
        },
      };
    }

    if (!recipe) {
      return {
        success: false,
        error: {
          message: "Invalid or no recipe data provided",
        },
      };
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title: recipe.title,
        slug: generateSlug(recipe.title),
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        userId: user.id,
      },
    });

    return {
      success: true,
      data: newRecipe,
    };
  } catch (error) {
    console.error("Failed to save recipe:", error);

    return {
      success: false,
      error: {
        message: "Failed to save recipe. Please try again later.",
      },
    };
  }
};

// Update and save a recipe to the database as a logged in user:
export const updateRecipe = async (
  // userEmail: string | null | undefined,
  recipe: UserRecipe | undefined
): Promise<SaveRecipeResponse> => {
  try {
    // if (!userEmail) {
    //   return {
    //     success: false,
    //     error: {
    //       message: "You must be logged in to save recipes",
    //     },
    //   };
    // }

    // get the authenticated user from the db, by email
    // maybe change to query by id instead?
    // const user = await prisma.user.findUnique({
    //   where: { email: userEmail },
    // });

    // if (!user) {
    //   return {
    //     success: false,
    //     error: {
    //       message: "User not found",
    //     },
    //   };
    // }

    if (!recipe) {
      return {
        success: false,
        error: {
          message: "Invalid or no recipe data provided",
        },
      };
    }

    // Upsert the recipe in the db, create if it does not exist
    const updatedRecipe = await prisma.recipe.upsert({
      where: { id: recipe.id },
      update: {
        title: recipe.title,
        slug: generateSlug(recipe.title),
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      },
      create: {
        title: recipe.title,
        slug: generateSlug(recipe.title),
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        // userId: user.id,
      },
    });

    return {
      success: true,
      data: updatedRecipe,
    };
  } catch (error) {
    console.error("Failed to update recipe:", error);

    return {
      success: false,
      error: {
        message: "Failed to update recipe. Please try again later.",
      },
    };
  }
};

// Get recipes by user id
export const getRecipeByUserId = async (userId: string) => {
  try {
    const userRecipes = await prisma.recipe.findMany({
      where: { userId: userId },
    });
    return userRecipes;
  } catch (error) {
    console.log("Error fetching user recipes", error);
    throw new Error("Failed to fetch recipes. Please try again later.");
  }
};
