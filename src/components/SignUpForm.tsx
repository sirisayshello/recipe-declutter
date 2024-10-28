"use client";
import {
  Anchor,
  Button,
  Container,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";

type SignUpFormProps = {
  onSubmit: (userData: {
    email: string;
    name: string;
    password: string;
  }) => void;
};
export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "", email: "", password: "" },
    validate: {
      // These do not seem to work
      name: hasLength({ min: 3 }, "Must be at least 3 characters"),
      email: isEmail("Invalid email"),
      password: hasLength({ min: 3 }, "Must be at least 3 characters"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Container style={{ height: "90dvh", alignContent: "center" }}>
      <Title ta="center" mb="md">
        Create account
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
      <Text ta="center">
        Already have an account?{" "}
        <span>
          <Anchor href="/login" underline="never">
            Log in
          </Anchor>
        </span>
      </Text>
    </Container>
  );
}
