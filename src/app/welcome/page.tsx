import { getAuth } from "@/lib/auth";
import { Box, Flex, Space } from "@mantine/core";
import RecipesList from "@/components/RecipesList";
import { RecipeForm } from "@/components/RecipeForm";
import WelcomeMessage from "@/components/WelcomeMessage";
import { getRecipesByUserId, getUserTags } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function Welcome() {
  const session = await getAuth();

  if (!session || !session.user) {
    redirect("/");
  }

  const userId = session.user.id;

  // fetch 10 recipes for the "Recent Recipes" list
  const recipes = await getRecipesByUserId(userId, 10);

  const convertedRecipes = recipes as UserRecipe[];
  const userName = session?.user.name;
  const userTags = await getUserTags(session?.user.id);

  return (
    <Flex direction="column" h="100%">
      <Box mt="xl">
        <Flex gap="md" direction="column">
          <WelcomeMessage userName={userName ?? "you"} />
        </Flex>
        <Space h="xl" />
      </Box>
      <RecipeForm session={session} userTags={userTags} />
      <RecipesList recipes={convertedRecipes} title="Your latest recipes" />
      <Space h="4rem" />
    </Flex>
  );
}
