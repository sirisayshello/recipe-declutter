"use client";

import { updateRecipe } from "@/lib/queries";
import { isSectionedInstruction, isSimpleInstruction } from "@/lib/utils";
import {
  Button,
  Fieldset,
  Group,
  Space,
  TagsInput,
  TextInput,
  Alert,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditIngredientAndInstructionList } from "./EditIngredientsAndInstructionsLists";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
        if (!result.success)
          throw new Error(result.error?.message || "Failed to save recipe");

        setSuccess(true);
        console.log(success);
        setTimeout(
          () => router.push(`/dashboard/${recipe.slug}?id=${recipe.id}`),
          1500
        );
      } catch (err) {
        console.error(err);
        setError("An error occurred while saving. Please try again.");
      }
    }
  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* General info */}
        <Fieldset radius={"sm"} mb="md" legend="Recipe information">
          <TextInput
            label="Title"
            placeholder="Recipe title"
            {...form.getInputProps("title")}
          />
          <TextInput
            label="Total time"
            placeholder="Total time to cook"
            {...form.getInputProps("time")}
          />
          <TextInput
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

        <Fieldset radius={"sm"} mb="md" legend="Tags">
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

        <Space h="xl" />
        <Space h="xl" />
        <Space h="xl" />

        {error && (
          <Alert
            variant="light"
            color="red"
            title="Recipe failed to save"
            mt="md"
          >
            {error}
          </Alert>
        )}

        <Paper
          shadow="md"
          p={16}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            borderRadius: "0 0 0 0",
          }}
        >
          <Group justify="center" mt={"xs"} mb={"xs"}>
            <Button size="md" type="submit">
              Save Changes
            </Button>
            <Button
              component="a"
              size="md"
              onClick={() =>
                router.push(`/dashboard/${recipe.slug}?id=${recipe.id}`)
              }
            >
              Cancel
            </Button>
          </Group>
        </Paper>
      </form>
    </>
  );
};
