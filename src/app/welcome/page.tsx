import { getAuth } from "@/lib/auth";
import { Box, Flex, Title, Space, Text } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import { RecipeForm } from "@/components/RecipeForm";

export default async function Welcome() {
  const session = await getAuth();

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
      <RecentRecipes />
      <Space h="xl" />
    </>
  );
}
