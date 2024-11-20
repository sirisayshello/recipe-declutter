import React from "react";
import { Fieldset, Group, Button, TextInput, Menu, Flex } from "@mantine/core";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { IconPlus, IconDotsVertical, IconMenu } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";
import DeleteButtonDropdown from "./DeleteButtonDropdown";

type EditIngredientsListProps = {
  form: UseFormReturnType<FormValues>;
  ingredients: EditableItem[];
  setIngredients: SetListFunction;
  handleDragEnd: (
    listType: string,
    listOrSections: EditableItem[] | { text: EditableItem[] }[],
    setList: SetListFunction,
    sectionIndex?: number
  ) => (result: DropResult) => void;
  handleTextChange: (
    index: number,
    value: string,
    listType: "ingredients" | "instructions",
    sectionIndex?: number
  ) => void;
  deleteItem: (
    index: number,
    list: EditableItem[] | { text: EditableItem[] }[],
    setList: SetListFunction,
    listType: string,
    sectionIndex?: number
  ) => void;
  addItem: (path: string, sectionIndex?: number) => void;
};

export const EditIngredientsList = ({
  ingredients,
  setIngredients,
  handleDragEnd,
  handleTextChange,
  deleteItem,
  addItem,
}: EditIngredientsListProps) => {
  return (
    <Fieldset radius={"sm"} mb="md" legend="Ingredients">
      <DragDropContext
        onDragEnd={handleDragEnd("ingredients", ingredients, setIngredients)}
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
                      mt="xs"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Menu position="left" offset={-45}>
                        <DeleteButtonDropdown
                          onClickDelete={() =>
                            deleteItem(
                              index,
                              ingredients,
                              setIngredients,
                              "ingredients"
                            )
                          }
                          type="ingredient"
                        />

                        <Flex
                          {...provided.dragHandleProps}
                          style={{ cursor: "grab" }}
                        >
                          <IconMenu size="1.2rem" />
                        </Flex>
                        <TextInput
                          radius={"sm"}
                          style={{ width: "100%" }}
                          placeholder={`Ingredient ${index + 1}`}
                          value={ingredient.text}
                          rightSection={
                            <Menu.Target>
                              <IconDotsVertical
                                style={{ color: "lightgray" }}
                              />
                            </Menu.Target>
                          }
                          onChange={(event) =>
                            handleTextChange(
                              index,
                              event.currentTarget.value,
                              "ingredients"
                            )
                          }
                        />
                      </Menu>
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
  );
};
