"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  rem,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

type UserData = {
  email: string;
  name: string;
  password: string;
  accepted: boolean;
};

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [tooltipOpened, setTooltipOpened] = useState(false);

  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      accepted: false,
    },
    validate: {
      name: hasLength({ min: 3 }, "Must be at least 3 characters"),
      email: isEmail("Invalid email"),
      password: hasLength({ min: 8 }, "Must be at least 8 characters"),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
      accepted: (value) =>
        value ? null : "You must accept terms and conditions",
    },
  });

  const submitUserData = async (userData: UserData) => {
    setLoading(true);

    userData.email = userData.email.toLowerCase();

    // Half a second delay so that the loading spinner doesn't just flash
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const signUpResponse = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await signUpResponse.json();

      if (!signUpResponse.ok) {
        throw new Error(data.message);
      }

      const loginResponse = await signIn("credentials", {
        redirect: false,
        email: userData.email,
        password: userData.password,
      });

      // Clear potential notification errors still on the screen before redirecting
      notifications.clean();

      if (loginResponse?.error) {
        // Redirect to login page if login fails
        router.push("/login");
      }

      // redirect to welcome page as logged in user
      router.push("/welcome");
    } catch (error: unknown) {
      setLoading(false);

      if (error instanceof Error) {
        console.error(error);

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
          message: error.message, // probably: User with this email already exists
          icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        });
      } else {
        console.error("An unknown error occurred.");

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
          message: "Something went wrong. Please try again.",
          icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        });
      }
    }
  };

  return (
    <Paper
      bg={"var(--mantine-color-default)"}
      p={{ base: "md", sm: "xl" }}
      withBorder
      shadow="md"
      maw="30rem"
      mx="auto"
    >
      <form onSubmit={form.onSubmit(submitUserData)}>
        <Stack>
          <TextInput
            {...form.getInputProps("name")}
            key={form.key("name")}
            label="Name"
            placeholder="Your name"
            disabled={loading}
          />
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
          <PasswordInput
            {...form.getInputProps("confirmPassword")}
            key={form.key("confirmPassword")}
            label="Confirm Password"
            placeholder="Confirm your password"
            disabled={loading}
            type="password"
          />

          <Tooltip
            opened={tooltipOpened}
            multiline
            w={220}
            radius={"sm"}
            position="top-start"
            transitionProps={{ transition: "fade-down", duration: 500 }}
            label="By creating an account at Savorly I waive my rights to GDPR (The developers didn't have time to develop CRUD for the users table)."
          >
            <Checkbox
              onClick={() => setTooltipOpened(false)}
              key={form.key("accepted")}
              {...form.getInputProps("accepted", { type: "checkbox" })}
              label={
                <>
                  I accept the{" "}
                  <Anchor
                    underline={tooltipOpened ? "always" : "hover"}
                    component={"button"}
                    type="button"
                    inherit
                    onClick={() => setTooltipOpened((o) => !o)}
                  >
                    terms and conditions
                  </Anchor>
                </>
              }
            />
          </Tooltip>

          <Button type="submit" mt="md" variant="filled" loading={loading}>
            Create account
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
