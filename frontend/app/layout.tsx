import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoRadar",
  description: "A full-stack app for getting a quick overview of an unfamiliar codebase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
