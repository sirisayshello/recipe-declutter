"use client";
import {
  Box,
  Center,
  Flex,
  Paper,
  rem,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import RenderedInstructions from "./RenderedInstructions";
import RenderedIngredients from "./RenderedIngredients";
import { ScreenAwakeToggle } from "./ScreenAwakeToggle";
import { IconCarrot, IconLadle } from "@tabler/icons-react";

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
          (typeof section === "object" && section.text
            ? section.text.length
            : 0),
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
        <Paper
          bg={"var(--mantine-color-default)"}
          miw={"30%"}
          radius={"sm"}
          p="md"
          shadow="xs"
        >
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
        <Paper
          bg={"var(--mantine-color-default)"}
          radius={"sm"}
          p="md"
          shadow="xs"
        >
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

      <Stack hiddenFrom="sm" mt={"xl"}>
        {/* The ScreenAwakeToggle is rendered in src/app/dashboard/[slug]/page.tsx on larger screens */}
        <ScreenAwakeToggle labelPosition="right" />

        <Box
          mt={"-2.75rem"}
          ml="auto"
          mr={0}
          pos="sticky"
          top={"1rem"}
          style={{
            zIndex: 100,
          }}
        >
          <SegmentedControl
            style={{ border: "1px solid var(--mantine-color-default-border)" }}
            color="var(--mantine-primary-color-filled)"
            onChange={setView}
            data={[
              {
                value: "ingredients",
                label: (
                  <>
                    <Center style={{ gap: 10 }}>
                      <IconCarrot style={{ width: rem(16), height: rem(16) }} />
                      <Text size="sm" visibleFrom="xs">
                        Ingredients
                      </Text>
                    </Center>
                  </>
                ),
              },
              {
                value: "instructions",
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconLadle style={{ width: rem(16), height: rem(16) }} />
                    <Text size="sm" visibleFrom="xs">
                      Instructions
                    </Text>
                  </Center>
                ),
              },
            ]}
          />
        </Box>
        <Paper
          bg={"var(--mantine-color-default)"}
          radius="sm"
          p="md"
          shadow="xs"
        >
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
        </Paper>
      </Stack>
    </>
  );
};
