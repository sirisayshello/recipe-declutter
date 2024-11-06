import { getAuth } from "@/lib/auth";
import { Box, Flex, Title, Space, Text } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import { getUserRecipes } from "@/lib/actions";
import { RecipeForm } from "@/components/RecipeForm";

export default async function Welcome() {
  const session = await getAuth();
  const recipes = await getUserRecipes();
  const convertedRecipes = recipes as UserRecipe[];

  return (
    <>
      <Box component="section" mt="md">
        <Flex gap="md" justify="center" align="center" direction="column">
          <Title ta="center">Welcome to Recipe Declutter!</Title>
          <Text ta="center">
            Paste, click, and get the essentials — your ingredients and
            instructions at your fingertips.
          </Text>
        </Flex>
        <Space h="xl" />
      </Box>
      <RecipeForm session={session} />
      <RecentRecipes recipes={convertedRecipes} />
      <Space h="xl" />
    </>
  );
}
