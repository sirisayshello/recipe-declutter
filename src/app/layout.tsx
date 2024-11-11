import { Navbar } from "../components/Header/Navbar";
import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { theme } from "./theme";
import SessionWrapper from "@/components/SessionWrapper";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

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
      <head>
        <ColorSchemeScript
          nonce="8IBTHwOdqNKAWeKl7plt8g=="
          defaultColorScheme="auto"
        />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <Notifications position="bottom-center" />
          <SessionWrapper>
            <Navbar />
          </SessionWrapper>
          <Container>{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
