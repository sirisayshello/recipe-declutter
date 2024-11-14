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
  Divider,
  Alert,
  Stack,
  Transition,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { notifications, useNotifications } from "@mantine/notifications";

import { IngredientsAndInstructionsToggle } from "./IngredientsAndInstructionsToggle";
import { SaveRecipeModal } from "./SaveRecipeModal";
import { Session } from "next-auth";
import { IconCheck, IconChefHat, IconX } from "@tabler/icons-react";
import Link from "next/link";
import ScreenAwakeToggle from "./ScreenAwakeToggle";

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
  const [loading, setLoading] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const notificationsStore = useNotifications();

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
    <Stack
      // Styling dependent on whether banner should be displayed on the bottom (space-between),
      // or if a should follow directly under the form (flex-start)
      h={!recipe?.ingredients && !session ? "100%" : ""}
      {...(!recipe?.ingredients && !session
        ? { justify: "space-between" }
        : { justify: "flex-start" })}
    >
      {/* form section */}
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

      {/* recipe section */}
      {recipe?.ingredients && recipe.instructions.length > 0 && (
        <Box component="section" style={{ justifySelf: "flex-start" }}>
          <Divider variant="dotted" size="md" />
          <Title order={2} ta="center" pt="xl" ref={titleRef}>
            {recipe.title}
          </Title>
          <ScreenAwakeToggle />
          <IngredientsAndInstructionsToggle recipe={recipe} />

          <Button mt="md" mb="xl" onClick={() => setShouldOpenModal(true)}>
            Save This Recipe
          </Button>

          {shouldOpenModal && (
            <SaveRecipeModal
              recipe={recipe}
              userTags={userTags}
              session={session}
              isOpen={shouldOpenModal}
              onClose={() => setShouldOpenModal(false)}
            />
          )}
          <Divider variant="dotted" size="md" />
        </Box>
      )}

      {/* sign up banner */}
      {/* Only shown when there is no scraped recipe, user is not logged in and no notifications are on screen */}
      <Transition
        mounted={
          !recipe?.ingredients &&
          !session &&
          notificationsStore.notifications.length === 0
        }
        transition="slide-down"
        duration={300}
        timingFunction="ease"
      >
        {(styles) => (
          <Box mt="auto" style={styles}>
            <Alert
              variant="light"
              title="Save, Edit & Organize Recipes"
              icon={<IconChefHat />}
            >
              <Box>
                Unlock the full experience by creating an account. Keep your
                recipes saved, customized, and perfectly organized.
              </Box>
              <Button component={Link} href={"/signup"} mt={"md"}>
                Create Free Account
              </Button>
            </Alert>
          </Box>
        )}
      </Transition>
    </Stack>
  );
};
