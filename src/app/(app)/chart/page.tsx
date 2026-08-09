import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChartPageClient } from "@/components/chart/chart-page-client";

export const metadata: Metadata = {
  title: "MyDiet — Grafik Progres",
  description: "Pantau tren berat badan dan kalori harian Anda.",
};

export default async function ChartPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // 1. Fetch current user to get their current weight
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { weightKg: true },
  });
  
  const currentWeight = user?.weightKg ?? 0;

  // 2. Fetch weight logs (last 30 entries for chart)
  const weightLogs = await prisma.weightLog.findMany({
    where: { userId },
    orderBy: { loggedAt: "asc" },
    take: 30, // Limit to last 30 entries so chart doesn't get too crowded
  });

  // 3. Prepare dates for last 7 days calorie history
  const today = new Date();
  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse(); // From oldest to newest (today)

  const sevenDaysAgo = past7Days[0];

  // Fetch food and exercise for the last 7 days
  const [foodEntries, exerciseEntries] = await Promise.all([
    prisma.foodEntry.findMany({
      where: { userId, loggedAt: { gte: sevenDaysAgo } },
      select: { calories: true, loggedAt: true },
    }),
    prisma.exerciseEntry.findMany({
      where: { userId, loggedAt: { gte: sevenDaysAgo } },
      select: { caloriesBurned: true, loggedAt: true },
    }),
  ]);

  // Group by date string (e.g. "08 Aug")
  const calorieHistory = past7Days.map((date) => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const dayFoods = foodEntries.filter(
      (e) => e.loggedAt >= date && e.loggedAt < nextDate
    );
    const dayExercises = exerciseEntries.filter(
      (e) => e.loggedAt >= date && e.loggedAt < nextDate
    );

    const totalIn = dayFoods.reduce((sum, e) => sum + e.calories, 0);
    const totalOut = dayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);

    return {
      date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      in: totalIn,
      out: totalOut,
    };
  });

  return (
    <ChartPageClient 
      weightLogs={weightLogs} 
      calorieHistory={calorieHistory} 
      currentWeight={currentWeight}
    />
  );
}
