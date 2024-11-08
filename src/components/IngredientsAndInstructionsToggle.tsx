"use client";
import { Anchor, Button, Group, List, Stack, Text } from "@mantine/core";
import { useState } from "react";
import RenderedInstructions from "./RenderedInstructions";
import Link from "next/link";

type IngAndInstToggleProps = {
  recipe: UserRecipe;
};

export const IngredientsAndInstructionsToggle = ({
  recipe,
}: IngAndInstToggleProps) => {
  const [view, setView] = useState("ingredients");

  return (
    <Stack component="section" style={{ minHeight: "50dvh" }}>
      <Group justify="center" mb="md" mt="md">
        <Text size="xs">
          Author:{" "}
          <Anchor component={Link} href={recipe.url}>
            {recipe.author}
          </Anchor>
        </Text>
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
