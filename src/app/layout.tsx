import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "MyDiet — Kalori Tracker & Prediksi Berat Badan",
  description:
    "Catat kalori masuk dan keluar harian, pantau progres berat badan, dan dapatkan prediksi AI untuk mencapai target kesehatanmu.",
  keywords: ["diet", "kalori", "tracking", "berat badan", "prediksi AI", "kesehatan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-bg-app antialiased">
        {children}
      </body>
    </html>
  );
}
