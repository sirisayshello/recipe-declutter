
"use client";
import { useState } from "react";
import { getScrapedRecipe } from "@/lib/scraper";
import {
  Box,
  Button,
  Flex,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { IngredientsAndInstructionsToggle } from "@/components/IngredientsAndInstructionsToggle";

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [recipeError, setRecipeError] = useState<RecipeError | undefined>();
  const [view, setView] = useState("ingredients");

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
    setRecipe(undefined);
    setRecipeError(undefined);

    const url = field.getValue();

    const data = await getScrapedRecipe(url);
    if (isRecipe(data)) {
      setRecipe(data);
      console.log("Recipe:", data);
    } else if (isRecipeError(data)) {
      setRecipeError(data);
      console.log("RecipeError:", data);
    }
    field.reset();
  }

  return (
    <>
      <Box component="section" mt="md">
        <Flex gap="md" justify="center" align="center" direction="column">
          <Title ta="center">Welcome to Recipe Declutter!</Title>
          <Text ta="center">
            Paste, click, and get the essentials — your ingredients and
            instructions at your fingertips.
          </Text>
        </Flex>
        <Space h="xl" />
        <Flex gap="md" justify="center" align="center" direction="column">
          <TextInput
            {...field.getInputProps()}
            aria-label="Enter recipe URL"
            placeholder="Recipe URL"
            radius="xl"
            size="md"
            style={{ width: "100%" }}
          />
          <Button
            fullWidth
            variant="filled"
            color="gray"
            size="md"
            radius="xl"
            onClick={handleSubmit}
          >
            Declutter
          </Button>
        </Flex>
        <Space h="xl" />
      </Box>

      {recipe?.ingredients && recipe.instructions.length > 0 && (
        <IngredientsAndInstructionsToggle
          recipe={recipe}
          view={view}
          setView={setView}
        />
      )}

      {recipeError?.message && (
        <Box component="section" mt="md">
          <Text>{recipeError.message}</Text>
        </Box>
      )}

      <Flex
        direction="column"
        gap="md"
        align="center"
        component="section"
        color="gray"
        mt="md"
      >
        <Title order={2} ta="center">
          Would you like to save your recipes for a later time?
        </Title>
        <Button variant="filled" color="gray" size="md" radius="xl">
          Create account
        </Button>
      </Flex>
      <Space h="xl" />
    </>
  );
}
