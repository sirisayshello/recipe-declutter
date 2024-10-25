"use client";

import {
  Title,
  Text,
  TextInput,
  Anchor,
  Button,
  Container,
} from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";
import React, { useState } from "react";

export default function Login() {
  const [submittedValues, setSubmittedValues] = useState<
    typeof form.values | null
  >(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      // This does not seem to work
      email: isEmail("Invalid email"),
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    form.onSubmit(setSubmittedValues);
    console.log({ submittedValues: submittedValues });

    const inputValues = form.getValues();
    console.log({ input: inputValues });
    form.reset();
  };

  return (
    <Container style={{ height: "90dvh", alignContent: "center" }}>
      <Title ta="center" mb="md">
        Log in
      </Title>
      <form onSubmit={handleSubmit}>
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
