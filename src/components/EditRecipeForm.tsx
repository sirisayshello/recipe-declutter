"use client";

import { updateRecipe } from "@/lib/queries";
import {
  ActionIcon,
  Button,
  Container,
  Fieldset,
  Group,
  Space,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: recipe.title,
      ingredients: recipe.ingredients || [""],
      instructions: recipe.instructions || [""],
    },
    validate: {
      title: (value) => (value ? null : "Title is required"),
    },
  });

  const addItem = (field: "ingredients" | "instructions") =>
    form.insertListItem(field, "");
  const removeItem = (field: "ingredients" | "instructions", index: number) =>
    form.removeListItem(field, index);

  async function handleSubmit(values: Recipe) {
    if (!form.validate().hasErrors) {
      const updatedRecipe = {
        ...recipe,
        title: values.title,
        ingredients: values.ingredients.filter(
          (ingredient) => ingredient.trim() !== ""
        ),
        instructions: values.instructions.filter(
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
        console.log(error);
      }
    }
  }

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

        {/* Switch view buttons */}
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

        {/* Ingredients or Instructions Section */}
        <Fieldset mb="md" legend={view.charAt(0).toUpperCase() + view.slice(1)}>
          {form.values[view].map((item, index) => (
            <Group wrap="nowrap" key={index} mt="xs" align="flex-start">
              {view === "ingredients" ? (
                <TextInput
                  style={{ width: "100%" }}
                  placeholder={`Ingredient ${index + 1}`}
                  {...form.getInputProps(`${view}.${index}`)}
                />
              ) : (
                <Textarea
                  style={{ width: "100%" }}
                  placeholder={`Instruction ${index + 1}`}
                  minRows={3}
                  {...form.getInputProps(`${view}.${index}`)}
                />
              )}
              <ActionIcon
                onClick={() => removeItem(view, index)}
                variant="transparent"
                aria-label={`Delete ${view}`}
              >
                <IconTrash />
              </ActionIcon>
            </Group>
          ))}
          <Button
            leftSection={<IconPlus size={14} />}
            onClick={() => addItem(view)}
            variant="light"
            aria-label={`Add ${view}`}
          >
            Add {view.slice(0, -1)}
          </Button>
        </Fieldset>

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
