import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LogPageClient } from "@/components/log/log-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyDiet — Log Harian",
  description: "Catat makanan dan olahraga harian Anda.",
};

/**
 * Log page — server component that fetches today's entries,
 * then passes to client component for interactive logging.
 */
export default async function LogPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch today's data in parallel
  const [foodEntries, exerciseEntries, user] = await Promise.all([
    prisma.foodEntry.findMany({
      where: {
        userId,
        loggedAt: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        foodItem: { select: { name: true, caloriesPer100g: true } },
      },
      orderBy: { loggedAt: "desc" },
    }),
    prisma.exerciseEntry.findMany({
      where: {
        userId,
        loggedAt: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        activity: { select: { name: true, metValue: true } },
      },
      orderBy: { loggedAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        weightKg: true,
        activityLevel: true,
        gender: true,
        age: true,
        heightCm: true,
      },
    }),
  ]);

  const totalCaloriesIn = foodEntries.reduce((sum, e) => sum + e.calories, 0);
  const totalCaloriesBurned = exerciseEntries.reduce(
    (sum, e) => sum + e.caloriesBurned,
    0
  );

  return (
    <LogPageClient
      initialFoodEntries={foodEntries}
      initialExerciseEntries={exerciseEntries}
      totalCaloriesIn={totalCaloriesIn}
      totalCaloriesBurned={totalCaloriesBurned}
      userWeightKg={user?.weightKg ?? 70}
    />
  );
}
