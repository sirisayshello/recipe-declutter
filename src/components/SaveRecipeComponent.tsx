import { saveRecipe } from "@/lib/queries";
import { Button, Loader, Modal, Stack, TagsInput, Text } from "@mantine/core";
import { useState } from "react";
import { Session } from "next-auth";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";

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
      setTimeout(() => {
        close();
      }, 1500);
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Save button that triggers modal */}
      <Button
        mt="md"
        onClick={open}
        disabled={isLoading}
        variant="filled"
        size="md"
      >
        {isLoading ? <Loader size="sm" color="white" /> : "Save Recipe"}
      </Button>

      {/* Modal for adding tags and saving recipe */}
      <Modal
        opened={opened}
        onClose={close}
        title="Save recipe"
        centered
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {success ? (
          <Stack align="center">
            <Text fw={700}>Recipe saved!</Text>
            <IconCheck size={60} color="green" />
          </Stack>
        ) : (
          <>
            {error && (
              <Stack align="center" mb="md">
                <Text fw={700}>{error}</Text>
              </Stack>
            )}

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
              size="md"
            >
              {isLoading ? <Loader size="sm" color="white" /> : "Save Recipe"}
            </Button>
          </>
        )}
      </Modal>
    </>
  );
};
