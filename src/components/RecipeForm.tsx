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
import { useState } from "react";
import { IngredientsAndInstructionsToggle } from "./IngredientsAndInstructionsToggle";
import { SaveRecipeComponent } from "./SaveRecipeComponent";
import { Session } from "next-auth";
import Link from "next/link";

type RecipeFormProps = {
  session?: Session | null;
};

export const RecipeForm = ({ session }: RecipeFormProps) => {
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [recipeError, setRecipeError] = useState<RecipeError | undefined>();
  const [loading, setLoading] = useState(false);

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

    if (data.recipe) {
      setRecipe({ ...data.recipe, url });
    } else if (data.error) {
      setRecipeError(data.error);
      console.log("RecipeError:", data.error);
    }
    field.reset();
    setLoading(false);
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
          // style={{ flexBasis: "30%" }}
          variant="filled"
          size="md"
          onClick={handleSubmit}
          disabled={loading}
          type="submit"
        >
          Declutter
        </Button>
      </Flex>

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

          {session !== undefined ? (
            <Box component="section" mb="md">
              {recipe && (
                <SaveRecipeComponent recipe={recipe} session={session} />
              )}
            </Box>
          ) : (
            recipe && (
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
                <Button
                  href="/signup"
                  component={Link}
                  variant="filled"
                  size="md"
                >
                  Create account
                </Button>
              </Flex>
            )
          )}
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
