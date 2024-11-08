"use client";

import { useState } from "react";
import { Container, Burger, Anchor, Text, Paper, Stack } from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AccountDropdown from "./AccountDropdown";
import { LoginButton } from "../LogInButton";

export const Navbar = () => {
  const { data: session } = useSession();
  const [opened, { toggle, close }] = useDisclosure(false);
  const ref = useClickOutside(() => close());
  const [active, setActive] = useState("/");

  const containerProps = {
    h: 56,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  };

  return (
    <header
      style={{
        height: "56px",
        backgroundColor: "var(--mantine-color-dustyRed-7)",
      }}
    >
      <Container {...containerProps} size="md">
        <Burger color="cream.0" opened={opened} onClick={toggle} size="sm" />

        <Anchor component={Link} href="/" underline="never">
          <Text c="cream.0" fw={500}>
            Recipe Declutter
          </Text>
        </Anchor>
        {/* Different button depending on whether the user is logged in or not */}
        {!session ? (
          <Link href="/login" passHref>
            <LoginButton session={session} />
          </Link>
        ) : (
          <AccountDropdown session={session} />
        )}

        {opened && (
          <Paper
            ref={ref}
            pos="absolute"
            top={56}
            left={0}
            right={0}
            p={16}
            shadow="md"
            radius={0}
          >
            <Container>
              <Stack pl={6}>
                <Anchor
                  component={Link}
                  href="/about"
                  data-active={active === "/about" ? "true" : undefined}
                  onClick={() => {
                    setActive("/about");
                  }}
                >
                  About
                </Anchor>
                <Anchor
                  component={Link}
                  href="https://github.com/sirisayshello/recipe-declutter"
                  target="_blank"
                  onClick={() => {
                    setActive(
                      "https://github.com/sirisayshello/recipe-declutter"
                    );
                  }}
                >
                  Github
                </Anchor>
              </Stack>
            </Container>
          </Paper>
        )}
      </Container>
    </header>
  );
};
