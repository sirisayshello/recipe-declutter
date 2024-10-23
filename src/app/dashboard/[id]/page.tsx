import Link from "next/link";
import { Box, Typography, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import prisma from "@/lib/db";
import RecipeList from "@/components/RecipeList";

export default async function Recipe({ params }: { params: { id: string } }) {
  const { id } = params;

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (recipe === null) {
    return <div>something went wrong</div>;
  }

  return (
    <>
      <Box
        className="iconBanner"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Link href="/dashboard">
          <ArrowBackIcon />
        </Link>
        <Link href={`/dashboard/${recipe.id}/edit`}>
          <EditIcon />
        </Link>
      </Box>
      <Box component="section">
        <Typography variant="h1">{recipe.title}</Typography>
        <Box className="recipeChips">
          <Chip label="Breakfast" />
          <Chip label="Dessert" />
          <Chip label="Pancakes" />
        </Box>
      </Box>

      <RecipeList {...recipe} />
    </>
  );
}
