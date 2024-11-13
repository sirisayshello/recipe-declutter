import { getAuth } from "@/lib/auth";
import { Box, Flex, Space } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import { getUserRecipes } from "@/lib/actions";
import { RecipeForm } from "@/components/RecipeForm";
import WelcomeMessage from "@/components/WelcomeMessage";
import { getUserTags } from "@/lib/queries";

export default async function Welcome() {
  const session = await getAuth();
  const recipes = await getUserRecipes();
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
