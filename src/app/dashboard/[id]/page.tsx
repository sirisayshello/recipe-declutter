"use client";
import { useState } from "react";
import Link from "next/link";
import { Box, Typography, Button, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

export default function Recipe({ params }: { params: { id: string } }) {
  const { id } = params;
  const [column, setColumn] = useState("ingredients");

  return (
    <>
      <Box
        className="iconBanner"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Link href="/dashboard">
          <ArrowBackIcon />
        </Link>
        <Link href={`/dashboard/${id}/edit`}>
          <EditIcon />
        </Link>
      </Box>
      <Box component="section">
        <Typography variant="h1">Easy American Pancakes</Typography>
        <Box className="recipeChips">
          <Chip label="Breakfast" />
          <Chip label="Dessert" />
          <Chip label="Pancakes" />
        </Box>
      </Box>
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
        </Box>
      </Box>
    </>
  );
}
