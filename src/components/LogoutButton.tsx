"use client";

import { signOut } from "next-auth/react";
import { Button } from "@mantine/core";

export default function LogoutButton() {
  const onSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Button onClick={onSignOut} variant="filled" size="md" radius="xl">
      Sign out
    </Button>
  );
}
