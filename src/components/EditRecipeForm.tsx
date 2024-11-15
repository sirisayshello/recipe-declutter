"use client";

import { deleteRecipeById, updateRecipe } from "@/lib/queries";
import { isSectionedInstruction, isSimpleInstruction } from "@/lib/utils";
import {
  ActionIcon,
  Button,
  Fieldset,
  Flex,
  Group,
  Paper,
  Space,
  TagsInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditIngredientAndInstructionList } from "./EditIngredientsAndInstructionsLists";
import Link from "next/link";
import {
  showLoadingNotification,
  updateNotificationAsError,
  updateNotificationAsSuccess,
} from "@/lib/notifications";
import {
  IconChevronLeft,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";

type EditRecipeProps = {
  recipe: UserRecipe;
  userTags?: Tag[];
};

export const EditRecipeForm = ({ recipe, userTags }: EditRecipeProps) => {
  const [view, setView] = useState<"ingredients" | "instructions">(
    "ingredients"
  );
  const allUserTags = userTags?.map((tag) => tag.name);
  const existingTags = recipe.tags?.map((tag) => tag.tag.name);
  const [tags, setTags] = useState<string[]>(existingTags || []);
  const router = useRouter();

  // Check if the instructions are sectioned or simple
  const hasSections = isSectionedInstruction(recipe.instructions);
  // Initialize the instructions based on the type
  const initialInstructions = hasSections
    ? (recipe.instructions as SectionedInstructions)
    : isSimpleInstruction(recipe.instructions)
    ? recipe.instructions
    : ([] as SimpleInstructions);

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      title: recipe.title,
      time: recipe.time,
      yield: recipe.yield,
      ingredients: recipe.ingredients,
      instructions: initialInstructions,
    },
    validate: {
      title: (value) => (value ? null : "Title is required"),
    },
  });

  // Function to handle form submission
  async function handleSubmit(values: FormValues) {
    // Notification for each form submit. Initially as a loading notification.
    const loadingNotification = showLoadingNotification(
      "Saving your changes..."
    );

    if (!form.validate().hasErrors) {
      const updatedRecipe = {
        ...recipe,
        time: values.time,
        yield: values.yield,
        title: values.title,
        ingredients: values.ingredients.filter((ingredient) =>
          typeof ingredient === "string" ? ingredient.trim() !== "" : true
        ),
        instructions: hasSections
          ? (values.instructions as SectionedInstructions).map((section) => ({
              name: section.name,
              text: section.text.filter(
                (instruction: string) => instruction.trim() !== ""
              ),
            }))
          : (values.instructions as SimpleInstructions).filter(
              (instruction) => instruction.trim() !== ""
            ),
        tags: tags.map((tagName) => ({ tag: { name: tagName } })),
      };

      try {
        const result = await updateRecipe(updatedRecipe);
        if (!result.success) {
          throw new Error(result.error?.message || "Failed to save recipe");
        }

        // Update notification to show success message
        updateNotificationAsSuccess(
          loadingNotification,
          "Recipe successfully updated."
        );

        router.refresh();
      } catch (err) {
        console.error(err);

        // Update notification to show an error message
        updateNotificationAsError(
          loadingNotification,
          "An error occurred while saving. Please try again."
        );
      }
    }
  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper
          display={"flex"}
          pos="sticky"
          mt={"md"}
          top={0}
          left={0}
          right={0}
          py={"md"}
          style={{
            zIndex: 1000, // Ensure it's above other elements
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "0 0 0 0",
          }}
        >
          <ActionIcon
            variant={"filled"}
            aria-label="Go back"
            component={Link}
            href={`/dashboard/${recipe.slug}?id=${recipe.id}`}
            size={"lg"}
          >
            <IconChevronLeft
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>

          <Title size="h3">Edit recipe</Title>

          <Flex gap={"sm"}>
            <ActionIcon
              variant={"filled"}
              aria-label="Save changes"
              type="submit"
              size={"lg"}
            >
              <IconDeviceFloppy
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>

            <ActionIcon
              variant={"filled"}
              aria-label="Delete recipe"
              onClick={() => {
                deleteRecipeById(recipe.id as number);
                router.push("/dashboard");
              }}
              size={"lg"}
            >
              <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Flex>
        </Paper>
        {/* General info */}
        <Fieldset my="md" legend="Recipe information">
          <TextInput
            label="Title"
            placeholder="Recipe title"
            {...form.getInputProps("title")}
          />
          <TextInput
            mt={"md"}
            label="Total time"
            placeholder="Total time to cook"
            {...form.getInputProps("time")}
          />
          <TextInput
            mt={"md"}
            label="Servings"
            placeholder="Serving size"
            {...form.getInputProps("yield")}
          />
        </Fieldset>

        {/* Switch view buttons Ingredients / Instructions */}
        <Group justify="space-between" grow mt="md" mb="md">
          {["ingredients", "instructions"].map((section) => (
            <Button
              key={section}
              variant={view === section ? "filled" : "light"}
              size="md"
              onClick={() => setView(section as "ingredients" | "instructions")}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Button>
          ))}
        </Group>

        <EditIngredientAndInstructionList
          form={form}
          hasSections={hasSections}
          view={view}
        />

        <Fieldset mb="md" legend="Recipe tags">
          <TagsInput
            label="Recipe tags"
            placeholder="Press Enter to submit a tag"
            value={tags}
            defaultValue={existingTags}
            data={allUserTags}
            onChange={setTags}
            mb="md"
          />
        </Fieldset>

        <Space h="md" />
      </form>
    </>
  );
};
