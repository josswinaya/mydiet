import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

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
    <html lang="id" className={`h-full ${poppins.variable}`}>
      <body className="min-h-full flex flex-col bg-bg-app antialiased font-sans">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "Poppins, sans-serif",
              borderRadius: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}
