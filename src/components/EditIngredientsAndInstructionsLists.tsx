"use client";
import React, { useEffect, useState } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { UseFormReturnType } from "@mantine/form";
import { EditIngredientsList } from "./EditIngredientsList";
import { EditInstructionsList } from "./EditInstructionsList";

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
    if (hasSections) {
      setSectionedInstructions(
        (form.values.instructions as SectionedInstructions).map((section) => ({
          name: section.name,
          text: section.text.map((instructionText, index) => ({
            id: `ins-${section.name}-${index}`,
            text: instructionText || "",
          })),
        }))
      );
    }
  }, [form.values.ingredients, form.values.instructions, hasSections]);

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

    // Handle the form value update differently based on whether it's sectioned or not
    if (sectionIndex !== undefined) {
      // For sectioned instructions, update the specific section
      (setList as SetListSection)(
        (prevSections: { text: EditableItem[] }[]) => {
          const updatedSections = [...prevSections];
          // Ensure it's an array
          const sectionText = Array.isArray(updatedSections[sectionIndex].text)
            ? updatedSections[sectionIndex].text
            : [];
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
        }
      );
    } else {
      // For regular lists, update the entire list
      updatedList = (list as EditableItem[]).filter((_, i) => i !== index);
      (setList as SetListItem)(updatedList);
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
        (setList as SetListSection)(
          (prevSections: { text: EditableItem[] }[]) => {
            const updatedSections = [...prevSections];
            const sectionText = Array.isArray(
              updatedSections[sectionIndex].text
            )
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
          }
        );
      } else {
        // Handle simple instructions
        const newList = [...(listOrSections as EditableItem[])];
        const [removed] = newList.splice(source.index, 1);
        newList.splice(destination.index, 0, removed);

        (setList as SetListItem)(newList);
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
        <EditIngredientsList
          form={form}
          ingredients={ingredients}
          setIngredients={setIngredients}
          handleDragEnd={handleDragEnd}
          handleTextChange={handleTextChange}
          deleteItem={deleteItem}
          addItem={addItem}
        />
      )}
      {view === "instructions" && (
        <EditInstructionsList
          form={form}
          instructions={instructions}
          setInstructions={setInstructions}
          sectionedInstructions={sectionedInstructions}
          setSectionedInstructions={setSectionedInstructions}
          hasSections={hasSections}
          handleDragEnd={handleDragEnd}
          handleTextChange={handleTextChange}
          deleteItem={deleteItem}
          addItem={addItem}
        />
      )}
    </>
  );
};
