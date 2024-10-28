"use client";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";

type SignUpFormProps = {
  onSubmit: (userData: {
    email: string;
    name: string;
    password: string;
  }) => void;
  error: string | null;
};

export default function SignUpForm({ onSubmit, error }: SignUpFormProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "", email: "", password: "" },
    validate: {
      name: hasLength({ min: 3 }, "Must be at least 3 characters"),
      email: isEmail("Invalid email"),
      password: hasLength({ min: 8 }, "Must be at least 8 characters"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
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
        color="gray"
        size="md"
        radius="xl"
      >
        Submit
      </Button>
    </form>
  );
}
