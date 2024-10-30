import { getAuth } from "@/lib/auth";
import { Box, Flex, Title, Space, Text } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import Welcome from "@/app/welcome/components/Welcome";

export default async function WelcomeLayout() {
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

      <Welcome session={session} />
      <RecentRecipes />
    </>
  );
}
