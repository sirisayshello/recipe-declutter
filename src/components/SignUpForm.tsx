"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";

type UserData = {
  email: string;
  name: string;
  password: string;
};

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "", email: "", password: "" },
    validate: {
      name: hasLength({ min: 3 }, "Must be at least 3 characters"),
      email: isEmail("Invalid email"),
      password: hasLength({ min: 8 }, "Must be at least 8 characters"),
    },
  });

  const submitUserData = async (userData: UserData) => {
    setError(null); // Clear any previous error

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      form.reset(); // Reset form only if submission was successful
      router.push("/login"); // Redirect to login
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(submitUserData)}>
      {error && (
        <Alert variant="light" color="red" title="Sign up failed" mb="md">
          {error}
        </Alert>
      )}
      <TextInput
        {...form.getInputProps("name")}
        key={form.key("name")}
        label="Name"
        placeholder="Jane Doe"
      />
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
        size="md"
      >
        Submit
      </Button>
    </form>
  );
}
