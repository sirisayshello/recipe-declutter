import React from "react";
import {
  Fieldset,
  Group,
  ActionIcon,
  Button,
  Textarea,
  TextInput,
  Card,
  Divider,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";

type EditIngredientAndInstructionListProps = {
  form: UseFormReturnType<FormValues>;
  hasSections: boolean;
  view: "ingredients" | "instructions";
};

export const EditIngredientAndInstructionList = ({
  form,
  hasSections,
  view,
}: EditIngredientAndInstructionListProps) => {
  // Add/remove functions for ingredients
  const addIngredient = () => form.insertListItem("ingredients", "");
  const removeIngredient = (index: number) =>
    form.removeListItem("ingredients", index);

  // Add/remove functions for sectioned instructions
  const removeSection = (sectionIndex: number) => {
    if (hasSections) {
      form.removeListItem("instructions", sectionIndex);
    }
  };
  const addInstruction = (sectionIndex: number) => {
    if (hasSections) {
      form.insertListItem(`instructions.${sectionIndex}.text`, "");
    }
  };
  const removeInstruction = (
    sectionIndex: number,
    instructionIndex: number
  ) => {
    if (hasSections) {
      form.removeListItem(
        `instructions.${sectionIndex}.text`,
        instructionIndex
      );
    }
  };

  // Add/remove functions for simple instructions
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

  return (
    <>
      {view === "ingredients" && (
        <Fieldset mb="md" legend="Ingredients">
          {form.values.ingredients.map((_ingredient: string, index: number) => (
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
          ))}
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
      )}
      {view === "instructions" && (
        <Fieldset mb="md" legend="Instructions">
          {/* If sectioned instructions */}
          {hasSections ? (
            <>
              {(form.values.instructions as SectionInstruction[]).map(
                (section, sectionIndex) => (
                  <Card key={sectionIndex} withBorder mb="md">
                    <Group wrap="nowrap" align="flex-start">
                      <TextInput
                        label="Section title"
                        style={{ width: "100%" }}
                        placeholder="Section title"
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
    </>
  );
};
