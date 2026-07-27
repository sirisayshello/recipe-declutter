import { Navbar } from "../components/Navbar";
import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { theme } from "./theme";
import Favicon from "./favicon.svg";
import SessionWrapper from "@/components/SessionWrapper";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { ModalsProvider } from "@mantine/modals";
import "./index.css";

export const metadata: Metadata = {
  title: "Savorly",
  description: "Declutter and save your favorite recipes here!",
  icons: [{ rel: "icon", url: Favicon.src }],
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
      <body style={{ height: "100dvh" }}>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <ModalsProvider>
            <Notifications position="bottom-center" />
            <SessionWrapper>
              <Navbar />
            </SessionWrapper>
            {/* 56px current height of navbar. Update if it changes */}
            <Container
              h={{ base: "calc(100dvh - 56px)", xs: "calc(100dvh - 64px)" }}
            >
              {children}
            </Container>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
