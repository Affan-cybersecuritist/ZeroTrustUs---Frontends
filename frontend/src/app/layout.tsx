import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroTrustUs | Compliance Intelligence",
  description: "Agentic Regulatory Intelligence & Compliance Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-obsidian text-white">{children}</body>
    </html>
  );
}
