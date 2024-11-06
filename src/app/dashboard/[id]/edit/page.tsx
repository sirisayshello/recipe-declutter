import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import { EditRecipeForm } from "@/components/EditRecipeForm";
import prisma from "@/lib/db";
import { Group, Title } from "@mantine/core";

export default async function EditRecipePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (recipe === null) {
    return <div>something went wrong</div>;
  }

  const convertedRecipe = recipe as UserRecipe;

  return (
    <>
      <Group justify="space-between" mt="md" mb="md">
        <Title size="h3">Edit recipe</Title>
        <DeleteRecipeButton id={recipe.id} />
      </Group>

      <EditRecipeForm recipe={convertedRecipe} />
    </>
  );
}
