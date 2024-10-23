import prisma from "@/lib/db";

// This file is used as a way to test that the prisma client works correctly.

export default async function DatabaseTest() {
  const recipes = await prisma.recipe.findMany();

  return (
    <div>
      {recipes.length > 0 ? (
        recipes.map((recipe) => <div key={recipe.id}>{recipe.title}</div>)
      ) : (
        <div>no recipes in db yet</div>
      )}
    </div>
  );
}
