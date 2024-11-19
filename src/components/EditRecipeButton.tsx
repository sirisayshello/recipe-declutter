"use client";

import { Button, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";

function EditRecipeButton({ href }: { href: string }) {
  const theme = useMantineTheme();

  // Define breakpoints
  const isXSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  return (
    <Button
      component={Link}
      href={href}
      mt="md"
      variant="filled"
      leftSection={<IconPencil />}
      size={isXSmallScreen ? "xs" : "sm"}
    >
      Edit Recipe
    </Button>
  );
}

export default EditRecipeButton;
