"use client";

import { MultiSelect } from "@mantine/core";

export default function TagsFilter({
  allUserTags,
  onTagsChange,
  filteredTags,
}: {
  allUserTags: Tag[];
  onTagsChange: (tags: string[]) => void;
  filteredTags: string[];
}) {
  const stringTags = allUserTags.map((tag) => tag.name);

  return (
    <MultiSelect
      label="Filter recipes"
      placeholder="Pick tags"
      data={stringTags}
      value={filteredTags}
      onChange={onTagsChange}
      searchable
      clearable
      style={{ width: "100%" }}
      comboboxProps={{ dropdownPadding: 8 }}
    />
  );
}
