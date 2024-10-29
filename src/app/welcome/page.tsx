"use client";

import { useState } from "react";
import { RecipeForm } from "@/components/RecipeForm";
import { Alert, Button, Space } from "@mantine/core";
import { Session } from "next-auth";
import { saveRecipe } from "@/lib/queries";
import { signOut } from "next-auth/react";

export default function WelcomePage({ session }: { session: Session | null }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // async function handleSaveRecipe() {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     const result = await saveRecipe(session?.user?.email, recipe);

  //     if (!result.success) {
  //       setError(result.error?.message || "Failed to save recipe");
  //       return;
  //     }

  //     setSuccess(true);
  //   } catch (error) {
  //     console.error(error);
  //     setError("An unexpected error occurred. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <>
      <Button
        onClick={() => signOut()}
        variant="filled"
        color="gray"
        size="md"
        radius="xl"
      >
        Sign out
      </Button>

      <RecipeForm />

      <Space h="xl" />

      {/* Error section for saving recipes. Probably we should combine this with the recipeError handling above. */}

      <Alert
        display={!!error ? "block" : "none"}
        variant="light"
        color="blue"
        title="Alert title"
        onClose={() => setError(null)}
        withCloseButton
        closeButtonLabel="Dismiss"
      >
        {error}
      </Alert>

      {/* When successfully saving a recipe: */}

      {/* <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Recipe saved successfully!
        </Alert>
      </Snackbar> */}

      {/* {recipe && (
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
      )} */}
    </>
  );
}
