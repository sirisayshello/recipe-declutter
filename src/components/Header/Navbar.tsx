"use client";

import { useState } from "react";
import {
  Container,
  Group,
  Burger,
  Anchor,
  Flex,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import Link from "next/link";

const links = [
  { link: "/dashboard", label: "Dashboard" },
  { link: "/about", label: "About" },
  {
    link: "https://github.com/sirisayshello/recipe-declutter",
    label: "Github",
  },
];

export const Navbar = () => {
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
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger
          color="#fff9f5"
          opened={opened}
          onClick={toggle}
          hiddenFrom="xs"
          size="sm"
        />
        <Anchor
          component={Link}
          className={classes.link}
          href="/"
          underline="never"
        >
          Recipe Declutter
        </Anchor>
        <Flex hiddenFrom="xs">
          <ActionIcon
            color="#fff9f5"
            variant="transparent"
            component="a"
            href="/dashboard"
            aria-label="Dashboard"
          >
            <IconUser stroke={1} style={{ justifySelf: "end" }} />
          </ActionIcon>
        </Flex>
      </Container>
    </header>
  );
};
