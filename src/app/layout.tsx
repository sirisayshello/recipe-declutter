import { Navbar } from "../components/Header/Navbar";
import { Container, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { theme } from "./theme";

export const metadata: Metadata = {
  title: "Recipe Declutter",
  description: "Declutter your favorite recipes here!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <Navbar />
          <Container>{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
