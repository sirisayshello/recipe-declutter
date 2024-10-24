import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import WelcomePage from "./page";

export default async function WelcomeLayout() {
  const session = await getServerSession();

  console.log({ session });

  return (
    <>
      {/* "hero"  section: */}
      <Box component="section">
        <Typography variant="h1">Welcome to Recipe Declutter!</Typography>
        <Typography variant="body1">
          Paste, click, and get the essentials—your ingredients and instructions
          at your fingertips.
        </Typography>
      </Box>

      <WelcomePage session={session} />
    </>
  );
}
