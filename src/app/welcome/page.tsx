"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { getScrapedRecipe } from "@/lib/scraper";
import { Session } from "next-auth";
import { saveRecipe } from "@/lib/queries";
import { signOut } from "next-auth/react";

export default function WelcomePage({ session }: { session: Session | null }) {
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [recipeError, setRecipeError] = useState<RecipeError | undefined>();
  const [url, setUrl] = useState("");
  const [view, setView] = useState("ingredients");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  function handleUrlInputChange(e: any) {
    setUrl(e.target.value);
  }

  async function handleSaveRecipe() {
    try {
      setIsLoading(true);
      setError(null);

      const result = await saveRecipe(session?.user?.email, recipe);

      if (!result.success) {
        setError(result.error?.message || "Failed to save recipe");
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={() => signOut()}>
        Sign Out
      </Button>
      {/* form section */}
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
          onChange={handleUrlInputChange}
          value={url}
        />
        <Button type="submit" variant="contained" color="primary" size="large">
          Declutter
        </Button>
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

      {/* Error section for saving recipes. Probably we should combine this with the recipeError handling above. */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      {/* When successfully saving a recipe: */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Recipe saved successfully!
        </Alert>
      </Snackbar>

      {recipe && (
        <Box
          component="form"
          onSubmit={handleSaveRecipe}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleSaveRecipe}
            disabled={isLoading}
            variant="contained"
            color="primary"
            size="large"
          >
            {isLoading ? "Saving..." : "Save Recipe"}
          </Button>
        </Box>
      )}
      {/* recent recipes */}
      <div>recent recipes...</div>
    </>
  );
}
