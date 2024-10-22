import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import prisma from "@/lib/db";

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
    <div>
      <h1>Edit Recipe: {recipe?.title}</h1>
      <DeleteRecipeButton {...recipe} />
    </div>
  );
}
