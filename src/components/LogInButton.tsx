import { Button } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { Session } from "next-auth";
import Link from "next/link";

type LoginButtonProps = {
  session?: Session | null;
};

export const LoginButton = ({ session }: LoginButtonProps) => {
  const displayName = session
    ? session.user.name?.charAt(0).toUpperCase()
    : "Log in";

  return (
    <Button
      href={session ? "/dashboard" : "/login"}
      component={Link}
      color="cream.0"
      size="xs"
      justify="center"
      leftSection={<IconUser size={20} stroke={1.5} />}
      variant={session ? "filled" : "light"}
      styles={{
        root: {
          color: session ? "var(--mantine-color-dustyRed-7)" : undefined, // Custom font color if logged in
        },
      }}
    >
      {displayName}
    </Button>
  );
};
