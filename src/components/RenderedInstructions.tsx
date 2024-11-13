import { Checkbox, List, Title } from "@mantine/core";
import { useRef } from "react";

type RenderProps = {
  recipe: UserRecipe;
};

export default function RenderedInstructions({ recipe }: RenderProps) {
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

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
              onChange={(event) => {
                if (labelRefs.current[index]) {
                  labelRefs.current[index].style.opacity = event.currentTarget
                    .checked
                    ? "0.4"
                    : "1";
                }
              }}
              label={
                <span
                  ref={(el) => {
                    labelRefs.current[index] = el;
                  }}
                >
                  {`${index + 1}. ${instruction}`}
                </span>
              }
            />
            {/* <Checkbox
              size="md"
              onChange={(event) => {
                if (labelRefs.current[index]) {
                  labelRefs.current[index].style.color = event.currentTarget
                    .checked
                    ? "lightgrey"
                    : "black";
                }
              }}
              label={
                <span
                  ref={(el) => {
                    labelRefs.current[index] = el;
                  }}
                >
                  {`${index + 1}. ${instruction}`}
                </span>
              }
            /> */}
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
