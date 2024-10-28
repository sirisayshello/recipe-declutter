"use client";
import { TextInput, Button, Alert, PasswordInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";

type LoginFormProps = {
  onSubmit: (values: { email: string; password: string }) => void;
  error: string | null;
};

export default function LoginForm({ onSubmit, error }: LoginFormProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      email: isEmail("Invalid email"),
    },
  });

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
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
