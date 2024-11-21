import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RandomRecipe } from "@/components/RandomRecipe";
import RecipesList from "@/components/RecipesList";
import { getAuth } from "@/lib/auth";
import { getRecipesByUserId, getUserTags } from "@/lib/queries";
import { Box, Button, Group, Space, Text, Title } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      <Breadcrumbs />
      <Box mt="xl" mb="md" component="section">
        <Title mb="xs">Your recipes</Title>
        <Text>
          You have {numberOfRecipes} delicious{" "}
          {numberOfRecipes === 1 ? "recipe" : "recipes"} in your collection
        </Text>
        <Group mt="xl">
          <Button href={"/"} component={Link} leftSection={<IconCirclePlus />}>
            Add New Recipe
          </Button>
          <RandomRecipe recipes={convertedRecipes} />
        </Group>
      </Box>
      <RecipesList tags={tags} recipes={convertedRecipes} />
      <Space h="4rem" />
    </>
  );
}
