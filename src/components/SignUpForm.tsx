"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { signIn } from "next-auth/react";

type UserData = {
  email: string;
  name: string;
  password: string;
  accepted: boolean;
};

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    setError(null); // Clear any previous error
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

      if (loginResponse?.error) {
        setError("Something went wrong. Please try again.");
        router.push("/login"); // Redirect to login if login fails
      }

      // redirect to welcome page as logged in user
      router.push("/welcome");
    } catch (error: unknown) {
      setLoading(false);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Paper
      p={{ base: "md", sm: "xl" }}
      withBorder
      shadow="md"
      maw="30rem"
      mx="auto"
    >
      <form onSubmit={form.onSubmit(submitUserData)}>
        <Stack>
          {error && (
            <Alert variant="light" color="red" title="Sign up failed">
              {error}
            </Alert>
          )}
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
          {/* add popup with some simple t&c */}
          <Checkbox
            key={form.key("accepted")}
            {...form.getInputProps("accepted", { type: "checkbox" })}
            label="I accept terms and conditions"
          />
          <Button type="submit" mt="md" variant="filled" loading={loading}>
            Create account
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
