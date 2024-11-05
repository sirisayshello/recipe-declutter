import SignUpForm from "@/components/SignUpForm";
import { Anchor, Container, Title, Text } from "@mantine/core";
import Link from "next/link";

export default function SignUp() {
  return (
    <>
      <Container my="4rem">
        <Title ta="center" mb="xl" size={"2rem"}>
          Welcome to Recipe Declutter!
        </Title>
        <SignUpForm />
        <Text ta="center" mt="md">
          Already have an account?{" "}
          <span>
            <Anchor component={Link} href="/login" fw="bold">
              Log in
            </Anchor>
          </span>
        </Text>
      </Container>
    </>
  );
}
