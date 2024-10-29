"use client";

import { deleteRecipeById } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

export default function DeleteRecipeButton({ id }: { id: number }) {
  const router = useRouter();

  const handleClick = () => {
    deleteRecipeById(id);
    router.push("/dashboard");
    // add a confirmation/toast message on the dashboard when successful
  };

  return (
    <ActionIcon
      onClick={handleClick}
      variant="transparent"
      aria-label="Delete recipe"
    >
      <IconTrash />
    </ActionIcon>
  );
}
