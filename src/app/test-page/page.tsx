"use client";

//
// Remove this page later.
// It has been used to test login of a user.
// Pick parts from here and add to login page if needed.
// Outcommented stuff is kept for better backtracking.
//
import { TextField, Button, Alert, Box, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const { data: session } = useSession();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Reset any errors on submit

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login failed", result.error);
    } else {
      console.log("Login successful:", result);
      router.push("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "top",
        marginTop: "150px",
        width: "100vw",
      }}
    >
      <form onSubmit={onSubmit} className="w-full m-8">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Mailadress
            </Typography>
            <TextField
              id="outlined-size-small"
              type="email"
              size="small"
              placeholder="exempel@mail.se"
              value={email}
              onChange={(event) => setEmail(event?.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Lösenord
            </Typography>
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
          </Box>
          {error && <Alert severity="error">{error}</Alert>}{" "}
          {/* Display error message */}
          <Button type="submit" variant="contained" className="w-full mt-2">
            Logga in
          </Button>
          {session && (
            <Button variant="outlined" onClick={() => signOut()}>
              Sign Out
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}
