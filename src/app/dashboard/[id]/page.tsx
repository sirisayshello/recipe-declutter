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
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!recipe) {
    return <div>Something went wrong</div>;
  }

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

      <IngredientsAndInstructionsToggle recipe={recipe} />
      <Group mt="md" mb="md">
        <Pill size="md">Lunch</Pill>
      </Group>
    </>
  );
}
