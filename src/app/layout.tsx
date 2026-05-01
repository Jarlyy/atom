import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atom Visualizer",
  description: "Interactive 3D atom and electron shell visualizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
