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
  const friendlyPhrases = [
    "Sounds pretty tasty, huh?",
    "This could be your next favorite dish!",
    "Feeling adventurous? Give it a try!",
    "Looks like a treat for your taste buds!",
    "Ready to whip this up in the kitchen?",
    "Who’s hungry? This looks amazing!",
    "You’ll be the chef of the hour with this one!",
    "Can you almost smell it already?",
    "Let’s turn this idea into reality!",
    "Your next delicious adventure starts here!",
  ];

  const getRandomPhrase = () =>
    friendlyPhrases[Math.floor(Math.random() * friendlyPhrases.length)];
  const [randomPhrase, setRandomPhrase] = useState<string>(getRandomPhrase());

  const shuffle = () => {
    setRandomRecipe(getRandomRecipe());
    setRandomPhrase(getRandomPhrase());
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
          {recipes.length < 1 ? (
            <>
              <Text maw={"350px"} ta={"center"} size="xl" fw={700}>
                Oh no!
              </Text>
              <Text mb={"md"}>You have no recipes to choose from</Text>
            </>
          ) : (
            <>
              <Text maw={"350px"} ta={"center"} size="xl" fw={700}>
                {randomRecipe.title}
              </Text>
              <Text>{randomPhrase}</Text>
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
            </>
          )}
        </Stack>
      </Modal>
    </>
  );
};
