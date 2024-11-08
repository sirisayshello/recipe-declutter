import TagsFilter from "@/components/TagsFilter";
import { Center, Stack, Title } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import { getUserRecipes } from "@/lib/actions";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function Dashboard() {
  const session = await getAuth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const recipes = await getUserRecipes();
  const convertedRecipes = recipes as unknown as UserRecipe[];

  const allTags = Array.from(
    new Set(
      convertedRecipes
        .flatMap((recipe) => recipe.tags)
        .filter((tag): tag is string => tag !== undefined)
    )
  );

  return (
    <>
      <Center component="section" mt="md">
        <Title mb="xl">Your Recipes</Title>
      </Center>

      <Stack component="section">
        <TagsFilter tags={allTags} />
        <RecentRecipes recipes={convertedRecipes} />
      </Stack>
      <SignOutButton />
    </>
  );
}
