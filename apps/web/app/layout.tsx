import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "../components/session-provider";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "hobby2hobby",
  description: "Trade skills, hobbies, and help locally."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <SiteHeader />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
