import { Source_Serif_4 } from "next/font/google"; // Import fonts
import localFont from "next/font/local";

// UI Font (Sans-serif - Söhne is our standard font)
export const sohne = localFont({
  src: [
    {
      path: "./sohne/TestSohne-Buch.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./sohne/TestSohne-Halbfett.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./sohne/TestSohne-Fett.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./sohne/TestSohne-BuchKursiv.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./sohne/TestSohne-HalbfettKursiv.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./sohne/TestSohne-FettKursiv.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sohne",
  display: "swap",
});

// Article Font (Serif - Source Serif 4 for Medium-style articles)
export const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// GT Super (Niche/Pretty Titles & Special Headings)
export const gtSuper = localFont({
  src: [
    {
      path: "./gt-super/GT-Super-Display-Light-Italic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./gt-super/GT-Super-Display-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./gt-super/GT-Super-Text-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./gt-super/GT-Super-Text-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./gt-super/GT-Super-Text-Book-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./gt-super/GT-Super-Text-Bold-Italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./gt-super/GT-Super-Text-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./gt-super/GT-Super-Text-Medium-Italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-gt-super",
  display: "swap",
});

// Lucida Grande
export const lucidaGrande = localFont({
  src: [
    {
      path: "./lucida-grande/lucide-grande-regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./lucida-grande/lucida-grande-bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lucida-grande",
  display: "swap",
});

// Lucida Unicode
export const lucidaUnicode = localFont({
  src: [
    {
      path: "./lucida-unicode/lucida-unicode-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./lucida-unicode/lucida-unicode-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lucida-unicode",
  display: "swap",
});
