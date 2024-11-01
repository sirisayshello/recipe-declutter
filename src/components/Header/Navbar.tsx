"use client";

import { useState } from "react";
import { Container, Burger, Anchor, Stack, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Navbar.module.css";
import Link from "next/link";
import { LoginButton } from "../LogInButton";
import { useSession } from "next-auth/react";

export const Navbar = () => {
  const { data: session } = useSession();
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState("/");

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Burger color="cream.0" opened={opened} onClick={toggle} size="sm" />
        <Anchor
          component={Link}
          className={classes.link}
          href="/"
          underline="never"
        >
          Recipe Declutter
        </Anchor>
        <LoginButton session={session} />

        {opened && (
          <Box className={classes.linksContainer}>
            <Container>
              <Link
                href="/about"
                className={classes.link}
                data-active={active === "/about" ? "true" : undefined}
                onClick={() => {
                  setActive("/about");
                }}
              >
                About
              </Link>
              <a
                href="https://github.com/sirisayshello/recipe-declutter"
                className={classes.link}
                target="_blank"
                onClick={() => {
                  setActive(
                    "https://github.com/sirisayshello/recipe-declutter"
                  );
                }}
              >
                Github
              </a>
            </Container>
          </Box>
        )}
      </Container>
    </header>
  );
};
