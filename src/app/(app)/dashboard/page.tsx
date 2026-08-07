import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Dashboard placeholder — will be fully implemented on day 6.
 * For now, just shows a welcome message to verify auth flow works.
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-bg-app flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-primary mb-2">
          👋 Halo, {session.user.name ?? session.user.email}!
        </h1>
        <p className="text-text-secondary">
          Dashboard sedang dalam pengembangan. Fitur akan segera hadir.
        </p>
      </div>
    </main>
  );
}
