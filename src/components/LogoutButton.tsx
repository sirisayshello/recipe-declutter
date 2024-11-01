"use client";

import { signOut } from "next-auth/react";
import { Button } from "@mantine/core";

export default function LogoutButton() {
  return (
    <Button onClick={() => signOut()} variant="filled" size="md" radius="xl">
      Sign out
    </Button>
  );
}
