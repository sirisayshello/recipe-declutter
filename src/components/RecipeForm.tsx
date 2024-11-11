"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { getScrapedRecipe } from "@/lib/scraper";
import {
  Flex,
  TextInput,
  Button,
  Box,
  Title,
  rem,
  useMantineTheme,
  Divider,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IngredientsAndInstructionsToggle } from "./IngredientsAndInstructionsToggle";
import { SaveRecipeModal } from "./SaveRecipeModal";
import { Session } from "next-auth";
import { IconCheck, IconX, IconReceiptFilled } from "@tabler/icons-react";

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
  const theme = useMantineTheme();

  const [recipe, setRecipe] = useState<Recipe | undefined>();
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

  // Scroll to the title of the recipe when it is fetched
  const titleRef = useRef<HTMLHeadingElement>(null);

  const scrollToElement = () => {
    const { current } = titleRef;
    if (current) {
      current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToElement();
  }, [recipe]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setRecipe(undefined);

    // Notification for each form submit. Initially as a loading notification.
    const loadingNotification = notifications.show({
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
          id: loadingNotification,
          loading: false,
          autoClose: 1000, // show success for 1 second
          withCloseButton: true,
          closeButtonProps: { "aria-label": "Hide notification" },
          color: "teal",
          title: "Success!",
          message: "Recipe successfully fetched.",
          icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        });

        if (!session)
          //  Display a sign up notification 5 seconds after success
          setTimeout(() => {
            notifications.show({
              id: "signUpNotification",
              loading: false,
              title: "Save this recipe?",
              message: (
                <>
                  <Box pb={"0.5rem"}>
                    Unlock the full experience by creating an account. Keep your
                    recipes saved, customized, and perfectly organized.
                  </Box>
                  <Button onClick={() => setShouldOpenModal(true)}>
                    Create Free Account
                  </Button>
                </>
              ),
              autoClose: false,
              withCloseButton: true,
              withBorder: true,
              px: "lg",
              color: theme.primaryColor,
              icon: (
                <IconReceiptFilled
                  style={{ width: rem(20), height: rem(20) }}
                />
              ),
            });
          }, 2000);
      } else if (data.error) {
        console.error("Error:", data.error);

        // Update notification to show error message
        notifications.update({
          id: loadingNotification,
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
      // Update notification to show error message
      notifications.update({
        id: loadingNotification,
        loading: false,
        autoClose: 5000, // show error for 5 seconds
        withCloseButton: true,
        closeButtonProps: { "aria-label": "Hide notification" },
        color: "red",
        title: "Oh no!",
        message: "Failed to fetch recipe",
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
      });

      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error("An unknown error occurred.");
      }
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

      {recipe?.ingredients && recipe.instructions.length > 0 && (
        <Box component="section" mt="xl">
          <Divider variant="dotted" size="md" />
          <Title order={2} ta="center" id="test" pt="xl" ref={titleRef}>
            {recipe.title}
          </Title>
          <IngredientsAndInstructionsToggle recipe={recipe} />

          {/* Save Recipe button for logged in user */}
          {session && (
            <Button mt={"md"} onClick={() => setShouldOpenModal(true)}>
              Save Recipe
            </Button>
          )}

          {shouldOpenModal && (
            <SaveRecipeModal
              recipe={recipe}
              session={session}
              isOpen={shouldOpenModal}
              onClose={() => setShouldOpenModal(false)}
            />
          )}
        </Box>
      )}
    </>
  );
};
