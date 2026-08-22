import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "@/src/styles/app.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={`${geist.variable} ${geistMono.variable}`} lang="en">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
