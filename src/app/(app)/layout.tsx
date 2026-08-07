import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MyDiet — Dashboard",
};

/**
 * App layout — wraps all authenticated app pages (dashboard, log, grafik, prediksi).
 * Redirects to login if session is missing.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return <>{children}</>;
}
