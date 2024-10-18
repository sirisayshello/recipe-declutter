"use client";
import { useEffect, useState } from "react";
import { getScrapedRecipe } from "./actions/scraper";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

type recipe =
  | {
      ingredients: string[];
      instructions: string[];
    }
  | { message: string };

export default function Home() {
  const [recipe, setRecipe] = useState<recipe>();
  const [url, setUrl] = useState("");

  useEffect(() => {
    console.log(recipe);
  }, [recipe]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log(url);
    const data = await getScrapedRecipe(url);
    setRecipe(data);
  }

  function handleInputChange(e: any) {
    setUrl(e.target.value);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleInputChange} />
        <button type="submit">submit</button>
      </form>

      {recipe &&
        recipe?.ingredients.map((ingredient, index) => {
          return <div key={index}>{ingredient}</div>;
        })}
    </>
  );
}
