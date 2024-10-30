import { getServerSession } from "next-auth";
import { Box, Flex, Title, Space, Text } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import Welcome from "@/components/Welcome";

export default async function WelcomeLayout() {
  const session = await getServerSession();

  console.log({ session });

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
