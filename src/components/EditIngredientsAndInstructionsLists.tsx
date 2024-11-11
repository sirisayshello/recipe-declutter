"use client";
import React, { useEffect, useState } from "react";
import {
  Fieldset,
  Group,
  ActionIcon,
  Button,
  Textarea,
  TextInput,
  Card,
  Divider,
  Center,
} from "@mantine/core";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconPlus, IconTrash, IconGripVertical } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";

type EditIngredientAndInstructionListProps = {
  form: UseFormReturnType<FormValues>;
  hasSections: boolean;
  view: "ingredients" | "instructions";
};

type EditableItem = {
  id: string;
  text: string;
};

export const EditIngredientAndInstructionList = ({
  form,
  hasSections,
  view,
}: EditIngredientAndInstructionListProps) => {
  const [ingredients, setIngredients] = useState<EditableItem[]>([]);

  // Function to transform string array to object array with id and text
  const transformItems = (items: string[]) => {
    return items.map((text, index) => ({
      id: `${Date.now()}-${index}`,
      text,
    }));
  };

  // Update ingredients state when form values change
  useEffect(() => {
    const transformedIngredients = transformItems(form.values.ingredients);
    setIngredients(transformedIngredients);
  }, [form.values.ingredients]);

  const addItem = (
    list: EditableItem[],
    setList: React.Dispatch<React.SetStateAction<EditableItem[]>>,
    form: any,
    fieldName: string
  ) => {
    const newItem = { id: `item-${Date.now()}`, text: "" };
    const updatedList = [...list, newItem];
    setList(updatedList);
    form.setFieldValue(
      fieldName,
      updatedList.map((item) => item.text)
    );
  };

  const deleteItem = (
    index: number,
    list: EditableItem[],
    setList: React.Dispatch<React.SetStateAction<EditableItem[]>>,
    form: any,
    fieldName: string
  ) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    form.setFieldValue(
      fieldName,
      updatedList.map((item) => item.text)
    );
  };

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

  // // Add/remove functions for simple instructions
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
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) return;
              const newIngredients = [...ingredients];
              const [removed] = newIngredients.splice(source.index, 1);
              newIngredients.splice(destination.index, 0, removed);
              setIngredients(newIngredients);
              form.setFieldValue(
                "ingredients",
                newIngredients.map((item) => item.text)
              );
            }}
          >
            <Droppable droppableId="ingredients-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {ingredients.map((ingredient, index) => (
                    <Draggable
                      key={ingredient.id}
                      index={index}
                      draggableId={ingredient.id}
                    >
                      {(provided) => (
                        <Group
                          wrap="nowrap"
                          // key={index}
                          mt="xs"
                          align="flex-start"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Center {...provided.dragHandleProps}>
                            <IconGripVertical size="1.2rem" />
                          </Center>
                          <TextInput
                            style={{ width: "100%" }}
                            placeholder={`Ingredient ${index + 1}`}
                            {...form.getInputProps(`ingredients.${index}`)}
                          />
                          <ActionIcon
                            onClick={() =>
                              deleteItem(
                                index,
                                ingredients,
                                setIngredients,
                                form,
                                "ingredients"
                              )
                            }
                            variant="transparent"
                            aria-label="Delete ingredient"
                          >
                            <IconTrash />
                          </ActionIcon>
                        </Group>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            leftSection={<IconPlus size={14} />}
            onClick={() =>
              addItem(ingredients, setIngredients, form, "ingredients")
            }
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
