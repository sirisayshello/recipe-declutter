"use client";

import {
  Title,
  Text,
  TextInput,
  Anchor,
  Button,
  Container,
  Alert,
} from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (values: { email: string; password: string }) => {
    setError(""); // Reset any errors on submit

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login failed", result.error);
    } else {
      console.log("Login successful:", result);
      router.push("/welcome");
    }
    form.reset();
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      // This does not seem to work
      email: isEmail("Invalid email"),
    },
  });

  return (
    <Container style={{ height: "90dvh", alignContent: "center" }}>
      <Title ta="center" mb="md">
        Log in
      </Title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          {...form.getInputProps("email")}
          key={form.key("email")}
          mt="md"
          label="Email"
          placeholder="your@email.com"
        />
        <TextInput
          {...form.getInputProps("password")}
          key={form.key("password")}
          mt="md"
          label="Password"
          placeholder="••••••"
        />
        {error && (
          <Alert variant="light" color="red">
            {error}
          </Alert>
        )}
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
      <Text ta="center">
        Don&apos;t have an account?{" "}
        <span>
          <Anchor href="/signup" underline="never">
            Create account
          </Anchor>
        </span>
      </Text>
    </Container>
  );
}
