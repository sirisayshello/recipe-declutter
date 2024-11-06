"use client";

import { getScrapedRecipe } from "@/lib/scraper";
import {
  Flex,
  TextInput,
  Button,
  Box,
  Title,
  Text,
  Space,
  LoadingOverlay,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { useEffect, useState } from "react";
import { IngredientsAndInstructionsToggle } from "./IngredientsAndInstructionsToggle";
import { SaveRecipeComponent } from "./SaveRecipeComponent";
import { Session } from "next-auth";
import CreateAccountCTA from "./CTABanner";


type RecipeFormProps = {
  session?: Session | null;
};

const PENDING_RECIPE_KEY = "pendingRecipeToSave";

const getPendingRecipe = () => {
  if (typeof window === "undefined") return null;
  const recipe = localStorage.getItem(PENDING_RECIPE_KEY);
  return recipe ? JSON.parse(recipe) : null;
};

const clearPendingRecipe = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PENDING_RECIPE_KEY);
  }
};

export const RecipeForm = ({ session }: RecipeFormProps) => {
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [recipeError, setRecipeError] = useState<RecipeError | undefined>();
  const [loading, setLoading] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const field = useField({
    initialValue: "",
  });

  useEffect(() => {
    // Check for pending recipe if session is available
    if (session) {
      const pendingRecipe = getPendingRecipe();
      if (pendingRecipe) {
        setRecipe(pendingRecipe);
        setShouldOpenModal(true);
        clearPendingRecipe();
      }
    }
  }, [session]);

  async function handleSubmit() {
    setLoading(true);
    setRecipe(undefined);
    setRecipeError(undefined);

    try {
      const url = field.getValue();
      const data = await getScrapedRecipe(url);

      if (data.recipe) {
        setRecipe({ ...data.recipe, url });
      } else if (data.error) {
        setRecipeError(data.error);
        console.log("RecipeError:", data.error);
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setRecipeError({ message: "Failed to fetch recipe" });
    } finally {
      field.reset();
      setLoading(false);
    }
  }

  return (
    <>
      <Flex
        component="form"
        gap="md"
        justify="center"
        align="center"
        direction={{ base: "column", sm: "row" }}
      >
        <LoadingOverlay visible={loading} overlayProps={{ blur: 3 }} />

        <TextInput
          {...field.getInputProps()}
          aria-label="Enter recipe URL"
          placeholder="Recipe URL"
          size="md"
          style={{ width: "100%", flexGrow: 1 }}
          disabled={loading}
        />
        <Button
          fullWidth
          variant="filled"
          size="md"
          onClick={handleSubmit}
          disabled={loading}
          type="submit"
        >
          Declutter
        </Button>
      </Flex>

      <CreateAccountCTA />
      {recipe?.ingredients && recipe.instructions.length > 0 && (
        <Box
          component="section"
          pt="md"
          mt="xl"
          style={{
            borderTop: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Title order={2} ta="center">
            {recipe.title}
          </Title>
          <IngredientsAndInstructionsToggle recipe={recipe} />

          <Box component="section" mb="md">
            {recipe && (
              <SaveRecipeComponent
                recipe={recipe}
                session={session}
                isOpen={shouldOpenModal}
                onClose={() => setShouldOpenModal(false)}
              />
            )}
          </Box>
        </Box>
      )}

      {recipeError?.message && (
        <Box component="section" mt="md">
          <Text>{recipeError.message}</Text>
        </Box>
      )}
      <Space h="xl" />
    </>
  );
};
