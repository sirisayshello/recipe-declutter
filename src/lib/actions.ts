"use server";

import { getServerSession } from "next-auth";
import { authOptions, getAuth } from "./auth";
import { redirect } from "next/navigation";
import { getRecipeByUserId } from "./queries";

// TODO:
// Rename this function
// export async function test() {
//   const session = await getServerSession(authOptions);
//   console.log("server side log:", session);
//   redirect("/");
// }

export async function getUserRecipes() {
  try {
    // Get current session
    const session = await getAuth();
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }
    // Extract user id from session
    const userId = session.user.id as string;
    // Fetch recipes based on user id
    const recipes = await getRecipeByUserId(userId);
    return recipes;
  } catch (error) {
    console.log("Failed to fetch recipes:", error);
    throw new Error("Failed to fetch recipes.");
  }
}
