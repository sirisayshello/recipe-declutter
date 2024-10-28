"use client";
import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/navigation";

type UserData = {
  email: string;
  name: string;
  password: string;
};

const SignUpPage = () => {
  const router = useRouter();
  const submitUserData = async (userData: UserData) => {
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
      console.log("User created:", data);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return <SignUpForm onSubmit={submitUserData} />;
};
export default SignUpPage;
