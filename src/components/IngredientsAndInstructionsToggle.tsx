import { Button, Group, List, Stack } from "@mantine/core";

type IngAndInstToggleProps = {
  recipe: Recipe;
  view: string;
  setView: (view: string) => void;
};

export const IngredientsAndInstructionsToggle = ({
  recipe,
  view,
  setView,
}: IngAndInstToggleProps) => {
  return (
    <Stack component="section">
      <Group justify="space-between" grow>
        <Button
          variant={view === "ingredients" ? "filled" : "light"}
          color="gray"
          size="md"
          radius="xl"
          onClick={() => setView("ingredients")}
        >
          Ingredients
        </Button>

        <Button
          variant={view === "instructions" ? "filled" : "light"}
          color="gray"
          size="md"
          radius="xl"
          onClick={() => setView("instructions")}
        >
          Instructions
        </Button>
      </Group>

      {/* <Text>Prep time:</Text> {recipe.prepTime}
      <Text>Cook time:</Text> {recipe.cookTime}
      <Text>Total time:</Text> {recipe.totalTime}
      <Text>Yield:</Text> {recipe.yield} */}

      {view === "ingredients" && (
        <List>
          {recipe.ingredients.map((ingredient, index) => {
            return <List.Item key={index}>{ingredient}</List.Item>;
          })}
        </List>
      )}
      {view === "instructions" && (
        <List type="ordered" spacing="xs">
          {recipe.instructions.map((instruction, index) => {
            return <List.Item key={index}>{instruction}</List.Item>;
          })}
        </List>
      )}
    </Stack>
  );
};
