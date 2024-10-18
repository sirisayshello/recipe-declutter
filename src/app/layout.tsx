import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import Navbar from "@/components/Navbar";
import { StyledRoot } from "./StyledRoot";
import type { Metadata } from "next";
import "./globals.css";

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
        <AppRouterCacheProvider>
          {" "}
          <StyledRoot>
            <Navbar />
            {children}
          </StyledRoot>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
