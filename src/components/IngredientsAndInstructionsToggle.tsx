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
        <Text size="xs">Author: {recipe.author}</Text>
        <Text size="xs">Total time: {recipe.time}</Text>
        <Text size="xs">Servings: {recipe.yield}</Text>
      </Group>
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
