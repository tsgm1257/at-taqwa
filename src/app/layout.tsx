import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/app/providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "At-Taqwa Foundation",
  description: "Youth-led Islamic charity for our village",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-emerald-950 text-emerald-950 dark:text-emerald-50">
        <Providers>
          <Navbar />

          {children}
        </Providers>
      </body>
    </html>
  );
}
