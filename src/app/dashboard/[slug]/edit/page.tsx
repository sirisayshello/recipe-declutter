import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import { EditRecipeForm } from "@/components/EditRecipeForm";
import { getAuth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getUserTags } from "@/lib/queries";
import { Group, Title } from "@mantine/core";
import { notFound } from "next/navigation";

export default async function EditRecipePage({
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
      tags: { include: { tag: true } },
    },
  });

  if (!recipe) {
    notFound();
  }

  const convertedRecipe = recipe as UserRecipe;

  const userTags = await getUserTags(recipe.userId);

  return (
    <>
      <Group justify="space-between" mt="md" mb="md">
        <Title size="h3">Edit recipe</Title>
        <DeleteRecipeButton id={recipe.id} />
      </Group>

      <EditRecipeForm recipe={convertedRecipe} userTags={userTags} />
    </>
  );
}
