"use client";

import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React from "react";

export default function CategoryFilter({
  categories,
}: {
  categories: string[];
}) {
  const [filteredCategories, setFilteredCategories] = React.useState<string[]>(
    []
  );

  const handleChange = (
    event: SelectChangeEvent<typeof filteredCategories>
  ) => {
    const {
      target: { value },
    } = event;
    setFilteredCategories(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <FormControl fullWidth>
          <InputLabel id="recipe-categories">categories</InputLabel>
          <Select
            labelId="recipe-categories"
            id="recipe-categories"
            multiple
            value={filteredCategories}
            label="recipe-categories"
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Filter by your categories</FormHelperText>
        </FormControl>

        <IconButton aria-label="add recipe">
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Box>
    </>
  );
}
