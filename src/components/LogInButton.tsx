import { Button } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { Session } from "next-auth";
import React, { forwardRef } from "react";

type LoginButtonProps = {
  session: Session | null;
} & React.ComponentPropsWithoutRef<"button">;

export const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ session, ...props }, ref) => {
    const displayName = session
      ? session.user.name?.charAt(0).toUpperCase()
      : "Log in";

    return (
      <Button
        ref={ref}
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
        {...props}
      >
        {displayName}
      </Button>
    );
  }
);
LoginButton.displayName = "LoginButton";
