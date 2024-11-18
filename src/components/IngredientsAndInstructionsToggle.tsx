"use client";
import { Button, Group, List, Stack } from "@mantine/core";
import { useState } from "react";
import RenderedInstructions from "./RenderedInstructions";

type IngAndInstToggleProps = {
  recipe: UserRecipe;
};

export const IngredientsAndInstructionsToggle = ({
  recipe,
}: IngAndInstToggleProps) => {
  const [view, setView] = useState("ingredients");

  return (
    <Stack mb={"md"}>
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
        <List listStyleType="none">
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
                {ingredient}
              </List.Item>
            );
          })}
        </List>
      )}
      {view === "instructions" && <RenderedInstructions recipe={recipe} />}
    </Stack>
  );
};
