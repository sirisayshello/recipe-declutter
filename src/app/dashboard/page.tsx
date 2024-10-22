import { Box, List, ListItem, Typography } from "@mui/material";
import React from "react";
import CategoryFilter from "@/components/CategoryFilter";
import prisma from "@/lib/db";
import Link from "next/link";

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
      <Box component="section" sx={{ p: 2 }}>
        <Typography variant="h1">Your Recipes</Typography>
      </Box>

      <Box component="section" sx={{ p: 2, backgroundColor: "grey.300" }}>
        <CategoryFilter categories={categories} />
        <Typography variant="h2">Recent recipes</Typography>
        <List>
          {recipes.map((recipe) => (
            <ListItem divider key={recipe.id}>
              <Link href={`/dashboard/${recipe.id}`}>{recipe.title}</Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
