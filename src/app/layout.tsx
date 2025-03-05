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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
