import SignUpForm from "@/components/SignUpForm";
import { Anchor, Title, Text, Box } from "@mantine/core";
import Link from "next/link";

export default function SignUp() {
  return (
    <>
      <Box py="2rem">
        <Title ta="center" mb="xl" fz={"h2"}>
          Welcome to Savorly!
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
      </Box>
    </>
  );
}
