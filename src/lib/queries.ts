"use server";
import { Prisma } from "@prisma/client";
import prisma from "./db";
import { generateSlug } from "./utils";

type SaveRecipeResponse = {
  success: boolean;
  data?: {
    id: number;
    url: string;
    title: string;
    slug?: string;
    ingredients: string[];
    instructions: Instructions | Prisma.JsonValue;
    author: string;
    time: string;
    yield: string;
    tags: {
      id: number;
      name: string;
    }[];
  };
  error?: {
    message: string;
  };
};

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
  recipe: UserRecipe | undefined
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

    const result = await prisma.$transaction(async (tx) => {
      // Create the recipe
      const createdRecipe = await tx.recipe.create({
        data: {
          url: recipe.url,
          title: recipe.title,
          slug: generateSlug(recipe.title),
          author: recipe.author,
          time: recipe.time,
          yield: recipe.yield,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          userId: user.id,
        },
      });

      if (recipe.tags && recipe.tags.length > 0) {
        // Find existing tags or create new ones
        const tagPromises = recipe.tags.map(async (tagName) => {
          return await tx.tag.upsert({
            where: { name: tagName.toLowerCase() },
            update: {},
            create: { name: tagName.toLowerCase() },
          });
        });

        const tags = await Promise.all(tagPromises);

        // Create recipe-tag relationships
        const recipeTagPromises = tags.map((tag) => {
          return tx.recipeTag.create({
            data: {
              recipeId: createdRecipe.id,
              tagId: tag.id,
            },
          });
        });

        await Promise.all(recipeTagPromises);
      }

      // Get the final recipe with tags in the correct format
      const finalRecipe = await tx.recipe.findUnique({
        where: { id: createdRecipe.id },
        select: {
          id: true,
          url: true,
          title: true,
          slug: true,
          ingredients: true,
          instructions: true,
          author: true,
          time: true,
          yield: true,
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!finalRecipe) {
        throw new Error("Failed to retrieve saved recipe");
      }

      return {
        id: finalRecipe.id,
        url: finalRecipe.url,
        title: finalRecipe.title,
        slug: finalRecipe.slug,
        ingredients: finalRecipe.ingredients,
        instructions: finalRecipe.instructions,
        author: finalRecipe.author,
        time: finalRecipe.time,
        yield: finalRecipe.yield,
        tags: finalRecipe.tags.map((t) => ({
          id: t.tag.id,
          name: t.tag.name,
        })),
      };
    });

    return {
      success: true,
      data: result,
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

export const updateRecipe = async (
  recipe: UserRecipe
): Promise<SaveRecipeResponse> => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingTags = await tx.recipeTag.findMany({
        where: { recipeId: recipe.id },
        include: {
          tag: true,
        },
      });

      const existingTagNames = existingTags.map((rt) => rt.tag.name);
      const newTagNames = recipe.tags?.map((t) => t.toLowerCase()) || [];

      // Find tags to remove (tags that exist but aren't in the new list)
      const tagsToRemove = existingTags.filter(
        (et) => !newTagNames.includes(et.tag.name)
      );

      // Find tag names to add (tags that are in the new list but don't exist yet)
      const tagNamesToAdd = newTagNames.filter(
        (tn) => !existingTagNames.includes(tn)
      );

      // Update or create the recipe
      const updatedRecipe = await tx.recipe.upsert({
        where: { id: recipe.id },
        update: {
          url: recipe.url,
          title: recipe.title,
          slug: generateSlug(recipe.title),
          time: recipe.time,
          yield: recipe.yield,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions ?? [],
        },
        create: {
          url: recipe.url,
          title: recipe.title,
          slug: generateSlug(recipe.title),
          author: recipe.author,
          time: recipe.time,
          yield: recipe.yield,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions ?? [],
        },
      });

      // Remove only the tags that aren't in the new list
      if (tagsToRemove.length > 0) {
        await tx.recipeTag.deleteMany({
          where: {
            AND: [
              { recipeId: recipe.id },
              { tagId: { in: tagsToRemove.map((t) => t.tagId) } },
            ],
          },
        });
      }

      // Add only new tags
      if (tagNamesToAdd.length > 0) {
        // Upsert new tags
        const newTagPromises = tagNamesToAdd.map(async (tagName) => {
          return await tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
        });

        const newTags = await Promise.all(newTagPromises);

        // Create new recipe-tag relationships
        const newRecipeTagPromises = newTags.map((tag) => {
          return tx.recipeTag.create({
            data: {
              recipeId: updatedRecipe.id,
              tagId: tag.id,
            },
          });
        });

        await Promise.all(newRecipeTagPromises);
      }

      // Fetch the final recipe with tags
      const finalRecipe = await tx.recipe.findUnique({
        where: { id: updatedRecipe.id },
        select: {
          id: true,
          url: true,
          title: true,
          slug: true,
          ingredients: true,
          instructions: true,
          author: true,
          time: true,
          yield: true,
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!finalRecipe) {
        throw new Error("Failed to retrieve updated recipe");
      }

      return {
        id: finalRecipe.id,
        url: finalRecipe.url,
        title: finalRecipe.title,
        slug: finalRecipe.slug,
        ingredients: finalRecipe.ingredients,
        instructions: finalRecipe.instructions,
        author: finalRecipe.author,
        time: finalRecipe.time,
        yield: finalRecipe.yield,
        tags: finalRecipe.tags.map((t) => ({
          id: t.tag.id,
          name: t.tag.name,
        })),
      };
    });

    return {
      success: true,
      data: result,
      error: undefined,
    };
  } catch (error) {
    console.error("Failed to update recipe:", error);
    return {
      success: false,
      data: undefined,
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
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });
    return userRecipes;
  } catch (error) {
    console.log("Error fetching user recipes", error);
    throw new Error("Failed to fetch recipes. Please try again later.");
  }
};
