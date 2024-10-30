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
  const session = await getAuth();
  const userId = session?.user.id as string;
  const recipes = await getRecipeByUserId(userId);
  return recipes;
}
