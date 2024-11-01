import SignUpForm from "@/components/SignUpForm";
import { Anchor, Container, Title, Text } from "@mantine/core";
import Link from "next/link";

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
            <Anchor component={Link} href="/login" underline="never">
              Log in
            </Anchor>
          </span>
        </Text>
      </Container>
    </>
  );
}
