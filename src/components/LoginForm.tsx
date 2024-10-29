"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button, Alert, PasswordInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";

type Credentials = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [error, setError] = useState("");
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

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        form.reset(); // Reset form only if submission was successful
        router.push("/welcome"); // Redirect to landing page
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(submitCredentials)}>
        {error && (
          <Alert variant="light" color="red" title="Login failed" mt="md">
            {error}
          </Alert>
        )}
        <TextInput
          {...form.getInputProps("email")}
          key={form.key("email")}
          mt="md"
          label="Email"
          placeholder="your@email.com"
        />
        <PasswordInput
          {...form.getInputProps("password")}
          key={form.key("password")}
          mt="md"
          label="Password"
          placeholder="••••••"
        />
        <Button
          type="submit"
          mt="xl"
          mb="md"
          fullWidth
          variant="filled"
          color="gray"
          size="md"
          radius="xl"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
