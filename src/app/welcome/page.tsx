import { getAuth } from "@/lib/auth";
import { Box, Flex, Title, Space, Text } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import WelcomeComponent from "@/app/welcome/components/WelcomeComponent";
import { getUserRecipes } from "@/lib/actions";

export default async function Welcome() {
  const session = await getAuth();
  const recipes = await getUserRecipes();

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

      <WelcomeComponent session={session} />
      <RecentRecipes recipes={recipes} />
    </>
  );
}
