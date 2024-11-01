"use client";

import { useState } from "react";
import { Container, Burger, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Navbar.module.css";
import Link from "next/link";
import { LoginButton } from "../LogInButton";
import { useSession } from "next-auth/react";

const links = [
  { link: "/about", label: "About" },
  {
    link: "https://github.com/sirisayshello/recipe-declutter",
    label: "Github",
  },
];

export const Navbar = () => {
  const { data: session } = useSession();
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

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
      </Container>
    </header>
  );
};
