"use client";
import {
  ActionIcon,
  Anchor,
  Box,
  Grid,
  Group,
  List,
  Title,
} from "@mantine/core";
import { IconLayoutGrid, IconList } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { RecipeCard } from "./RecipeCard";
import TagsFilter from "./TagsFilter";

type RecipeListProps = {
  recipes: UserRecipe[];
  title?: string;
  tags: Tag[];
};

export default function RecipesList({ recipes, title, tags }: RecipeListProps) {
  const [view, setView] = useState("list");
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  return (
    <>
      {recipes.length > 0 && (
        <Box component="section" pt={"xl"}>
          <Group
            justify="space-between"
            align="flex-end"
            mb={"md"}
            wrap="nowrap"
          >
            {title ? (
              <Title order={2}>{title}</Title>
            ) : (
              <TagsFilter
                allUserTags={tags}
                filteredTags={filteredTags}
                onTagsChange={setFilteredTags}
              />
            )}
            {!recipes && (
              <p>
                Ready to start your collection? Click the + button to add your
                first recipe!
              </p>
            )}

            <Group maw={80} mb={8} wrap="nowrap">
              <ActionIcon
                variant={view === "list" ? "filled" : "light"}
                aria-label="List view"
                onClick={() => setView("list")}
              >
                <IconList
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon
                variant={view === "card" ? "filled" : "light"}
                aria-label="Card view"
                onClick={() => setView("card")}
              >
                <IconLayoutGrid
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
          </Group>
          {view === "list" && (
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
          )}
          {view === "card" && (
            <Grid mt="md">
              {recipes.map((recipe) => {
                return (
                  <Grid.Col key={recipe.id} span={{ base: 12, md: 6, lg: 3 }}>
                    <RecipeCard recipe={recipe} />
                  </Grid.Col>
                );
              })}
            </Grid>
          )}
        </Box>
      )}
    </>
  );
}
