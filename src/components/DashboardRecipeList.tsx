"use client";
import { Stack } from "@mantine/core";
import TagsFilter from "./TagsFilter";
import RecipesList from "./RecipesList";
import { useState } from "react";

type DashboardRecipeListProps = {
  tags: Tag[];
  recipes: UserRecipe[];
};

export const DashboardRecipeList = ({
  tags,
  recipes,
}: DashboardRecipeListProps) => {
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  const filteredRecipes = recipes.filter((recipe) => {
    return filteredTags.every((tag) =>
      recipe.tags?.map((tag) => tag.tag.name).includes(tag)
    );
  });

  return (
    <Stack component="section">
      <TagsFilter
        allUserTags={tags}
        filteredTags={filteredTags}
        onTagsChange={setFilteredTags}
      />
      <RecipesList recipes={filteredRecipes} />
    </Stack>
  );
};
