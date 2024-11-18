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
    <>
      <Flex gap={"sm"} visibleFrom="sm">
        <Paper bg={"white"} miw={"30%"} radius={"xs"} p="md" shadow="xs">
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
        <Paper bg={"white"} radius={"xs"} p="md" shadow="xs">
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
