import { RecipeForm } from "@/components/RecipeForm";
import { Box, Flex, Space, Text, Title } from "@mantine/core";

export default function Home() {
  return (
    <Flex direction="column" h="100%">
      <Box mt="xl">
        <Flex gap="md" direction="column">
          <Title fz={{ base: "54px", xs: "60px" }}>
            Welcome to <br /> Recipe Declutter!
          </Title>
          <Text>
            Paste, click, and get the essentials — your ingredients and
            instructions at your fingertips.
          </Text>
        </Flex>
        <Space h="xl" />
      </Box>
      <Box style={{ flex: 1 }}>
        <RecipeForm />
      </Box>
      <Space h="xl" />
    </Flex>
  );
}
