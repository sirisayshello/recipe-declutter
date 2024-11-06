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
  Card,
  Divider,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { UserRecipe } from "@/lib/types/jsonTypes";

type EditRecipeProps = {
  recipe: UserRecipe;
};

type FormValues = {
  title: string;
  time: string;
  yield: string;
  ingredients: Ingredient[];
  instructions: SimpleInstructions | SectionedInstructions;
};

// Function to check if the instructions are sectioned
function isSectionedInstruction(
  instructions: Prisma.JsonValue
): instructions is SectionedInstructions {
  return (
    Array.isArray(instructions) &&
    instructions.length > 0 &&
    typeof instructions[0] === "object" &&
    instructions[0] !== null &&
    "name" in instructions[0] &&
    "text" in instructions[0]
  );
}

// Function to check if the instructions are simple string array
function isSimpleInstruction(
  instructions: Prisma.JsonValue
): instructions is SimpleInstructions {
  return (
    Array.isArray(instructions) &&
    (instructions.length === 0 || typeof instructions[0] === "string")
  );
}

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

  // Functions for sectioned instructions
  const removeSection = (sectionIndex: number) => {
    if (hasSections) {
      form.removeListItem("instructions", sectionIndex);
    }
  };

  const addInstruction = (sectionIndex: number) => {
    if (hasSections) {
      const instructions = [
        ...form.values.instructions,
      ] as SectionedInstructions;
      instructions[sectionIndex].text.push("");
      form.setFieldValue("instructions", instructions);
    }
  };

  const removeInstruction = (
    sectionIndex: number,
    instructionIndex: number
  ) => {
    if (hasSections) {
      const instructions = [
        ...form.values.instructions,
      ] as SectionedInstructions;
      instructions[sectionIndex].text.splice(instructionIndex, 1);
      form.setFieldValue("instructions", instructions);
    }
  };

  // Functions for simple instructions
  const addSimpleInstruction = () => {
    if (!hasSections) {
      form.insertListItem("instructions", "");
    }
  };

  const removeSimpleInstruction = (index: number) => {
    if (!hasSections) {
      form.removeListItem("instructions", index);
    }
  };

  // Functions for ingredients
  const addIngredient = () => form.insertListItem("ingredients", "");
  const removeIngredient = (index: number) =>
    form.removeListItem("ingredients", index);

  // Function to handle form submission
  async function handleSubmit(values: FormValues) {
    if (!form.validate().hasErrors) {
      const updatedRecipe = {
        ...recipe,
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

        {/* Ingredients / Instructions */}
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

        {/* Ingredients*/}
        {view === "ingredients" ? (
          <Fieldset mb="md" legend="Ingredients">
            {form.values.ingredients.map(
              (_ingredient: string, index: number) => (
                <Group wrap="nowrap" key={index} mt="xs" align="flex-start">
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
              )
            )}
            <Button
              leftSection={<IconPlus size={14} />}
              onClick={addIngredient}
              variant="light"
              mt="md"
              aria-label="Add ingredient"
            >
              Add ingredient
            </Button>
          </Fieldset>
        ) : (
          <Fieldset mb="md" legend="Instructions">
            {/* If sectioned instructions */}
            {hasSections ? (
              <>
                {(form.values.instructions as SectionInstruction[]).map(
                  (section, sectionIndex) => (
                    <Card key={sectionIndex} withBorder mb="md">
                      <Group wrap="nowrap" align="flex-start">
                        <TextInput
                          label="Step"
                          style={{ width: "100%" }}
                          placeholder="Section name"
                          {...form.getInputProps(
                            `instructions.${sectionIndex}.name`
                          )}
                        />
                        <ActionIcon
                          onClick={() => removeSection(sectionIndex)}
                          variant="transparent"
                          aria-label="Delete section"
                        >
                          <IconTrash />
                        </ActionIcon>
                      </Group>

                      <Divider my="sm" />

                      {section.text.map((_instruction, instructionIndex) => (
                        <Group
                          wrap="nowrap"
                          key={instructionIndex}
                          mt="xs"
                          align="flex-start"
                        >
                          <Textarea
                            style={{ width: "100%" }}
                            placeholder={`Step ${instructionIndex + 1}`}
                            minRows={3}
                            {...form.getInputProps(
                              `instructions.${sectionIndex}.text.${instructionIndex}`
                            )}
                          />
                          <ActionIcon
                            onClick={() =>
                              removeInstruction(sectionIndex, instructionIndex)
                            }
                            variant="transparent"
                            aria-label="Delete instruction"
                          >
                            <IconTrash />
                          </ActionIcon>
                        </Group>
                      ))}

                      <Button
                        leftSection={<IconPlus size={14} />}
                        onClick={() => addInstruction(sectionIndex)}
                        variant="light"
                        size="sm"
                        mt="md"
                        aria-label="Add instruction"
                      >
                        Add step
                      </Button>
                    </Card>
                  )
                )}
              </>
            ) : (
              <>
                {/* If simple instructions list*/}
                {(form.values.instructions as string[]).map(
                  (instruction, index) => (
                    <Group wrap="nowrap" key={index} mt="xs" align="flex-start">
                      <Textarea
                        style={{ width: "100%" }}
                        placeholder={`Step ${index + 1}`}
                        minRows={3}
                        {...form.getInputProps(`instructions.${index}`)}
                      />
                      <ActionIcon
                        onClick={() => removeSimpleInstruction(index)}
                        variant="transparent"
                        aria-label="Delete instruction"
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  )
                )}
                <Button
                  leftSection={<IconPlus size={14} />}
                  onClick={addSimpleInstruction}
                  variant="light"
                  mt="md"
                  aria-label="Add instruction"
                >
                  Add instruction
                </Button>
              </>
            )}
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
            <Alert variant="light" color="red" title="Login failed" mt="md">
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

export default EditRecipeForm;
