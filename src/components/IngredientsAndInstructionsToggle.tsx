"use client";
import { Button, Checkbox, Group, List, Stack } from "@mantine/core";
import { useState } from "react";
import RenderedInstructions from "./RenderedInstructions";

type IngAndInstToggleProps = {
  recipe: UserRecipe;
};

export const IngredientsAndInstructionsToggle = ({
  recipe,
}: IngAndInstToggleProps) => {
  const [view, setView] = useState("ingredients");

  const [checkboxStates, setCheckboxStates] = useState({
    instructions: Array(recipe.instructions.length).fill(false),
    ingredients: Array(recipe.ingredients.length).fill(false),
  });

  const handleCheckboxChange = (
    type: "instructions" | "ingredients",
    index: number,
    checked: boolean
  ) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [type]: prev[type].map((state, idx) => (idx === index ? checked : state)),
    }));
  };

  return (
    <Stack>
      <Group justify="space-between" grow mb="md">
        <Button
          variant={view === "ingredients" ? "filled" : "light"}
          size="md"
          onClick={() => setView("ingredients")}
        >
          Ingredients
        </Button>

        <Button
          variant={view === "instructions" ? "filled" : "light"}
          size="md"
          onClick={() => setView("instructions")}
        >
          Instructions
        </Button>
      </Group>

      {view === "ingredients" && (
        <List listStyleType="none" spacing="xs">
          {recipe.ingredients.map((ingredient, index) => {
            return (
              <List.Item
                styles={{
                  itemWrapper: {
                    display: "inline",
                  },
                }}
                key={index}
              >
                <Checkbox
                  size="md"
                  checked={checkboxStates.ingredients[index]}
                  onChange={(event) =>
                    handleCheckboxChange(
                      "ingredients",
                      index,
                      event.currentTarget.checked
                    )
                  }
                  label={
                    <span
                      style={{
                        opacity: checkboxStates.ingredients[index] ? 0.5 : 1,
                      }}
                    >
                      {ingredient}
                    </span>
                  }
                />
              </List.Item>
            );
          })}
        </List>
      )}
      {view === "instructions" && (
        <RenderedInstructions
          recipe={recipe}
          checkboxStates={checkboxStates.instructions}
          onCheckboxChange={(index, checked) =>
            handleCheckboxChange("instructions", index, checked)
          }
        />
      )}
    </Stack>
  );
};
