"use client";
import Link from "next/link";

const recipes = [
  { id: "recipe1", name: "Siris Lunch" },
  { id: "recipe2", name: "Joars Lunch" },
  { id: "recipe3", name: "Julias Lunch" },
];

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link href={`/dashboard/${recipe.id}`}>{recipe.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
