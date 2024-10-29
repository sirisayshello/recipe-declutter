import SignUpForm from "@/components/SignUpForm";
import { Anchor, Container, Title, Text } from "@mantine/core";

export default function SignUp() {
  return (
    <>
      <Container style={{ height: "90dvh", alignContent: "center" }}>
        <Title ta="center" mb="md">
          Create account
        </Title>
        <SignUpForm />
        <Text ta="center">
          Already have an account?{" "}
          <span>
            <Anchor href="/login" underline="never">
              Log in
            </Anchor>
          </span>
        </Text>
      </Container>
    </>
  );
}

