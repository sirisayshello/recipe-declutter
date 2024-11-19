import { Box, Checkbox, List, Text } from "@mantine/core";

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
  let sectionInstructionIndex = 0;
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
              <Box key={sectionIndex} pb={"sm"}>
                <Text pl={"md"} ml={"lg"} fw={"bold"}>
                  {section.name}
                </Text>
                <List listStyleType="none" spacing="xs">
                  {section.text.map((instruction: string, index: number) => {
                    const currentSectionInstructionIndex =
                      sectionInstructionIndex;
                    sectionInstructionIndex++;

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
                          checked={
                            checkboxStates[currentSectionInstructionIndex]
                          }
                          onChange={(event) =>
                            onCheckboxChange(
                              currentSectionInstructionIndex,
                              event.currentTarget.checked
                            )
                          }
                          label={
                            <span
                              style={{
                                opacity: checkboxStates[
                                  currentSectionInstructionIndex
                                ]
                                  ? 0.5
                                  : 1,
                              }}
                            >
                              {`${
                                currentSectionInstructionIndex + 1
                              }. ${instruction}`}
                            </span>
                          }
                        />
                      </List.Item>
                    );
                  })}
                </List>
              </Box>
            );
          }
        })}
      </>
    );
  }
}
