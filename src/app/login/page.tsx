"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

export default function Login() {
  // const [emailError, setEmailError] = React.useState(false);
  // const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  // const [passwordError, setPasswordError] = React.useState(false);
  // const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h1">Log in</Typography>
      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          // error={emailError}
          // helperText={emailErrorMessage}
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          autoFocus
          required
        />
      </FormControl>
      <FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Link
            
            type="button"
            // onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: "baseline" }}
          >
            Forgot your password?
          </Link>
        </Box>
        <TextField
          // error={passwordError}
          // helperText={passwordErrorMessage}
          name="password"
          placeholder="••••••"
          type="password"
          id="password"
          autoComplete="current-password"
          autoFocus
          required
          fullWidth
          variant="outlined"
          // color={passwordError ? "error" : "primary"}
        />
      </FormControl>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        // onClick={validateInputs}
      >
        Sign in
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <span>
          <Link href="/signup" variant="body2" sx={{ alignSelf: "center" }}>
            Create account
          </Link>
        </span>
      </Typography>
    </Box>
  );
}
