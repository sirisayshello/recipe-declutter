import { Anchor, Group, Paper, Text } from "@mantine/core";
import { IconClockHour4, IconToolsKitchen2 } from "@tabler/icons-react";
import Link from "next/link";

export const RecipeCard = ({ recipe }: { recipe: UserRecipe }) => {
  return (
    <Paper
      withBorder
      radius={"sm"}
      p="md"
      h={"100%"}
      bg={"var(--mantine-color-default)"}
    >
      <Anchor
        component={Link}
        href={`/dashboard/${recipe.slug}?id=${recipe.id}`}
        underline="never"
      >
        {recipe.title}
      </Anchor>
      <Group mt="xs">
        <Group gap={"xs"}>
          <IconClockHour4 size={16} />
          <Text size="xs">{recipe.time}</Text>
        </Group>
        <Group gap={"xs"}>
          <IconToolsKitchen2 size={16} />
          <Text size="xs">{recipe.yield}</Text>
        </Group>
      </Group>
    </Paper>
  );
};
