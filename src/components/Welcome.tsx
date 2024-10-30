"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Space,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { IngredientsAndInstructionsToggle } from "@/components/IngredientsAndInstructionsToggle";
import { getScrapedRecipe } from "@/lib/scraper";
import { SaveRecipeComponent } from "@/components/SaveRecipeComponent";

export default function Welcome({ session }: { session: Session | null }) {
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [recipeError, setRecipeError] = useState<RecipeError | undefined>();
  const [loading, setLoading] = useState(false);

  // Type guard function for Recipe
  function isRecipe(data: any): data is Recipe {
    return Array.isArray((data as Recipe).ingredients);
  }

  // Type guard function for RecipeError
  function isRecipeError(data: any): data is RecipeError {
    return (data as RecipeError).message !== undefined;
  }

  const field = useField({
    initialValue: "",
  });

  async function handleSubmit() {
    setLoading(true);

    setRecipe(undefined);
    setRecipeError(undefined);

    const url = field.getValue();

    const data = await getScrapedRecipe(url);
    console.log(data);

    if (isRecipe(data.recipe)) {
      setRecipe(data.recipe);
    } else if (isRecipeError(data)) {
      setRecipeError(data.error);
      console.log("RecipeError:", data.error);
    }
    field.reset();
    setLoading(false);
  }
  return (
    <>
      {/* Move this when we know where to put it :) */}
      <Button
        onClick={() => signOut()}
        variant="filled"
        color="gray"
        size="md"
        radius="xl"
      >
        Sign out
      </Button>

      {/* URL input */}
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction={{ base: "column", sm: "row" }}
      >
        <TextInput
          {...field.getInputProps()}
          aria-label="Enter recipe URL"
          placeholder="Recipe URL"
          radius="xl"
          size="md"
          style={{ width: "100%", flexGrow: 1 }}
        />
        <Button
          fullWidth
          // style={{ flexBasis: "30%" }}
          variant="filled"
          color="gray"
          size="md"
          radius="xl"
          onClick={handleSubmit}
          disabled={loading}
        >
          Declutter
        </Button>
      </Flex>

      {/* Declutter result */}
      {recipe?.ingredients && recipe.instructions.length > 0 && (
        <Box
          component="section"
          style={{
            borderTop: "1px solid var(--mantine-color-gray-3)",
            paddingTop: "10px",
          }}
        >
          <Title order={2} ta="center" mb="md">
            {recipe.title}
          </Title>
          <IngredientsAndInstructionsToggle recipe={recipe} />
        </Box>
      )}

      {/* If any errors */}
      {recipeError?.message && (
        <Box component="section" mt="md">
          <Text>{recipeError.message}</Text>
        </Box>
      )}

      {/* Save recipe */}
      <Space h="xl" />
      {recipe && (
        <Box component="section" mb="md">
          <SaveRecipeComponent recipe={recipe} session={session} />
        </Box>
      )}
    </>
  );
}
