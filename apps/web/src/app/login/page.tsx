import LoginForm from "@/components/LoginForm";
import { Title, Text, Anchor, Box } from "@mantine/core";
import Link from "next/link";

export default function Login() {
  return (
    <Box py="2rem">
      <Title ta="center" mb="xl" fz={"h2"}>
        Welcome back!
      </Title>

      <LoginForm />

      <Text ta="center" mt="md">
        Don&apos;t have an account?{" "}
        <span>
          <Anchor component={Link} href="/signup" fw="bold">
            Create one here
          </Anchor>
        </span>
      </Text>
    </Box>
  );
}
