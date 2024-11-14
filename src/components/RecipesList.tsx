import { Anchor, Box, List, Title } from "@mantine/core";
import Link from "next/link";

export default async function RecipesList({
  recipes,
  title,
}: {
  recipes: UserRecipe[];
  title?: string;
}) {
  return (
    <>
      {recipes.length > 0 && (
        <Box component="section" pt={"xl"}>
          <Title order={2}>{title}</Title>
          {!recipes && (
            <p>
              Ready to start your collection? Click the + button to add your
              first recipe!
            </p>
          )}

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
                  <Anchor
                    component={Link}
                    href={`/dashboard/${recipe.slug}?id=${recipe.id}`}
                    underline="never"
                  >
                    {recipe.title}
                  </Anchor>
                </li>
              );
            })}
          </List>
        </Box>
      )}
    </>
  );
}
