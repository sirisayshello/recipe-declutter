"use client";
import SignUpForm from "@/components/SignUpForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Container, Title, Text } from "@mantine/core";

type UserData = {
  email: string;
  name: string;
  password: string;
};

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const submitUserData = async (userData: UserData) => {
    setError(null); // Clear any previous error
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      router.push("/login");
    } catch (error: any) {
      //FIX ANY TYPE
      setError(error.message);
    }
  };

  return (
    <>
      <Container style={{ height: "90dvh", alignContent: "center" }}>
        <Title ta="center" mb="md">
          Create account
        </Title>
        <SignUpForm onSubmit={submitUserData} error={error} />
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
