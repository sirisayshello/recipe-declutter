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

export default function Signup() {
  const handleSubmit = () => {
    console.log("sign up");
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
      <Typography variant="h1">Create account</Typography>
      <FormControl>
        <FormLabel htmlFor="name">First and last name</FormLabel>
        <TextField
          // error={nameError}
          // helperText={nameErrorMessage}
          id="name"
          type="text"
          name="name"
          placeholder="Jane Doe"
          autoFocus
          required
        />
      </FormControl>
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
        Already have an account?{" "}
        <span>
          <Link href="/signin" variant="body2" sx={{ alignSelf: "center" }}>
            Sign in
          </Link>
        </span>
      </Typography>
    </Box>
  );
}
