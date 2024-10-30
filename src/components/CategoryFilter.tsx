"use client";

import React, { useState } from "react";
import { ActionIcon, Group, MultiSelect } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

export default function CategoryFilter({
  categories,
}: {
  categories: string[];
}) {
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  return (
    <Group justify="center" align="center" wrap="nowrap">
      <MultiSelect
        label="Filter recipes"
        placeholder="Pick tags"
        data={categories}
        value={filteredCategories}
        onChange={setFilteredCategories}
        searchable
        clearable
        style={{ width: "100%" }}
      />
      <ActionIcon
        variant="transparent"
        aria-label="Add recipe"
        size="xl"
        style={{ alignSelf: "end" }}
      >
        <IconCirclePlus style={{ width: "100%", height: "100%" }} stroke={1} />
      </ActionIcon>
    </Group>
  );
}
