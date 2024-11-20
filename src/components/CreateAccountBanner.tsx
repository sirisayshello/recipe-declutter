import { Paper, Flex, Box, Title, Button, Stack, Text } from "@mantine/core";
import { IconChefHat, IconCarrot, IconCheese } from "@tabler/icons-react";
import Link from "next/link";

export const CreateAccountBanner = () => {
  return (
    <Paper
      component="section"
      p="xl"
      bg={"var(--mantine-color-default)"}
      radius={"sm"}
      shadow="xs"
    >
      <Flex justify="space-between" gap={"sm"}>
        <Box>
          <Title mb={"md"} order={2}>
            Save, Edit & Organize Recipes
          </Title>
          <Text maw={"60ch"}>
            Unlock the full experience by creating an account. Keep your recipes
            saved, customized, and perfectly organized.
          </Text>
          <Button component={Link} href={"/signup"} mt={"xl"}>
            Create Free Account
          </Button>
        </Box>
        <Stack m={"auto"} align="center" justify="center" gap={0}>
          <Flex direction={{ base: "column", sm: "row" }}>
            <IconChefHat
              style={{
                color: "var(--mantine-color-dustyRed-7)",
                rotate: "-15deg",
              }}
              size={60}
              stroke={1}
            />
            <IconCarrot
              style={{ color: "var(--mantine-color-dustyRed-7)" }}
              size={60}
              stroke={1}
            />
          </Flex>
          <IconCheese
            style={{ color: "var(--mantine-color-dustyRed-7)" }}
            size={60}
            stroke={1}
          />
        </Stack>
      </Flex>
    </Paper>
  );
};
