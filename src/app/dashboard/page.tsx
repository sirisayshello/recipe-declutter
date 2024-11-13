import TagsFilter from "@/components/TagsFilter";
import { Center, Stack, Title } from "@mantine/core";
import RecipesList from "@/components/RecipesList";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import { getRecipesByUserId, getUserTags } from "@/lib/queries";

export default async function Dashboard() {
  const session = await getAuth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // fetch all of the user's recipes for the "Saved Recipes" list
  const recipes = await getRecipesByUserId(userId, "noLimit");

  const convertedRecipes = recipes as UserRecipe[];
  const tags = await getUserTags(session.user.id);

  return (
    <>
      <Center component="section" mt="md">
        <Title mb="xl">Your Recipes</Title>
      </Center>

      <Stack component="section">
        <TagsFilter tags={tags} />
        <RecipesList recipes={convertedRecipes} title="Saved Recipes" />
      </Stack>
      <SignOutButton />
    </>
  );
}
