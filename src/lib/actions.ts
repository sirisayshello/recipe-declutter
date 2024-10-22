"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

// TODO:
// Rename this function
export async function test() {
  const session = await getServerSession(authOptions);
  console.log("server side log:", session);
  redirect("/");
}
