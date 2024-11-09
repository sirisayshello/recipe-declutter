import { Button } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import React, { forwardRef } from "react";

type LoginButtonProps = {
  displayName: string;
  isLoggedIn?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

export const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ displayName, isLoggedIn = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        color="cream.0"
        size="xs"
        justify="center"
        leftSection={<IconUser size={20} stroke={1.5} />}
        variant={isLoggedIn ? "filled" : "light"}
        styles={{
          root: {
            color: isLoggedIn ? "var(--mantine-color-dustyRed-7)" : undefined, // Custom font color if logged in
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
