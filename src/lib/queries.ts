"use server";
import { Prisma } from "@prisma/client";
import prisma from "./db";
import { generateSlug } from "./utils";

type SaveRecipeResponse = {
  success: boolean;
  data?: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
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
            where: { name: tagName.tag.name.toLowerCase() },
            update: {},
            create: { name: tagName.tag.name.toLowerCase() },
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
          createdAt: true,
          updatedAt: true,
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
        createdAt: finalRecipe.createdAt,
        updatedAt: finalRecipe.updatedAt,
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

      const existingTagNames = existingTags.map(
        (recipeTag) => recipeTag.tag.name
      );
      const incomingTags = recipe.tags?.map((incomingTag) => incomingTag) || [];
      const incomingTagNames = incomingTags.map((tag) => tag.tag.name);

      const tagsToRemove = existingTags.filter(
        (et) => !incomingTagNames.includes(et.tag.name)
      );

      const tagNamesToAdd = incomingTags.filter(
        (tn) => !existingTagNames.includes(tn.tag.name)
      );

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

      // Remove tags that aren't in the new list
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
        const newTagPromises = tagNamesToAdd.map(async (tag) => {
          return await tx.tag.upsert({
            where: { name: tag.tag.name.toLowerCase() },
            update: {},
            create: { name: tag.tag.name.toLowerCase() },
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
          createdAt: true,
          updatedAt: true,
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
        createdAt: finalRecipe.createdAt,
        updatedAt: finalRecipe.updatedAt,
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

type SortOption =
  | "title"
  | "author"
  | "createdAt"
  | "updatedAt"
  | "time"
  | "yield";

export const getRecipesByUserId = async (
  userId: string,
  limit: number | "noLimit" = "noLimit",
  orderBy: SortOption = "createdAt",
  descending: boolean = true
) => {
  const orderSettings = {
    [orderBy]: descending ? "desc" : "asc",
  };

  try {
    const queryOptions: Prisma.RecipeFindManyArgs = {
      where: { userId: userId },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
      orderBy: orderSettings,
    };

    if (limit !== "noLimit") {
      queryOptions.take = limit;
    }

    const userRecipes = await prisma.recipe.findMany(queryOptions);

    return userRecipes;
  } catch (error) {
    console.log("Error fetching user recipes", error);
    throw new Error("Failed to fetch recipes. Please try again later.");
  }
};

export const getUserTags = async (userId?: string | null) => {
  if (!userId) {
    return [];
  }
  try {
    const userTags = await prisma.tag.findMany({
      where: { recipes: { some: { recipe: { userId } } } },
    });
    return userTags;
  } catch (error) {
    console.log("Error fetching user tags", error);
    throw new Error("Failed to fetch tags. Please try again later.");
  }
};
