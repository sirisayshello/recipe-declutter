"use client";

import { deleteRecipeById } from "@/lib/queries";
import { useRouter } from "next/navigation";

export default function DeleteRecipeButton({
  title,
  id,
}: {
  title: string;
  id: number;
}) {
  const router = useRouter();

  const handleClick = () => {
    deleteRecipeById(id);
    router.push("/dashboard");
    // add a confirmation/toast message on the dashboard when successful
  };

  return <button onClick={handleClick}>Delete {title}</button>;
}
