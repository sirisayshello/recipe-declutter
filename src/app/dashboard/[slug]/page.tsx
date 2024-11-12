import prisma from "@/lib/db";
import Link from "next/link";
import { Anchor, Group, Pill, Stack, Title } from "@mantine/core";
import { IconArrowNarrowLeft, IconPencil } from "@tabler/icons-react";
import { IngredientsAndInstructionsToggle } from "@/components/IngredientsAndInstructionsToggle";
import { getAuth } from "@/lib/auth";
import { notFound } from "next/navigation";

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
      <Group justify="space-between" mt="md">
        <Anchor component={Link} href="/dashboard">
          <IconArrowNarrowLeft />
        </Anchor>
        <Anchor
          component={Link}
          href={`/dashboard/${recipe.slug}/edit?id=${recipe.id}`}
        >
          <IconPencil />
        </Anchor>
      </Group>
      <Stack component="section">
        <Title ta="center" mt="md" mb="md">
          {recipe.title}
        </Title>
      </Stack>

      <IngredientsAndInstructionsToggle recipe={convertedRecipe} />

      <Group mt="md" mb="md">
        {recipe.tags?.map((tagRelation, index) => (
          <Pill key={index} size="md">
            {tagRelation.tag.name}
          </Pill>
        ))}
      </Group>
    </>
  );
}
