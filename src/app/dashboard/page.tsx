import { Box, Button, Group, Text, Title } from "@mantine/core";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRecipesByUserId, getUserTags } from "@/lib/queries";
import { IconArrowsShuffle2, IconCirclePlus } from "@tabler/icons-react";
import { DashboardRecipeList } from "@/components/DashboardRecipeList";

export default async function Dashboard() {
  const session = await getAuth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const recipes = await getRecipesByUserId(userId, "noLimit");
  const numberOfRecipes = recipes.length;

  const convertedRecipes = recipes as UserRecipe[];
  const tags = await getUserTags(session.user.id);

  return (
    <>
      <Box mt="md" mb="md" component="section">
        <Title mb="xs">Your recipes</Title>
        <Text>
          You have {numberOfRecipes} delicious recipes in your collection
        </Text>
        <Group mt="xl">
          <Button leftSection={<IconCirclePlus />}>Add New Recipe</Button>
          <Button variant="light" leftSection={<IconArrowsShuffle2 />}>
            Random Recipe
          </Button>
        </Group>
      </Box>
      <DashboardRecipeList tags={tags} recipes={convertedRecipes} />
    </>
  );
}
