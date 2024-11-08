import prisma from "@/lib/db";
import Link from "next/link";
import { Group, Pill, Stack, Title } from "@mantine/core";
import { IconArrowNarrowLeft, IconPencil } from "@tabler/icons-react";
import { IngredientsAndInstructionsToggle } from "@/components/IngredientsAndInstructionsToggle";

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      tags: {
        select: {
          tag: true,
        },
      },
    },
  });

  if (!recipe) {
    return <div>Something went wrong</div>;
  }
  const convertedRecipe = recipe as unknown as UserRecipe;
  console.log(convertedRecipe.tags);

  return (
    <>
      <Group justify="space-between" mt="md">
        <Link href="/dashboard">
          <IconArrowNarrowLeft />
        </Link>
        <Link href={`/dashboard/${recipe.id}/edit`}>
          <IconPencil />
        </Link>
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
