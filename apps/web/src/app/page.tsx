import { RecipeForm } from "@/components/RecipeForm";
import { Box, Flex, Space, Stack, Text, Title } from "@mantine/core";

export default function Home() {
  return (
    <Flex direction="column">
      <Box mt="xl">
        <Stack gap="md">
          <Title fz={{ base: "2.5rem", xs: "3.75rem" }}>
            Declutter your recipes <br /> with Savorly!
          </Title>
          <Text>
            Paste, click, and get the essentials — your ingredients and
            instructions at your fingertips.
          </Text>
        </Stack>
        <Space h="xl" />
      </Box>
      <Box style={{ flex: 1 }}>
        <RecipeForm />
      </Box>
      <Space h="xl" />
    </Flex>
  );
}
