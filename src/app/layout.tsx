import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${site.brand} — стоматология в Ростове-на-Дону`,
  description:
    "Сеть клиник ДенталКеа: имплантация, протезирование, терапия, ортодонтия и детская стоматология. Доступные цены, рассрочка, гарантия.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
