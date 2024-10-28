"use client";
import LoginForm from "@/components/LoginForm";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Title, Text, Anchor, Container } from "@mantine/core";

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
    } else {
      router.push("/welcome");
    }
  };

  return (
    <Container style={{ height: "90dvh", alignContent: "center" }}>
      <Title ta="center" mb="md">
        Log in
      </Title>
      <LoginForm onSubmit={onSubmit} error={error} />
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
