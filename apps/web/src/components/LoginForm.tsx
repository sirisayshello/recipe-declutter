"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextInput,
  Button,
  PasswordInput,
  Stack,
  Paper,
  rem,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

type Credentials = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      email: isEmail("Invalid email"),
    },
  });

  const submitCredentials = async (values: Credentials) => {
    setLoading(true);

    values.email = values.email.toLowerCase();

    // Half a second delay so that the loading spinner doesn't just flash
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Clear potential notification errors still on the screen before redirecting
      notifications.clean();

      // Redirect to landing page
      router.push("/welcome");
    } catch (error: unknown) {
      setLoading(false);

      // show a notification error
      notifications.show({
        px: "lg",
        withBorder: true,
        loading: false,
        autoClose: 5000, // show error for 5 seconds
        withCloseButton: true,
        closeButtonProps: { "aria-label": "Hide notification" },
        color: "red",
        title: "Oh no!",
        message: "Invalid email or password. Please try again.",
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
      });

      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <Paper
        bg={"var(--mantine-color-default)"}
        p={{ base: "md", sm: "xl" }}
        withBorder
        shadow="md"
        maw="30rem"
        mx="auto"
      >
        <form onSubmit={form.onSubmit(submitCredentials)}>
          <Stack>
            <TextInput
              {...form.getInputProps("email")}
              key={form.key("email")}
              label="Email"
              placeholder="your@email.com"
              disabled={loading}
              type="email"
            />
            <PasswordInput
              {...form.getInputProps("password")}
              key={form.key("password")}
              label="Password"
              placeholder="Your password"
              disabled={loading}
              type="password"
            />

            <Button type="submit" mt="md" variant="filled" loading={loading}>
              Log in
            </Button>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
