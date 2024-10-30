"use client";

import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type EditRecipeProps = {
  recipe: userRecipe;
};

export const EditRecipeForm = ({ recipe }: EditRecipeProps) => {
  const [view, setView] = useState("ingredients");
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    },
  });

  // Add a new ingredient
  const addIngredient = () => {
    form.insertListItem("ingredients", "");
  };

  // Remove an ingredient
  const removeIngredient = (index: number) => {
    form.removeListItem("ingredients", index);
  };

  // Add a new instruction
  const addInstruction = () => {
    form.insertListItem("instructions", "");
  };

  // Remove an instruction
  const removeInstruction = (index: number) => {
    form.removeListItem("instruction", index);
  };

  const handleSubmit = (values: Recipe) => {
    const updatedRecipe = {
      ...recipe,
      title: values.title,
      ingredients: values.ingredients.filter(
        (ingredient) => ingredient.trim() !== ""
      ),
      instructions: values.instructions.filter(
        (instruction) => instruction.trim() !== ""
      ),
    };

    // Replace this with insertion to db
    console.log("Updated Recipe:", updatedRecipe);

    router.push(`/dashboard/${recipe.id}`);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Fieldset mb="md" legend="Recipe information">
          <TextInput
            label="Title"
            placeholder="Recipe title"
            {...form.getInputProps("title")}
          />
        </Fieldset>
        <Group justify="space-between" grow mt="md" mb="md">
          <Button
            variant={view === "ingredients" ? "filled" : "light"}
            color="gray"
            size="md"
            radius="xl"
            onClick={() => setView("ingredients")}
          >
            Ingredients
          </Button>

          <Button
            variant={view === "instructions" ? "filled" : "light"}
            color="gray"
            size="md"
            radius="xl"
            onClick={() => setView("instructions")}
          >
            Instructions
          </Button>
        </Group>

        {/* Ingredients Section */}
        {view === "ingredients" && (
          <Fieldset mb="md" legend="Ingredients">
            {form.values.ingredients.map((ingredient, index) => (
              <Group wrap="nowrap" key={index} mt="xs">
                <TextInput
                  style={{ width: "100%" }}
                  placeholder={`Ingredient ${index + 1}`}
                  {...form.getInputProps(`ingredients.${index}`)}
                />

                <ActionIcon
                  onClick={() => removeIngredient(index)}
                  variant="transparent"
                  aria-label="Delete ingredient"
                >
                  <IconTrash />
                </ActionIcon>
              </Group>
            ))}

            <Button
              leftSection={<IconPlus size={14} />}
              onClick={addIngredient}
              variant="transparent"
              aria-label="Add ingredient"
            >
              Add ingredient
            </Button>
          </Fieldset>
        )}

        {/* Instructions Section */}
        {view === "instructions" && (
          <Fieldset mb="md" legend="Instructions">
            {form.values.instructions.map((instruction, index) => (
              <Group wrap="nowrap" key={index} mt="xs" align="flex-start">
                <Textarea
                  style={{ width: "100%" }}
                  placeholder={`Instruction ${index + 1}`}
                  minRows={3}
                  {...form.getInputProps(`instructions.${index}`)}
                />
                <ActionIcon
                  onClick={() => removeInstruction(index)}
                  variant="transparent"
                  aria-label="Delete ingredient"
                >
                  <IconTrash />
                </ActionIcon>
              </Group>
            ))}

            <Button
              leftSection={<IconPlus size={14} />}
              onClick={addInstruction}
              variant="transparent"
              aria-label="Add ingredient"
            >
              Add instruction
            </Button>
          </Fieldset>
        )}

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

        <Group mt="md" mb="md">
          <Button color="gray" size="md" radius="xl" type="submit">
            Save Changes
          </Button>
          <Button
            component="a"
            color="gray"
            size="md"
            radius="xl"
            onClick={() => router.push(`/dashboard/${recipe.id}`)}
          >
            Cancel
          </Button>
        </Group>
      </form>
    </>
  );
};
