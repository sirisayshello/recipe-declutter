import { RecipeForm } from "@/components/RecipeForm";
import { Box, Flex, Space, Text, Title } from "@mantine/core";

export default function Home() {
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
      <RecipeForm />

      <Space h="xl" />
    </>
  );
}
