"use client";

import { Box, Button } from "@mui/material";
import { useState } from "react";

export default function RecipeList({
  ingredients,
  instructions,
}: {
  ingredients: string[];
  instructions: string[];
}) {
  const [column, setColumn] = useState("ingredients");

  return (
    <Box component="section">
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Button
          onClick={() => setColumn("ingredients")}
          variant="contained"
          sx={
            column === "ingredients"
              ? { backgroundColor: "grey.700" }
              : { backgroundColor: "grey.500", fontWeight: "normal" }
          }
        >
          Ingredients
        </Button>

        <Button
          onClick={() => setColumn("instructions")}
          variant="contained"
          sx={
            column === "instructions"
              ? { backgroundColor: "grey.700" }
              : { backgroundColor: "grey.500", fontWeight: "normal" }
          }
        >
          How to do it
        </Button>
      </Box>
      <Box className="recipe">
        <p>
          {column === "ingredients"
            ? "Here's what to put in it"
            : "Here's how to do it"}
        </p>

        {column === "ingredients" && (
          <ul>
            {ingredients.map((ingredient, index) => {
              return <li key={index}>{ingredient}</li>;
            })}
          </ul>
        )}

        {column === "instructions" && (
          <ul>
            {instructions.map((instruction, index) => {
              return <li key={index}>{instruction}</li>;
            })}
          </ul>
        )}
      </Box>
    </Box>
  );
}
