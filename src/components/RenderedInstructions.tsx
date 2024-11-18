import { Checkbox, List, Title } from "@mantine/core";

type RenderProps = {
  recipe: UserRecipe;
  checkboxStates: boolean[];
  onCheckboxChange: (index: number, checked: boolean) => void;
};

export default function RenderedInstructions({
  recipe,
  checkboxStates,
  onCheckboxChange,
}: RenderProps) {
  if (typeof recipe.instructions[0] === "string") {
    return (
      <List listStyleType="none" spacing="xs">
        {recipe.instructions.map((instruction, index) => (
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
                  {`${index + 1}. ${instruction}`}
                </span>
              }
            />
          </List.Item>
        ))}
      </List>
    );
  } else if (typeof recipe.instructions[0] === "object") {
    return (
      <>
        {recipe.instructions.map((section, sectionIndex) => {
          if (typeof section === "object" && "name" in section) {
            return (
              <div key={sectionIndex}>
                <Title order={3}>{section.name}</Title>
                <List listStyleType="none" spacing="xs">
                  {section.text.map((instruction: string, index: number) => (
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
                            {`${index + 1}. ${instruction}`}
                          </span>
                        }
                      />
                    </List.Item>
                  ))}
                </List>
              </div>
            );
          }
        })}
      </>
    );
  }
}
