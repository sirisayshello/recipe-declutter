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
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserButton } from "../LogInButton";
import { IconLogout2, IconNotebook, IconSettings } from "@tabler/icons-react";
// import { usePathname } from "next/navigation";

const userMenuItems = [
  {
    name: "My Recipes",
    href: "/dashboard",
    icon: <IconNotebook />,
  },
  {
    name: "Settings",
    href: "#",
    icon: <IconSettings />,
  },
];

export const Navbar = () => {
  const { data: session } = useSession();
  const [burgerOpened, { open: openBurger, close: closeBurger }] =
    useDisclosure(false);
  const [userButtonOpened, { open: openUserButton, close: closeUserButton }] =
    useDisclosure(false);
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
        {/* Burger menu */}
        <Burger
          hiddenFrom="xs"
          color="cream.0"
          opened={burgerOpened}
          onClick={openBurger}
          size="md"
        />
        <Drawer
          opened={burgerOpened}
          onClose={closeBurger}
          withCloseButton={false}
        >
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
        {/* Burger menu content if big screen */}
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

        {/* Logo */}
        <Anchor component={Link} href="/" underline="never">
          <Text c="cream.0" fw={500}>
            Recipe Declutter
          </Text>
        </Anchor>

        {/* User menu (no menu if logged out, only login button) */}
        {!session ? (
          <Link href="/login" passHref>
            <UserButton isLoggedIn={false} displayName="Log in" />
          </Link>
        ) : (
          <>
            <UserButton
              isLoggedIn={true}
              displayName={session.user.name?.charAt(0).toUpperCase() || "U"}
              onClick={openUserButton}
            />
            <Drawer
              opened={userButtonOpened}
              onClose={closeUserButton}
              withCloseButton={false}
              position="right"
            >
              <Group justify="space-between">
                <Text size="xl" fw={700}>
                  {session.user.name}
                </Text>
                <Drawer.CloseButton m={0} />
              </Group>
              <Divider mt={16} mb={16} />

              <Stack gap={24}>
                {userMenuItems.map((item, index) => (
                  <Anchor
                    key={index}
                    component={Link}
                    href={item.href}
                    onClick={closeUserButton}
                    c="var(--mantine-color-text)"
                  >
                    <Group
                      align="center"
                      gap="sm"
                      p="md"
                      style={{
                        border: "1px solid var(--mantine-color-gray-3)",
                      }}
                    >
                      {item.icon}
                      {item.name}
                    </Group>
                  </Anchor>
                ))}
                <Button
                  leftSection={<IconLogout2 size={24} />}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  p="md"
                  radius={0}
                  size="xl"
                  fz="md"
                  fw="400"
                >
                  Log out
                </Button>
              </Stack>
            </Drawer>
          </>
        )}
      </Container>
    </Box>
  );
};
