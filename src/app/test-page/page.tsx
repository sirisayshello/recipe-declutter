"use client";

//
// Remove this page later.
// It has been used to test login of a user.
// Pick parts from here and add to login page if needed.
// Outcommented stuff is kept for better backtracking.
//

import { Button, TextField } from "@mui/material";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { test } from "@/lib/actions";

export default function TestPage() {
  // const router = useRouter();

  // const session = await getServerSession(authOptions);
  // console.log(session);

  // const session = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (/* data: LoginForm */ e: any) => {
    e.preventDefault();

    // console.log(session);

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result?.error) {
      console.error("Login failed", result.error);
    } else {
      // router.push("/");
      console.log("Login successful:", result);

      const test2 = await test();

      console.log("client side log:", { test2 });
    }
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <div>
        <button style={{ marginRight: 10 }} onClick={() => signOut()}>
          Sign Out
        </button>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col items-center gap-4">
            <div className="my-1 flex flex-col w-full">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Mailadress
              </label>{" "}
              <TextField
                className="w-full"
                id="outlined-size-small"
                type="email"
                size="small"
                placeholder="exempel@mail.se"
                value={email}
                onChange={(event) => setEmail(event?.target.value)}
              />
            </div>

            <div className="my-1 flex flex-col w-full">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Lösenord
              </label>{" "}
              <TextField
                className="w-full"
                id="outlined-size-small"
                type="password"
                size="small"
                placeholder="•••••••••"
                name=""
                value={password}
                onChange={(event) => setPassword(event?.target.value)}
              />
            </div>

            <Button type="submit" variant="contained" className="w-full mt-2">
              Logga in
            </Button>
            <p>
              Har du inget konto?{" "}
              <a href="/register" className="underline underline-offset-3">
                Skapa konto
              </a>
            </p>
          </div>
        </form>

        <h1>Server Session</h1>
        {/* <pre>{JSON.stringify(session)}</pre> */}
      </div>
    </main>
  );
}
