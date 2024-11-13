"use client";

import {
  Container,
  Burger,
  Anchor,
  Text,
  Stack,
  Drawer,
  Divider,
  Group,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserButton } from "../LogInButton";
import UserMenu from "./UserMenu";
// import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { data: session } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  // usePathname if we want highlighted links
  // const active = usePathname();

  const containerProps = {
    h: 56,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  };

  return (
    <Box component="header" bg={theme.primaryColor} h={"56px"}>
      <Container {...containerProps} size="md">
        <Burger
          hiddenFrom="xs"
          color="cream.0"
          opened={opened}
          onClick={open}
          size="md"
        />
        <Drawer opened={opened} onClose={close} withCloseButton={false}>
          <Group>
            <Drawer.CloseButton m={0} />
            <Text size="xl" fw={700}>
              Recipe Declutter
            </Text>
          </Group>
          <Divider mt={16} mb={16} />
          <Stack gap={24}>
            <Anchor component={Link} href="/about">
              About
            </Anchor>
            <Anchor
              component={Link}
              href="https://github.com/sirisayshello/recipe-declutter"
              target="_blank"
            >
              Github
            </Anchor>
          </Stack>
        </Drawer>

        <Group visibleFrom="xs">
          <Anchor c="cream.0" component={Link} href="/about">
            About
          </Anchor>
          <Anchor
            c="cream.0"
            component={Link}
            href="https://github.com/sirisayshello/recipe-declutter"
            target="_blank"
          >
            Github
          </Anchor>
        </Group>

        <Anchor component={Link} href="/" underline="never">
          <Text c="cream.0" fw={500}>
            Recipe Declutter
          </Text>
        </Anchor>
        {/* Different button depending on whether the user is logged in or not */}
        {!session ? (
          <Link href="/login" passHref>
            <UserButton displayName="Log in" />
          </Link>
        ) : (
          <UserMenu
            displayName={session.user.name?.charAt(0).toUpperCase() || "U"}
          />
        )}
      </Container>
    </Box>
  );
};
