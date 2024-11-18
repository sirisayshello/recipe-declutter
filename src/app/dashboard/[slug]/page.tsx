import prisma from "@/lib/db";
import Link from "next/link";
import { Anchor, Group, Pill, Stack, Title, Text, Box } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { IngredientsAndInstructionsToggle } from "@/components/IngredientsAndInstructionsToggle";
import { getAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ScreenAwakeToggle } from "@/components/ScreenAwakeToggle";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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
      <Breadcrumbs />
      <Group justify="flex-end" mt="md">
        <Anchor
          component={Link}
          href={`/dashboard/${recipe.slug}/edit?id=${recipe.id}`}
        >
          <IconPencil />
        </Anchor>
      </Group>

      <Stack component="section">
        <Title ta="center">{recipe.title}</Title>
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
      </Stack>

      <ScreenAwakeToggle />
      <Box component="section" pb={"xl"}>
        <IngredientsAndInstructionsToggle recipe={convertedRecipe} />
      </Box>

      <Group pb={"xl"}>
        {recipe.tags?.map((tagRelation, index) => (
          <Pill key={index} size="md">
            {tagRelation.tag.name}
          </Pill>
        ))}
      </Group>
    </>
  );
}
