import React from "react";
import {
  Fieldset,
  Group,
  ActionIcon,
  Button,
  Textarea,
  Center,
  Card,
  Divider,
  TextInput,
} from "@mantine/core";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { IconPlus, IconTrash, IconGripVertical } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";

type EditInstructionsListProps = {
  form: UseFormReturnType<FormValues>;
  instructions: EditableItem[];
  setInstructions: SetListFunction;
  sectionedInstructions: { text: EditableItem[] }[];
  setSectionedInstructions: SetListFunction;
  hasSections: boolean;
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

export const EditInstructionsList = ({
  form,
  instructions,
  setInstructions,
  sectionedInstructions,
  setSectionedInstructions,
  hasSections,
  handleDragEnd,
  handleTextChange,
  deleteItem,
  addItem,
}: EditInstructionsListProps) => {
  return (
    <Fieldset radius={"sm"} mb="md" legend="Instructions">
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
                  {...form.getInputProps(`instructions.${sectionIndex}.name`)}
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
                    <div {...provided.droppableProps} ref={provided.innerRef}>
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
                                radius={"md"}
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
                                    sectionedInstructions[sectionIndex].text,
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
                            radius={"md"}
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
  );
};
