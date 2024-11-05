import LoginForm from "@/components/LoginForm";
import { Title, Text, Anchor, Container } from "@mantine/core";
import Link from "next/link";

export default function Login() {
  return (
    <Container my="4rem">
      <Title ta="center" mb="xl" size={"2rem"}>
        Welcome back!
      </Title>

      <LoginForm />

      <Text ta="center" mt="md">
        Don&apos;t have an account?{" "}
        <span>
          <Anchor component={Link} href="/signup" fw="bold">
            Create one
          </Anchor>
        </span>
      </Text>
    </Container>
  );
}
