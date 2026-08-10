import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PredictPageClient } from "@/components/predict/predict-page-client";
import type { PredictionResult } from "@/types";

export const metadata: Metadata = {
  title: "MyDiet — Prediksi AI",
  description: "Prediksi perubahan berat badan dengan kecerdasan buatan.",
};

export default async function PredictPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { weightKg: true, targetWeightKg: true },
  });

  const lastPredictionRecord = await prisma.prediction.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Convert Date to string for client component props
  const lastPrediction: PredictionResult | null = lastPredictionRecord
    ? {
        id: lastPredictionRecord.id,
        avgDailyBalance: lastPredictionRecord.avgDailyBalance,
        projectedWeeks: lastPredictionRecord.projectedWeeks,
        projectedDeltaKg: lastPredictionRecord.projectedDeltaKg,
        aiInsight: lastPredictionRecord.aiInsight,
        createdAt: lastPredictionRecord.createdAt.toISOString(),
      }
    : null;

  return (
    <PredictPageClient
      currentWeight={user?.weightKg ?? null}
      targetWeight={user?.targetWeightKg ?? null}
      lastPrediction={lastPrediction}
    />
  );
}
