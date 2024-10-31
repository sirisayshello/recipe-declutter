"use client";
import { Button, Group, List, Stack, Text } from "@mantine/core";
import { useState } from "react";

type IngAndInstToggleProps = {
  recipe: Recipe;
};

export const IngredientsAndInstructionsToggle = ({
  recipe,
}: IngAndInstToggleProps) => {
  const [view, setView] = useState("ingredients");

  return (
    <Stack component="section" style={{ minHeight: "50dvh" }}>
      <Group justify="center" mb="md">
        <Text size="xs">Prep time: 20min</Text>
        <Text size="xs">Cook time: 30min</Text>
        <Text size="xs">Total time: 50min</Text>
        <Text size="xs">Yield: 4 servings</Text>
      </Group>
      <Group justify="space-between" grow>
        <Button
          variant={view === "ingredients" ? "filled" : "light"}
          size="md"
          radius="xl"
          onClick={() => setView("ingredients")}
        >
          Ingredients
        </Button>

        <Button
          variant={view === "instructions" ? "filled" : "light"}
          size="md"
          radius="xl"
          onClick={() => setView("instructions")}
        >
          Instructions
        </Button>
      </Group>

      {view === "ingredients" && (
        <List>
          {recipe.ingredients.map((ingredient, index) => {
            return <List.Item key={index}>{ingredient}</List.Item>;
          })}
        </List>
      )}
      {view === "instructions" && (
        <List type="ordered" spacing="xs">
          {recipe.instructions.map((instruction, index) => {
            return <List.Item key={index}>{instruction}</List.Item>;
          })}
        </List>
      )}
    </Stack>
  );
};
