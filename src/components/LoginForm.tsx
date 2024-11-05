"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextInput,
  Button,
  Alert,
  PasswordInput,
  Stack,
  Paper,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";

type Credentials = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [error, setError] = useState("");
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
    setError(""); // Clear any previous error
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
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        router.push("/welcome"); // Redirect to landing page
      }
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
    <>
      <Paper
        p={{ base: "md", sm: "xl" }}
        withBorder
        shadow="md"
        maw="30rem"
        mx="auto"
      >
        <form onSubmit={form.onSubmit(submitCredentials)}>
          <Stack>
            {error && (
              <Alert variant="light" color="red" title="Sign up failed">
                {error}
              </Alert>
            )}
            <TextInput
              {...form.getInputProps("email")}
              key={form.key("email")}
              label="Email"
              placeholder="your@email.com"
              disabled={loading}
            />
            <PasswordInput
              {...form.getInputProps("password")}
              key={form.key("password")}
              label="Password"
              placeholder="Your password"
              disabled={loading}
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
