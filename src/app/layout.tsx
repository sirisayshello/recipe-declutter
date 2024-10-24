import { Navbar } from "../components/Header/Navbar";
import { Container, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import "./globals.css";
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
        <MantineProvider theme={theme}>
          <Navbar />
          <Container>{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
