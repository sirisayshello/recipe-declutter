import { useState } from "react";
import "./App.css";
import { Form } from "./components/Form/Form";
import { RecipeWrapper } from "./components/Recipe/RecipeWrapper";
import { Header } from "./components/Header/Header";
import { ErrorContainer } from "./components/Error/ErrorContainer";

export type RecipeData = {
  ingredients?: Ingredients;
  instructions?: Instructions;
  message?: string;
};

type Ingredients = string[];

type Instructions = string[];

function App() {
  const [recipeData, setRecipeData] = useState<RecipeData>({});
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  async function getRecipeData(url?: string) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        url: url,
      }),
    };

    const response = await fetch(
      "http://localhost:3001/recipe",
      requestOptions
    );

    const data = await response.json();

    setLoading(false);
    setRecipeData(data);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();
    console.log(url);
    getRecipeData(url);
    setUrl("");
    setRecipeData({});
  }

  return (
    <div className="App">
      <Header />
      <Form
        url={url}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      {recipeData?.message ? (
        <ErrorContainer errorMessage={recipeData.message} />
      ) : (
        <RecipeWrapper loading={loading} recipeData={recipeData} />
      )}
    </div>
  );
}

export default App;
