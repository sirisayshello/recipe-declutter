"use client";
import { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";

import { getScrapedRecipe } from "@/lib/scraper";

export default function Dashboard() {
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [recipeError, setRecipeError] = useState<RecipeError | undefined>();
  const [url, setUrl] = useState("");
  const [view, setView] = useState("ingredients");

  // Type guard function for Recipe
  function isRecipe(data: any): data is Recipe {
    return Array.isArray((data as Recipe).ingredients);
  }

  // Type guard function for RecipeError
  function isRecipeError(data: any): data is RecipeError {
    return (data as RecipeError).message !== undefined;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    setRecipe(undefined);
    setRecipeError(undefined);

    const data = await getScrapedRecipe(url);

    if (isRecipe(data)) {
      setRecipe(data);
      // if success, clear the input field:
      setUrl("");
      console.log("Recipe:", data);
    } else if (isRecipeError(data)) {
      setRecipeError(data);
      console.log("RecipeError:", data);
    }
  }

  function handleInputChange(e: any) {
    setUrl(e.target.value);
  }

  return (
    <>
      {/* "hero" and form section: */}
      <Box component="section">
        <Typography variant="h1">Welcome to Recipe Declutter!</Typography>
        <Typography variant="body1">
          Paste, click, and get the essentials—your ingredients and instructions
          at your fingertips.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            id="outlined-basic"
            // label="Enter your recipe URL"
            variant="outlined"
            placeholder="Enter your recipe URL"
            onChange={handleInputChange}
            value={url}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Declutter
          </Button>
        </Box>
      </Box>

      {/* recipe section: */}
      {recipe?.ingredients && recipe.instructions.length > 0 && (
        <Box component="section">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              sx={
                view === "ingredients"
                  ? { backgroundColor: "grey.700" }
                  : { backgroundColor: "grey.500" }
              }
              onClick={() => setView("ingredients")}
            >
              Ingredients
            </Button>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={
                view === "instructions"
                  ? { backgroundColor: "grey.700" }
                  : { backgroundColor: "grey.500" }
              }
              onClick={() => setView("instructions")}
            >
              Instructions
            </Button>
          </Box>

          {view === "ingredients" && (
            <List component="ul" sx={{ listStyleType: "disc", pl: 2 }}>
              {recipe.ingredients.map((ingredient, index) => {
                return (
                  <ListItem key={index} sx={{ display: "list-item", pl: 0 }}>
                    {ingredient}
                  </ListItem>
                );
              })}
            </List>
          )}

          {view === "instructions" && (
            <List component="ol" sx={{ listStyleType: "decimal", pl: 2 }}>
              {recipe.instructions.map((instruction, index) => {
                return (
                  <ListItem key={index} sx={{ display: "list-item", pl: 0 }}>
                    {instruction}
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      )}

      {/* error section: */}
      {recipeError?.message && (
        <Box component="section">
          <Typography variant="body1">{recipeError.message}</Typography>
        </Box>
      )}

      {/* save recipe section: */}
      <Box
        component="section"
        sx={{
          bgcolor: "grey.500",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          Would you like to save your recipes for a later time?
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Create Account
        </Button>
      </Box>
    </>
  );
}
