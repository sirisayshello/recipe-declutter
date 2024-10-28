import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import { IngredientsAndInstructionsToggle } from "@/components/IngredientsAndInstructionsToggle";
import prisma from "@/lib/db";
import { Group, Pill, Stack, Title } from "@mantine/core";

export default async function EditRecipe({
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

  return (
    <>
      <Group justify="space-between" mt="md" mb="md">
        <Title size="h3">Edit recipe</Title>
        <DeleteRecipeButton id={recipe.id} />
      </Group>
      <Stack component="section"></Stack>

      <IngredientsAndInstructionsToggle recipe={recipe} />
      <Group mt="md" mb="md">
        <Pill size="md">Lunch</Pill>
      </Group>
    </>
  );
}
