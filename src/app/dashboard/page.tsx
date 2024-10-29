import React from "react";
import CategoryFilter from "@/components/CategoryFilter";
import prisma from "@/lib/db";
import { Center, Stack, Title } from "@mantine/core";
import { RecentRecipes } from "@/components/RecentRecipes";

// categories hardcoded for now
const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Zucchini",
  "Snacks",
  "Chocolate",
  "Oats",
  "Potatoes",
  "Carrots",
];

export default async function Dashboard() {
  const recipes = await prisma.recipe.findMany();

  return (
    <>
      <Center component="section" mt="md">
        <Title mb="xl">Your Recipes</Title>
      </Center>

      <Stack component="section">
        <CategoryFilter categories={categories} />
        <RecentRecipes recipes={recipes} />
      </Stack>
    </>
  );
}
