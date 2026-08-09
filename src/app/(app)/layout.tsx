import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/nav/bottom-nav";

export const metadata: Metadata = {
  title: "MyDiet",
};

/**
 * App layout — wraps all authenticated pages.
 * - Validates session server-side (redirect to /login if missing)
 * - Renders bottom navigation bar
 * - Adds bottom padding so content clears the nav bar
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

  return (
    <div className="flex flex-col min-h-screen bg-bg-app">
      {/* Main content — padded so it clears the fixed 64px bottom nav */}
      <div className="flex-1 pb-[72px]">{children}</div>
      <BottomNav />
    </div>
  );
}
