import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./css/globals.css";
import { ThemeProvider } from "next-themes";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameLink",
  description: "Link your gaming accounts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <Providers>
        {children}
      </Providers>
      </body>
    </html>
  );
}
