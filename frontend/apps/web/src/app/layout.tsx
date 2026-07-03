import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lattix Workspace",
  description: "Developer workspace for Lattix"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
