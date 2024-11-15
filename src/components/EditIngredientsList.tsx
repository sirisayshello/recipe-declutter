import React from "react";
import {
  Fieldset,
  Group,
  ActionIcon,
  Button,
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
    <Fieldset mb="md" legend="Ingredients">
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
  );
};
