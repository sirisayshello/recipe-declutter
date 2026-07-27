"use server";

// import { getAuth } from "./auth";
// import { getRecipesByUserId } from "./queries";

// export async function getUserRecipes() {
//   try {
//     // Get current session
//     const session = await getAuth();
//     if (!session || !session.user) {
//       throw new Error("User not authenticated");
//     }
//     // Extract user id from session
//     const userId = session.user.id;
//     // Fetch recipes based on user id
//     const recipes = await getRecipesByUserId(userId);
//     return recipes;
//   } catch (error) {
//     console.log("Failed to fetch recipes:", error);
//     throw new Error("Failed to fetch recipes.");
//   }
// }
