import SessionProvider from "@/components/SessionProvider";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { StyledRoot } from "./StyledRoot";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Recipe Declutter",
  description: "Declutter your favorite recipes here!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
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
