import LoginForm from "@/components/LoginForm";
import { Title, Text, Anchor, Container } from "@mantine/core";

export default function Login() {
  return (
    <Container style={{ height: "90dvh", alignContent: "center" }}>
      <Title ta="center" mb="md">
        Log in
      </Title>
      <LoginForm />
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
