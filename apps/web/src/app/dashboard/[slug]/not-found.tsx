import { Button, Group, Stack, Title, Text } from "@mantine/core";

export default function RecipeNotFound() {
  return (
    <>
      <Stack component="main" mt="md">
        <Title ta="center" mt="md" mb="md">
          Recipe not found
        </Title>
        <Text ta="center" mb="md">
          The recipe you&apos;re looking for might have been deleted or
          doesn&apos;t exist.
        </Text>
        <Group justify="center" mt="md">
          <Button component="a" size="md" href="/dashboard">
            Your recipes
          </Button>
          <Button component="a" variant="outline" size="md" href="/welcome">
            Add new recipes
          </Button>
        </Group>
      </Stack>
    </>
  );
}
