import prisma from "@/lib/db";
import Link from "next/link";
import {
  Anchor,
  Group,
  Stack,
  Title,
  Text,
  Box,
  Badge,
  Space,
} from "@mantine/core";

import { IngredientsAndInstructionsToggle } from "@/components/IngredientsAndInstructionsToggle";
import { getAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ScreenAwakeToggle } from "@/components/ScreenAwakeToggle";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import EditRecipeButton from "@/components/EditRecipeButton";
import { IconClockHour4, IconToolsKitchen2 } from "@tabler/icons-react";

export default async function RecipePage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const session = await getAuth();
  const user = session?.user;

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: parseInt(searchParams.id),
      userId: user?.id,
    },
    include: {
      tags: {
        select: {
          tag: true,
        },
      },
    },
  });
  const convertedRecipe = recipe as UserRecipe;

  if (!recipe) {
    notFound();
  }

  return (
    <>
      <Group justify="space-between" align="center" mb="xl">
        <Breadcrumbs />

        <EditRecipeButton
          href={`/dashboard/${recipe.slug}/edit?id=${recipe.id}`}
        />
      </Group>

      <Stack component="section">
        <Title
          ta="center"
          mb={{ base: "none", sm: "xl" }}
          fz={{ base: "2rem", xs: "3rem" }}
        >
          {recipe.title}
        </Title>

        <Group
          justify="space-between"
          align="flex-end"
          display={{ base: "block", sm: "flex" }}
          mb="md"
        >
          <Group justify="center">
            <Text size="xs">
              Author:{" "}
              <Anchor component={Link} href={recipe.url} target="_blank">
                {recipe.author}
              </Anchor>
            </Text>
            <Group gap={"xs"}>
              <IconClockHour4 size={16} />
              <Text size="xs">Total time: {recipe.time}</Text>
            </Group>

            <Group gap={"xs"}>
              <IconToolsKitchen2 size={16} />
              <Text size="xs">Servings: {recipe.yield}</Text>
            </Group>
          </Group>

          {/* The ScreenAwakeToggle is rendered inside IngredientsAndInstructionsToggle on small screens */}
          <ScreenAwakeToggle visibleFrom="sm" labelPosition="left" />
        </Group>
      </Stack>

      <Box component="section" pb={"xl"}>
        <IngredientsAndInstructionsToggle recipe={convertedRecipe} />
      </Box>

      <Group>
        {recipe.tags?.map((tagRelation, index) => (
          <Badge
            key={index}
            color="dustyRed"
            variant="light"
            size="lg"
            style={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {tagRelation.tag.name}
          </Badge>
        ))}
      </Group>
      <Space h="4rem" />
    </>
  );
}
