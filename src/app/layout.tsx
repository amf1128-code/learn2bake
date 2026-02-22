import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "learn2bake — Learn to Bake from Scratch",
  description:
    "A guided baking curriculum that teaches you the principles of dough and baking, one concept at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
