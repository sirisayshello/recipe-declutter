"use client";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowsShuffle2 } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type RandomRecipeModalProps = {
  recipes: UserRecipe[];
};

export const RandomRecipe = ({ recipes }: RandomRecipeModalProps) => {
  const getRandomRecipe = () =>
    recipes[Math.floor(Math.random() * recipes.length)];

  const [opened, { open, close }] = useDisclosure(false);
  const [randomRecipe, setRandomRecipe] = useState<UserRecipe>(
    getRandomRecipe()
  );

  const shuffle = () => {
    setRandomRecipe(getRandomRecipe());
  };

  return (
    <>
      <Button
        onClick={open}
        variant="light"
        leftSection={<IconArrowsShuffle2 />}
      >
        Random Recipe
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Stack align="center">
          <Text ta={"center"} size="xl" fw={700} mb={"lg"}>
            {randomRecipe.title}
          </Text>
          <Group gap={"xs"}>
            <Button onClick={shuffle} variant="light" size="md">
              Give me another
            </Button>
            <Button
              component={Link}
              href={`/dashboard/${randomRecipe.slug}?id=${randomRecipe.id}`}
              variant="filled"
              size="md"
            >
              Take me there!
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
