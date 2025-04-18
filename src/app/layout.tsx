import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import {
  gtSuper,
  lucidaGrande,
  lucidaUnicode,
  sohne,
  sourceSerif,
} from "./fonts/fonts";
import "./globals.css";
import { Suspense } from "react";
import PageSpinner from "../components/loading/PageSpinner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UnfoldSpace",
  description: "UnfoldSpace",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sohne.variable} ${sourceSerif.variable} ${gtSuper.variable} ${lucidaGrande.variable} ${lucidaUnicode.variable} antialiased`}
      >
        <Suspense fallback={<PageSpinner />}>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  );
}
