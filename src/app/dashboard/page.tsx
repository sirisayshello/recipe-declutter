import TagsFilter from "@/components/TagsFilter";
import { Center, Stack, Title } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import { getUserRecipes } from "@/lib/actions";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import { getUserTags } from "@/lib/queries";

export default async function Dashboard() {
  const session = await getAuth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const recipes = await getUserRecipes();
  const convertedRecipes = recipes as UserRecipe[];
  const tags = await getUserTags(session.user.id);

  return (
    <>
      <Center component="section" mt="md">
        <Title mb="xl">Your Recipes</Title>
      </Center>

      <Stack component="section">
        <TagsFilter tags={tags} />
        <RecentRecipes recipes={convertedRecipes} />
      </Stack>
      <SignOutButton />
    </>
  );
}
