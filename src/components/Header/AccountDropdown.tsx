import { Anchor, Menu, rem } from "@mantine/core";
import { IconSettings, IconLogout2, IconNotebook } from "@tabler/icons-react";
import { LoginButton } from "../LogInButton";
import { Session } from "next-auth";
import Link from "next/link";
import { signOut } from "next-auth/react";

type AccountDropdownProps = {
  session: Session | null;
};

export default function AccountDropdown({ session }: AccountDropdownProps) {
  if (!session) {
    return (
      <Link href="/login" passHref>
        <LoginButton session={session} />
      </Link>
    );
  }
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <LoginButton session={session} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>My Account</Menu.Label>
        <Menu.Item
          component={Link}
          href="/dashboard"
          leftSection={
            <IconNotebook style={{ width: rem(18), height: rem(18) }} />
          }
        >
          My recipes
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="#"
          leftSection={
            <IconSettings style={{ width: rem(18), height: rem(18) }} />
          }
        >
          Settings
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item
          onClick={() => signOut({ callbackUrl: "/login" })}
          leftSection={
            <IconLogout2 style={{ width: rem(18), height: rem(18) }} />
          }
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
