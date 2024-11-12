"use client";

import { useEffect, useState, FormEvent } from "react";
import { getScrapedRecipe } from "@/lib/scraper";
import { Flex, TextInput, Button, Box, Title, Space, rem } from "@mantine/core";
import { useField } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IngredientsAndInstructionsToggle } from "./IngredientsAndInstructionsToggle";
import { SaveRecipeComponent } from "./SaveRecipeComponent";
import { Session } from "next-auth";
import { CTABanner } from "./CTABanner";
import { IconCheck, IconX } from "@tabler/icons-react";

type RecipeFormProps = {
  session?: Session | null;
  userTags?: Tag[];
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

export const RecipeForm = ({ session, userTags }: RecipeFormProps) => {
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setRecipe(undefined);
    setRecipeError(undefined);

    // Notification for each request
    const id = notifications.show({
      loading: true,
      title: "Just a moment",
      message: "Fetching recipe from URL",
      autoClose: false,
      withCloseButton: false,
      withBorder: true,
      px: "lg",
    });

    try {
      const url = field.getValue();
      const data = await getScrapedRecipe(url);

      // Half a second delay so that the loading spinner doesn't just flash
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (data.recipe) {
        setRecipe({ ...data.recipe, url });

        // Update notification to show success message
        notifications.update({
          id,
          loading: false,
          autoClose: 1000, // show success for 1 second
          withCloseButton: true,
          closeButtonProps: { "aria-label": "Hide notification" },
          color: "teal",
          title: "Success!",
          message: "Recipe successfully fetched.",
          icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        });
      } else if (data.error) {
        setRecipeError(data.error);
        console.log("RecipeError:", data.error);

        // Update notification to show error message
        notifications.update({
          id,
          loading: false,
          autoClose: 5000, // show error for 5 seconds
          withCloseButton: true,
          closeButtonProps: { "aria-label": "Hide notification" },
          color: "red",
          title: "Oh no!",
          message: data.error.message,
          icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        });
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setRecipeError({ message: "Failed to fetch recipe" });
      console.log(recipeError);
    } finally {
      field.reset();
      setLoading(false);
    }
  }

  return (
    <>
      <Flex
        onSubmit={(e) => handleSubmit(e)}
        component="form"
        gap="md"
        justify="center"
        align="center"
        direction={{ base: "column", xs: "row" }}
      >
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
          disabled={loading}
          type="submit"
        >
          Declutter
        </Button>
      </Flex>

      {!session && <CTABanner />}

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
                userTags={userTags}
                session={session}
                isOpen={shouldOpenModal}
                onClose={() => setShouldOpenModal(false)}
              />
            )}
          </Box>
        </Box>
      )}
      <Space h="xl" />
    </>
  );
};
