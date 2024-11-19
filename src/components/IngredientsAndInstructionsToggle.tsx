"use client";
import { Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { useState } from "react";
import RenderedInstructions from "./RenderedInstructions";
import RenderedIngredients from "./RenderedIngredients";

type IngAndInstToggleProps = {
  recipe: UserRecipe;
};

export const IngredientsAndInstructionsToggle = ({
  recipe,
}: IngAndInstToggleProps) => {
  const [view, setView] = useState("ingredients");

  // If instructions are sectioned, the total instructions count is calculated.
  const getTotalInstructionsCount = (instructions: Instructions) => {
    if (typeof instructions[0] === "string") {
      return instructions.length;
    } else if (typeof recipe.instructions[0] === "object") {
      return instructions.reduce(
        (total, section) =>
          total +
          (typeof section === "object" && section.text ? section.text.length : 0),
        0
      );
    }
  };

  const [checkboxStates, setCheckboxStates] = useState({
    instructions: Array(getTotalInstructionsCount(recipe.instructions)).fill(
      false
    ),
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
    <>
      <Flex gap={"sm"} visibleFrom="sm">
        <Paper miw={"30%"} withBorder radius={"xs"} p="md" shadow="xs">
          <Text fw={700} size="xl" mb={"md"}>
            Ingredients
          </Text>
          <RenderedIngredients
            recipe={recipe}
            checkboxStates={checkboxStates.ingredients}
            onCheckboxChange={(index, checked) =>
              handleCheckboxChange("ingredients", index, checked)
            }
          />
        </Paper>
        <Paper withBorder radius={"xs"} p="md" shadow="xs">
          <Text fw={700} size="xl" mb={"md"}>
            Instructions
          </Text>
          <RenderedInstructions
            recipe={recipe}
            checkboxStates={checkboxStates.instructions}
            onCheckboxChange={(index, checked) =>
              handleCheckboxChange("instructions", index, checked)
            }
          />
        </Paper>
      </Flex>

      <Stack hiddenFrom="sm">
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
          <RenderedIngredients
            recipe={recipe}
            checkboxStates={checkboxStates.ingredients}
            onCheckboxChange={(index, checked) =>
              handleCheckboxChange("ingredients", index, checked)
            }
          />
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
    </>
  );
};
