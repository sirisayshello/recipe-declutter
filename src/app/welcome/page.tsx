import { getAuth } from "@/lib/auth";
import { Box, Flex, Space } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
// import { getUserRecipes } from "@/lib/actions";
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

  // Fetch recipes based on user id
  const recipes = await getRecipesByUserId(userId, 10);

  const convertedRecipes = recipes as UserRecipe[];
  const userName = session?.user.name;
  const userTags = await getUserTags(session?.user.id);

  return (
    <Flex direction="column" h="100%">
      <Box mt="md">
        <Flex gap="md" justify="center" align="center" direction="column">
          <WelcomeMessage userName={userName ?? "you"} />
        </Flex>
        <Space h="xl" />
      </Box>
      <RecipeForm session={session} userTags={userTags} />
      <RecentRecipes recipes={convertedRecipes} />
      <Space h="xl" />
    </Flex>
  );
}
