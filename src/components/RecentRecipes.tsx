import { Anchor, List, Title } from "@mantine/core";

export default async function RecentRecipes({
  recipes,
}: {
  recipes: UserRecipe[];
}) {
  return (
    <>
      <Title order={2}>Recent recipes</Title>
      <List listStyleType="none">
        {recipes.map((recipe) => {
          return (
            <li
              key={recipe.id}
              style={{
                borderBottom: "1px solid var(--mantine-color-gray-3)",
                padding: "10px 0",
              }}
            >
              <Anchor href={`/dashboard/${recipe.id}`} underline="never">
                {recipe.title}
              </Anchor>
            </li>
          );
        })}
      </List>
    </>
  );
}
