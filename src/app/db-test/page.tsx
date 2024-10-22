"use client";
import { getRecipes } from "@/lib/queries";
import { TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

// This file was used as a way to test that the prisma client works correctly.
// Including it in the commit for testing and review purposes.

// Add the contents of this file to the "Dashboard" page later if necessary, or delete it
// (A separate file was created in order to avoid merge conflicts)

export default function DatabaseTest() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getRecipes();
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      {recipes.length > 0 ? (
        recipes.map((recipe) => <div key={recipe.id}>{recipe.title}</div>)
      ) : (
        <div>no recipes in db yet</div>
      )}

      <TextInput
        label="Input label"
        description="Mantine textinput"
        placeholder="Input placeholder"
      />
    </div>
  );
}
