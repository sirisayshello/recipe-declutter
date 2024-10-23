"use client";

import { SessionProvider } from "next-auth/react";
//import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { StyledRoot } from "./StyledRoot";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import Navbar from "@/components/Navbar";

// metadata can not be used in this way here
// export const metadata: Metadata = {
//   title: "Recipe Declutter",
//   description: "Declutter your favorite recipes here!",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <MantineProvider>
            <AppRouterCacheProvider>
              <StyledRoot>
                <Navbar />
                {children}
              </StyledRoot>
            </AppRouterCacheProvider>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
