import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIORTA",
  description: "AI clinical research platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
