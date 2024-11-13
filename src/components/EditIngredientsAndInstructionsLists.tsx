"use client";
import React, { useEffect, useState } from "react";
import {
  Fieldset,
  Group,
  ActionIcon,
  Button,
  Textarea,
  TextInput,
  Center,
} from "@mantine/core";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
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
  view,
}: EditIngredientAndInstructionListProps) => {
  const [ingredients, setIngredients] = useState<EditableItem[]>([]);
  const [instructions, setInstructions] = useState<EditableItem[]>([]);

  useEffect(() => {
    // Transform the list items into EditableItem objects (with an id)
    const transformedIngredients = form.values.ingredients.map(
      (text, index) => ({
        id: `ing-${index}`,
        text: text || "",
      })
    );
    setIngredients(transformedIngredients);

    const currentInstructions = form.values.instructions as SimpleInstructions;
    const transformedInstructions = currentInstructions.map((text, index) => ({
      id: `ins-${index}`,
      text: text || "",
    }));
    setInstructions(transformedInstructions);
    console.log(transformedIngredients);
    console.log(transformedInstructions);
  }, [form.values.ingredients, form.values.instructions]);

  const addItem = (listType: string) => {
    form.insertListItem(listType, "");
  };

  // const deleteItem = (index: number, listType) =>
  //   form.removeListItem(listType, index);

  // // Function to delete an item from the list
  const deleteItem = (
    index: number,
    list: EditableItem[],
    setList: React.Dispatch<React.SetStateAction<EditableItem[]>>,
    listType: string
  ) => {
    // Create a new list without the item at the specified index
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    form.setFieldValue(
      listType,
      updatedList.map((item) => item.text)
    );
    console.log(updatedList);
  };

  // Function to handle the drag-and-drop reordering of list
  const handleDragEnd =
    (
      listType: string,
      list: EditableItem[],
      setList: React.Dispatch<React.SetStateAction<EditableItem[]>>
    ) =>
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) return;
      const newList = [...list];
      const [removed] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, removed);
      setList(newList);
      form.setFieldValue(
        listType,
        newList.map((item) => item.text)
      );
      console.log(newList);
    };

  const handleTextChange = (
    index: number,
    value: string,
    listType: "ingredients" | "instructions"
  ) => {
    // Update form value
    form.setFieldValue(`${listType}.${index}`, value);

    // Update local state
    const list = listType === "ingredients" ? ingredients : instructions;
    const setList =
      listType === "ingredients" ? setIngredients : setInstructions;

    const newList = [...list];
    newList[index] = {
      ...newList[index],
      text: value,
    };
    setList(newList);
  };

  return (
    <>
      {view === "ingredients" && (
        <Fieldset mb="md" legend="Ingredients">
          <DragDropContext
            onDragEnd={handleDragEnd(
              "ingredients",
              ingredients,
              setIngredients
            )}
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
                            value={ingredient.text}
                            onChange={(event) =>
                              handleTextChange(
                                index,
                                event.currentTarget.value,
                                "ingredients"
                              )
                            }
                          />
                          <ActionIcon
                            onClick={() =>
                              deleteItem(
                                index,
                                ingredients,
                                setIngredients,
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
            onClick={() => addItem("ingredients")}
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
              onDragEnd={handleDragEnd(
                "instructions",
                instructions,
                setInstructions
              )}
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
                              value={instruction.text}
                              onChange={(event) =>
                                handleTextChange(
                                  index,
                                  event.currentTarget.value,
                                  "instructions"
                                )
                              }
                            />
                            <ActionIcon
                              onClick={() =>
                                deleteItem(
                                  index,
                                  instructions,
                                  setInstructions,
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
              onClick={() => addItem("instructions")}
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
