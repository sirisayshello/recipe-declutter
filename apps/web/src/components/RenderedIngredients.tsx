import { Checkbox, List } from "@mantine/core";

type RenderedIngredientsProps = {
  recipe: UserRecipe;
  checkboxStates: boolean[];
  onCheckboxChange: (index: number, checked: boolean) => void;
};

export default function RenderedIngredients({
  recipe,
  checkboxStates,
  onCheckboxChange,
}: RenderedIngredientsProps) {
  return (
    <List listStyleType="none" spacing="xs">
      {recipe.ingredients.map((ingredient, index) => {
        return (
          <List.Item
            styles={{
              itemWrapper: {
                display: "inline",
              },
            }}
            key={index}
          >
            <Checkbox
              size="md"
              checked={checkboxStates[index]}
              onChange={(event) =>
                onCheckboxChange(index, event.currentTarget.checked)
              }
              label={
                <span
                  style={{
                    opacity: checkboxStates[index] ? 0.5 : 1,
                  }}
                >
                  {ingredient}
                </span>
              }
            />
          </List.Item>
        );
      })}
    </List>
  );
}
