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
  // Function to transform string array to object array with id and text = EditableItem array
  const transformItems = (items: string[], type: string) => {
    return items.map((text, index) => ({
      id: `${type}-${index}`,
      text,
    }));
  };

  // When data loads, transform list items to EditableItem objects
  const [ingredients, setIngredients] = useState<EditableItem[]>([]);
  const [instructions, setInstructions] = useState<EditableItem[]>([]);
  const [sectionedInstructions, setSectionedInstructions] = useState<
    { name: string; text: EditableItem[] }[]
  >([]);

  useEffect(() => {
    const transformedIngredients = transformItems(
      form.values.ingredients,
      "ing"
    );
    setIngredients(transformedIngredients);

    const transformedInstructions = transformItems(
      form.values.instructions as SimpleInstructions,
      "ins"
    );
    setInstructions(transformedInstructions);
    console.log(transformedIngredients);
    console.log(transformedInstructions);
  }, [form.values.ingredients, form.values.instructions]);

  // Function to add an item to the list
  const addItem = (
    listType: string,
    list: EditableItem[],
    setList: React.Dispatch<React.SetStateAction<EditableItem[]>>
  ) => {
    // Create a new empty item and add it to the list
    const newList = [...list, { id: `${listType}-${list.length}`, text: "" }];

    // Update the state with the new list
    setList(newList);

    // Update the form field with the new list values
    form.setFieldValue(
      listType,
      newList.map((item) => item.text)
    );
  };

  // Function to delete an item from the list
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
            onClick={() => addItem("ingredients", ingredients, setIngredients)}
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

          <>
            {/* If simple instructions list*/}
            <DragDropContext
              onDragEnd={({ destination, source }) => {
                if (!destination) return;
                const newInstructions = [...instructions];
                const [removed] = newInstructions.splice(source.index, 1);
                newInstructions.splice(destination.index, 0, removed);
                setInstructions(newInstructions);
                form.setFieldValue(
                  "instructions",
                  newInstructions.map((item) => item.text)
                );
              }}
            >
              <Droppable droppableId="instructions-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {instructions.map((instruction, index) => (
                      <Draggable
                        key={instruction.id}
                        index={index}
                        draggableId={instruction.id}
                      >
                        {(provided) => (
                          <Group
                            wrap="nowrap"
                            mt="xs"
                            align="flex-start"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <Center {...provided.dragHandleProps}>
                              <IconGripVertical size="1.2rem" />
                            </Center>
                            <Textarea
                              style={{ width: "100%" }}
                              placeholder={`Step ${index + 1}`}
                              minRows={3}
                              {...form.getInputProps(`instructions.${index}`)}
                            />
                            <ActionIcon
                              onClick={() =>
                                deleteItem(
                                  index,
                                  instructions,
                                  setInstructions,
                                  form,
                                  "instructions"
                                )
                              }
                              variant="transparent"
                              aria-label="Delete instruction"
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
                addItem("instructions", instructions, setInstructions)
              }
              variant="light"
              mt="md"
              aria-label="Add instruction"
            >
              Add instruction
            </Button>
          </>
        </Fieldset>
      )}
    </>
  );
};
