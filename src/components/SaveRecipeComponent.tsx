import { saveRecipe } from "@/lib/queries";
import { Alert, Button, Loader, Modal, TagsInput, Text } from "@mantine/core";
import { useState } from "react";
import { Session } from "next-auth";
import { useDisclosure } from "@mantine/hooks";

type SaveRecipeComponentProps = {
  session: Session | null;
  recipe: Recipe;
};

export const SaveRecipeComponent = ({
  session,
  recipe,
}: SaveRecipeComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [tags, setTags] = useState<string[]>([]);

  async function handleSaveRecipe() {
    try {
      setIsLoading(true);
      setError(null);
      console.log(tags);

      const result = await saveRecipe(session?.user?.email, recipe);

      if (!result.success) {
        setError(result.error?.message || "Failed to save recipe");
        return;
      }

      setSuccess(true);
      close();
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
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

      <Alert
        display={success ? "block" : "none"}
        variant="light"
        color="blue"
        title="Alert title"
        onClose={() => setSuccess(false)}
        withCloseButton
        closeButtonLabel="Dismiss"
      >
        Recipe saved successfully!
      </Alert>

      {/* Save button that triggers modal */}
      <Button
        onClick={open}
        disabled={isLoading}
        variant="filled"
        color="gray"
        size="md"
        radius="xl"
      >
        {isLoading ? <Loader size="sm" color="white" /> : "Save Recipe"}
      </Button>

      {/* Modal for adding tags */}
      <Modal
        opened={opened}
        onClose={close}
        title="Add tags to recipe"
        centered
      >
        <Text pb="md" fw={700}>
          {recipe.title}
        </Text>
        <TagsInput
          label="Recipe tags"
          placeholder="Press Enter to submit a tag"
          data={[]}
          value={tags}
          onChange={setTags}
          mb="md"
        />
        <Button
          type="submit"
          onClick={handleSaveRecipe}
          disabled={isLoading}
          variant="filled"
          color="gray"
          size="md"
          radius="xl"
        >
          {isLoading ? "Saving..." : "Save Recipe"}
        </Button>
      </Modal>
    </>
  );
};
