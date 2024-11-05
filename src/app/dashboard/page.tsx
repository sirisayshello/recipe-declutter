import CategoryFilter from "@/components/CategoryFilter";
import { Center, Stack, Title } from "@mantine/core";
import RecentRecipes from "@/components/RecentRecipes";
import { getUserRecipes } from "@/lib/actions";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

// categories hardcoded for now
const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Zucchini",
  "Snacks",
  "Chocolate",
  "Oats",
  "Potatoes",
  "Carrots",
];

export default async function Dashboard() {
  const session = await getAuth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const recipes = await getUserRecipes();

  return (
    <>
      <Center component="section" mt="md">
        <Title mb="xl">Your Recipes</Title>
      </Center>

      <Stack component="section">
        <CategoryFilter categories={categories} />
        <RecentRecipes recipes={recipes} />
      </Stack>
      <SignOutButton />
    </>
  );
}
