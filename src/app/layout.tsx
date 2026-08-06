import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col bg-bg-app antialiased">
        {children}
      </body>
    </html>
  );
}
