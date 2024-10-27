"use client";
import SignUpForm from "@/components/SignUpForm";

type UserData = {
  email: string;
  name: string;
  password: string;
};

const SignUpPage = () => {
  const submitUserData = async (userData: UserData) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log("User created:", data);
    } catch (error) {
      console.error(error);
    }
  };

  return <SignUpForm onSubmit={submitUserData} />;
};
export default SignUpPage;
