"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { getScrapedRecipe } from "@/lib/scraper";
import {
  Flex,
  TextInput,
  Button,
  Box,
  Title,
  Divider,
  Stack,
  Transition,
  Space,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";

import { IngredientsAndInstructionsToggle } from "./IngredientsAndInstructionsToggle";
import { SaveRecipeModal } from "./SaveRecipeModal";
import { Session } from "next-auth";
import {
  showLoadingNotification,
  updateNotificationAsError,
  updateNotificationAsSuccess,
} from "@/lib/notifications";
import { ScreenAwakeToggle } from "./ScreenAwakeToggle";
import { Confetti } from "./Confetti";
import { CreateAccountBanner } from "./CreateAccountBanner";

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
  const [confetti, setConfetti] = useState<boolean>(false);

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

  // When a recipe is fetched successfully; Celebrate with confetti!
  useEffect(() => {
    if (recipe) {
      setConfetti(true);
    } else {
      setConfetti(false);
    }
  }, [recipe]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setRecipe(undefined);

    // Notification for each form submit. Initially as a loading notification.
    const loadingNotification = showLoadingNotification(
      "Fetching recipe from URL"
    );

    try {
      const url = field.getValue();
      const data = await getScrapedRecipe(url);

      // Half a second delay so that the loading spinner doesn't just flash
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (data.recipe) {
        setRecipe({ ...data.recipe, url });

        // Update notification to show success message
        updateNotificationAsSuccess(
          loadingNotification,
          "Recipe successfully fetched."
        );
      } else if (data.error) {
        console.error("Error:", data.error);

        // Update notification to show error message
        updateNotificationAsError(loadingNotification, data.error.message);
      }
    } catch (error) {
      // Update notification to show error message
      updateNotificationAsError(loadingNotification, "Failed to fetch recipe");

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

  const hasResult = recipe?.ingredients && recipe.instructions.length > 0;

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
        direction={{ base: "column", xs: "row" }}
        maw={{ base: "100%", xs: "645px" }}
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
      {confetti && <Confetti />}

      {!hasResult && <Space h={{ base: "4rem", xs: "8rem" }} />}
      {hasResult && (
        <Box
          mb={"md"}
          component="section"
          style={{ justifySelf: "flex-start" }}
        >
          <Divider my="md" />

          <Box
            mb="md"
            display={{ base: "block", sm: "flex" }}
            style={{ justifyContent: "space-between", alignItems: "flex-end" }}
          >
            <Title order={2} ta="center" pt="xl" ref={titleRef}>
              {recipe.title}
            </Title>

            {/* ScreenAwakeToggle rendered inside IngredientsAndInstructionsToggle on small screens */}
            <ScreenAwakeToggle labelPosition="left" visibleFrom="sm" />
          </Box>

          <IngredientsAndInstructionsToggle recipe={recipe} />

          <Button mt="xl" mb="xl" onClick={() => setShouldOpenModal(true)}>
            Save this recipe
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
          <Divider my="md" />
        </Box>
      )}

      {/* sign up banner */}
      {/* Only shown when there is no scraped recipe, user is not logged in and no notifications are on screen */}
      <Transition
        mounted={
          (!session && notificationsStore.notifications.length === 0) ||
          (!session && !!recipe)
        }
        transition="slide-down"
        duration={300}
        timingFunction="ease"
      >
        {(styles) => (
          <Box mt="auto" style={styles}>
            <CreateAccountBanner />
          </Box>
        )}
      </Transition>
    </Stack>
  );
};
