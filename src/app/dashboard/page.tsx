import React from "react";
import CategoryFilter from "@/components/CategoryFilter";
import prisma from "@/lib/db";
import { Anchor, Center, List, Stack, Title } from "@mantine/core";

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
        <Title order={2}>Recent recipes</Title>
        <List listStyleType="none">
          {recipes.map((recipe) => {
            return (
              <li
                key={recipe.id}
                style={{
                  borderBottom: "1px solid var(--mantine-color-gray-3)",
                  padding: "10px 0",
                }}
              >
                <Anchor href={`/dashboard/${recipe.id}`} underline="never">
                  {recipe.title}
                </Anchor>
              </li>
            );
          })}
        </List>
      </Stack>
    </>
  );
}
