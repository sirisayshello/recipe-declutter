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
  Card,
  Divider,
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

type SetListFunction =
  | React.Dispatch<React.SetStateAction<EditableItem[]>>
  | React.Dispatch<React.SetStateAction<{ text: EditableItem[] }[]>>;

export const EditIngredientAndInstructionList = ({
  form,
  hasSections,
  view,
}: EditIngredientAndInstructionListProps) => {
  const [ingredients, setIngredients] = useState<EditableItem[]>([]);
  const [instructions, setInstructions] = useState<EditableItem[]>([]);
  const [sectionedInstructions, setSectionedInstructions] = useState<
    { text: EditableItem[] }[]
  >([]);

  // Function to transform list items into EditableItem objects (with an id)
  const transformItems = (itemList: string[], prefix: string) => {
    return itemList.map((text, index) => ({
      id: `${prefix}-${index}`,
      text: text || "",
    }));
  };

  // Generate unique id's and update local state when form values change
  useEffect(() => {
    // Transform simple list items
    setIngredients(transformItems(form.values.ingredients, "ing"));
    setInstructions(
      transformItems(form.values.instructions as SimpleInstructions, "ins")
    );
    // If the instructions are sectioned, transform them differently
    setSectionedInstructions(
      (form.values.instructions as SectionedInstructions).map((section) => ({
        name: section.name,
        text: section.text.map((instructionText, index) => ({
          id: `ins-${section.name}-${index}`,
          text: instructionText || "",
        })),
      }))
    );
  }, [form.values.ingredients, form.values.instructions]);

  // Function to add an item to a list
  const addItem = (path: string, sectionIndex?: number) => {
    const fullPath =
      sectionIndex !== undefined ? `${path}.${sectionIndex}.text` : path;
    form.insertListItem(fullPath, "");
  };

  // Function to delete an item from a list
  const deleteItem = (
    index: number,
    list: EditableItem[] | { text: EditableItem[] }[],
    setList: SetListFunction,
    listType: string,
    sectionIndex?: number
  ) => {
    let updatedList: EditableItem[];

    // Handle the form value update differently based on whether it's sectioned
    if (sectionIndex !== undefined) {
      // For sectioned instructions, update the specific section
      (
        setList as React.Dispatch<
          React.SetStateAction<{ text: EditableItem[] }[]>
        >
      )((prevSections: { text: EditableItem[] }[]) => {
        const updatedSections = [...prevSections];
        // Ensure we're working with an array
        const sectionText = Array.isArray(updatedSections[sectionIndex].text)
          ? updatedSections[sectionIndex].text
          : [];
        console.log(updatedSections[sectionIndex]);
        const updatedList = sectionText.filter((_, i) => i !== index);
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          text: updatedList,
        };

        // Update form
        form.setFieldValue(
          `${listType}.${sectionIndex}.text`,
          updatedList.map((item) => item.text)
        );

        return updatedSections;
      });
    } else {
      // For regular lists, update the entire list
      updatedList = (list as EditableItem[]).filter((_, i) => i !== index);
      (setList as React.Dispatch<React.SetStateAction<EditableItem[]>>)(
        updatedList
      );
      form.setFieldValue(
        listType,
        updatedList.map((item) => item.text)
      );
    }
  };

  // Function to handle drag and drop reordering of list items
  const handleDragEnd =
    (
      listType: string,
      listOrSections: EditableItem[] | { text: EditableItem[] }[],
      setList: SetListFunction,
      sectionIndex?: number
    ) =>
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) return;

      if (sectionIndex !== undefined) {
        // Handle sectioned instructions
        (
          setList as React.Dispatch<
            React.SetStateAction<{ text: EditableItem[] }[]>
          >
        )((prevSections: { text: EditableItem[] }[]) => {
          const updatedSections = [...prevSections];
          const sectionText = Array.isArray(updatedSections[sectionIndex].text)
            ? updatedSections[sectionIndex].text
            : [];

          const newList = [...sectionText];
          const [removed] = newList.splice(source.index, 1);
          newList.splice(destination.index, 0, removed);

          updatedSections[sectionIndex] = {
            ...updatedSections[sectionIndex],
            text: newList,
          };

          // Update form
          form.setFieldValue(
            `${listType}.${sectionIndex}.text`,
            newList.map((item) => item.text)
          );

          return updatedSections;
        });
      } else {
        // Handle simple instructions
        const newList = [...(listOrSections as EditableItem[])];
        const [removed] = newList.splice(source.index, 1);
        newList.splice(destination.index, 0, removed);

        (setList as React.Dispatch<React.SetStateAction<EditableItem[]>>)(
          newList
        );
        form.setFieldValue(
          listType,
          newList.map((item) => item.text)
        );
      }
    };

  const handleTextChange = (
    index: number,
    value: string,
    listType: "ingredients" | "instructions",
    sectionIndex?: number
  ) => {
    if (sectionIndex !== undefined) {
      // Handle sectioned instructions
      setSectionedInstructions((prevSections: { text: EditableItem[] }[]) => {
        const updatedSections = [...prevSections];
        const sectionText = Array.isArray(updatedSections[sectionIndex].text)
          ? updatedSections[sectionIndex].text
          : [];

        const newList = [...sectionText];
        newList[index] = {
          ...newList[index],
          text: value,
        };

        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          text: newList,
        };

        // Update form
        form.setFieldValue(`${listType}.${sectionIndex}.text.${index}`, value);

        return updatedSections;
      });
    } else {
      // Handle simple lists (ingredients or regular instructions)
      const list = listType === "ingredients" ? ingredients : instructions;
      const setList =
        listType === "ingredients" ? setIngredients : setInstructions;

      // Create a new list with the updated item
      const newList = [...list];
      newList[index] = {
        ...newList[index],
        text: value,
      };

      // Update form value
      form.setFieldValue(`${listType}.${index}`, value);

      // Update local state
      setList(newList);
    }
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
          {hasSections ? (
            <>
              {sectionedInstructions.map((section, sectionIndex) => (
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
                  </Group>

                  <Divider my="sm" />

                  <DragDropContext
                    onDragEnd={handleDragEnd(
                      "instructions",
                      sectionedInstructions,
                      setSectionedInstructions,
                      sectionIndex
                    )}
                  >
                    <Droppable droppableId="instructions-list">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {section.text.map((instruction, index) => (
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
                                        "instructions",
                                        sectionIndex
                                      )
                                    }
                                  />
                                  <ActionIcon
                                    onClick={() =>
                                      deleteItem(
                                        index,
                                        sectionedInstructions[sectionIndex]
                                          .text,
                                        setSectionedInstructions,
                                        "instructions",
                                        sectionIndex
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
                    onClick={() => addItem("instructions", sectionIndex)}
                    variant="light"
                    size="sm"
                    mt="md"
                    aria-label="Add instruction"
                  >
                    Add step
                  </Button>
                </Card>
              ))}
            </>
          ) : (
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
          )}
        </Fieldset>
      )}
    </>
  );
};
