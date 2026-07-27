import { saveRecipe } from "@/lib/queries";
import { Button, Loader, Modal, Stack, TagsInput, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

type SaveRecipeComponentProps = {
  session?: Session | null;
  recipe: Recipe;
  userTags?: Tag[];
  isOpen?: boolean;
  onClose?: () => void;
};

// Helper function for localStorage
const PENDING_RECIPE_KEY = "pendingRecipeToSave";

const storePendingRecipe = (recipe: Recipe) => {
  localStorage.setItem(PENDING_RECIPE_KEY, JSON.stringify(recipe));
};

export const SaveRecipeModal = ({
  session,
  recipe,
  userTags,
  isOpen,
  onClose,
}: SaveRecipeComponentProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [tags, setTags] = useState<{ name: string }[]>([]);

  // Remove potential notifications when modal is mounted
  useEffect(() => {
    notifications.clean();
  }, []);

  useEffect(() => {
    if (isOpen) {
      open();
    }
  }, [isOpen, open]);

  const handleClose = () => {
    close();
    onClose?.();
  };
  console.log(userTags);

  const existingTags = userTags?.map((tag) => tag.name);

  async function handleSaveRecipe() {
    try {
      setIsLoading(true);
      setError(null);
      console.log(tags);

      const recipeWithTags = {
        ...recipe,
        tags: tags.map((tag) => ({ tag })),
      };

      const result = await saveRecipe(session?.user?.email, recipeWithTags);

      if (!result.success) {
        setError(result.error?.message || "Failed to save recipe");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  const storeRecipeAndRedirect = (path: string) => {
    storePendingRecipe(recipe);
    router.push(path);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        centered
        size="md"
        title="Save recipe"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {session ? (
          success ? (
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
                data={existingTags}
                value={tags.map((tag) => tag.name)}
                onChange={(value) => setTags(value.map((name) => ({ name })))}
                mb="md"
              />
              <Button
                type="submit"
                onClick={() => handleSaveRecipe()}
                disabled={isLoading}
                variant="filled"
                size="md"
              >
                {isLoading ? <Loader size="sm" color="white" /> : "Save Recipe"}
              </Button>
            </>
          )
        ) : (
          <Stack align="center">
            <Text fw={700} size="lg">
              Want to save this recipe for later?
            </Text>
            <Text ta="center" size="sm" c="dimmed">
              Create an account to start building your personal recipe
              collection!
            </Text>
            <Stack gap={"xs"}>
              <Button
                onClick={() => storeRecipeAndRedirect("/signup")}
                variant="filled"
                size="md"
              >
                Create account
              </Button>
              <Button
                onClick={() => storeRecipeAndRedirect("/login")}
                variant="transparent"
                size="xs"
              >
                Already have an account? Log in
              </Button>
            </Stack>
          </Stack>
        )}
      </Modal>
    </>
  );
};
