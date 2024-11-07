"use client";

import { updateRecipe } from "@/lib/queries";
import { isSectionedInstruction, isSimpleInstruction } from "@/lib/utils";
import {
  Button,
  Container,
  Fieldset,
  Group,
  Space,
  TagsInput,
  TextInput,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IngredientAndInstructionList } from "./EditIngredientsAndInstructionsLists";

type EditRecipeProps = {
  recipe: UserRecipe;
};

export const EditRecipeForm = ({ recipe }: EditRecipeProps) => {
  const [view, setView] = useState<"ingredients" | "instructions">(
    "ingredients"
  );
  const [tags, setTags] = useState<string[]>(recipe.tags || []);
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
        tags,
      };

      try {
        const result = await updateRecipe(updatedRecipe);
        if (!result.success)
          throw new Error(result.error?.message || "Failed to save recipe");

        setSuccess(true);
        console.log(success);
        setTimeout(() => router.push(`/dashboard/${recipe.id}`), 1500);
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
        <Fieldset mb="md" legend="Recipe information">
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

        {/* Ingredients and Instructions */}
        <IngredientAndInstructionList
          form={form}
          hasSections={hasSections}
          view={view}
        />

        <Fieldset mb="md" legend="Recipe tags">
          <TagsInput
            label="Recipe tags"
            placeholder="Press Enter to submit a tag"
            data={[]}
            value={tags}
            onChange={setTags}
            mb="md"
          />
        </Fieldset>

        <Space h="xl" />
        <Space h="xl" />

        <Container
          pos="fixed"
          style={{
            backgroundColor: "white",
            bottom: 0,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            width: "100%",
          }}
        >
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
          <Group justify="center" mt="md" mb="md">
            <Button size="md" type="submit">
              Save Changes
            </Button>
            <Button
              component="a"
              size="md"
              onClick={() => router.push(`/dashboard/${recipe.id}`)}
            >
              Cancel
            </Button>
          </Group>
        </Container>
      </form>
    </>
  );
};
