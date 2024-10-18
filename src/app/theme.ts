"use client";
import { Poppins } from "next/font/google";
import { deepPurple, blue } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  // Edit here when you want to change the theme colors
  /*
  palette: {
    primary: deepPurple,
    secondary: blue,
  },*/
  typography: {
    fontFamily: poppins.style.fontFamily,

    h1: {
      fontSize: "2rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: "none", // Remove shadow for contained buttons
          "&:hover": {
            boxShadow: "none", // Remove hover shadow for contained buttons
          },
        },
        outlined: {
          boxShadow: "none", // Remove shadow for outlined buttons
          "&:hover": {
            boxShadow: "none", // Remove hover shadow for outlined buttons
          },
        },
        text: {
          boxShadow: "none", // Remove shadow for text buttons
          "&:hover": {
            boxShadow: "none", // Remove hover shadow for text buttons
          },
        },
      },
    },
  },
});

export default theme;
