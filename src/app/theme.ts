import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  colors: {
    // Add your color
    dustyRed: [
      "#ffeeed",
      "#f5dedc",
      "#e3bbb8",
      "#d29590",
      "#c4766f",
      "#bc615a",
      "#b9574f",
      "#a34740",
      "#923e38",
      "#81322d",
    ],
  },
  primaryColor: "dustyRed",
  primaryShade: 7,

  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },

  headings: {
    fontFamily: "Roboto, sans-serif",
    sizes: {
      h1: { fontSize: rem(48) },
      h2: { fontSize: rem(24) },
      h3: { fontSize: rem(18) },
    },
  },
});
