import { createTheme } from "@mantine/core";
import { Poppins, Galada, Karla } from "next/font/google";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


const galada = Galada({ subsets: ["latin"], weight: ["400"] });

const karla = Karla({
  subsets: ["latin"],
});

export const theme = createTheme({
  colors: {
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
    cream: [
      "#fbf6ef",
      "#f2ebdf",
      "#e6d4b9",
      "#dabd8f",
      "#cfa86c",
      "#c99c55",
      "#c79549",
      "#af813a",
      "#9c7232",
      "#886226",
    ],
    yellow: [
      "#fff9e0",
      "#fff0cc",
      "#fce09c",
      "#facf68",
      "#f8c13c",
      "#f7b820",
      "#f7b30c",
      "#dc9d00",
      "#c48b00",
      "#aa7700",
    ],
  },
  primaryColor: "dustyRed",
  primaryShade: 7,
  defaultRadius: "xl",

  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },

  headings: {
    fontFamily: `${poppins.style.fontFamily}, sans-serif`,
    sizes: {
      h1: {
        fontSize: "48px",
      },
      h2: { fontSize: "24px" },
    },
  },

  // all text except headings:
  fontFamily: `${karla.style.fontFamily}, sans-serif`,

  other: {
    fontFamily: `${galada.style.fontFamily}, sans-serif`,
    fontSizes: {
      base: "18px",
      xs: "24px",
    },
  },

  components: {
    Input: {
      defaultProps: {
        size: "md",
      },
    },
    TextInput: {
      defaultProps: {
        size: "md",
      },
    },
    PasswordInput: {
      defaultProps: {
        size: "md",
      },
    },
    MultiSelect: {
      defaultProps: {
        size: "md",
      },
    },
    TagsInput: {
      defaultProps: {
        size: "md",
      },
    },
    Textarea: {
      defaultProps: {
        size: "md",
      },
    },
    Button: {
      defaultProps: {
        size: "md",
      },
    },
  },
});
