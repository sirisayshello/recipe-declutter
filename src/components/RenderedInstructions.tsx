import { List, Title } from "@mantine/core";

type RenderProps = {
  recipe: UserRecipe;
};

export default function RenderedInstructions({ recipe }: RenderProps) {
  if (typeof recipe.instructions[0] === "string") {
    return (
      <List type="ordered" spacing="xs">
        {recipe.instructions.map((instruction, index) => (
          <List.Item
            styles={{
              itemWrapper: {
                display: "inline",
              },
            }}
            key={index}
          >
            {instruction as string}
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
                <List type="ordered" spacing="xs">
                  {section.text.map((instruction: string, index: number) => (
                    <List.Item
                      styles={{
                        itemWrapper: {
                          display: "inline",
                        },
                      }}
                      key={index}
                    >
                      {instruction}
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
