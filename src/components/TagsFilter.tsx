"use client";

import React, { useState } from "react";
import { ActionIcon, Group, MultiSelect } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

export default function TagsFilter({ tags }: { tags: Tag[] }) {
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const stringTags = tags.map((tag) => tag.name);

  return (
    <Group justify="center" align="center" wrap="nowrap">
      <MultiSelect
        label="Filter recipes"
        placeholder="Pick tags"
        data={stringTags}
        value={filteredTags}
        onChange={setFilteredTags}
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
