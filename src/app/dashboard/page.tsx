"use client";
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Link from "next/link";
import React from "react";

const recipes = [
  { id: "recipe1", name: "Siris Zucchini Lunch" },
  { id: "recipe2", name: "Joars Chocolate Snack" },
  { id: "recipe3", name: "Julias Oat Breakfast" },
  { id: "recipe4", name: "Emils Potato Dinner" },
  { id: "recipe5", name: "Carrot Cake Overnight Oats" },
  { id: "recipe6", name: "Quick noodles" },
];

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

export default function Dashboard() {
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
      <Box component="section" sx={{ p: 2 }}>
        <Typography variant="h1">Your Recipes</Typography>
      </Box>

      <Box component="section" sx={{ p: 2, backgroundColor: "grey.300" }}>
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
        <Typography variant="h2">Recent recipes</Typography>
        <List>
          {recipes.map((recipe) => (
            <ListItem divider key={recipe.id}>
              <Link href={`/dashboard/${recipe.id}`}>{recipe.name}</Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
