import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { StyledRoot } from "./StyledRoot";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
        <MantineProvider>
          <AppRouterCacheProvider>
            <StyledRoot>
              <Navbar />
              {children}
            </StyledRoot>
          </AppRouterCacheProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
