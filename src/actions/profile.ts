"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { UpdateProfilePayload } from "@/types";
import type { Gender, ActivityLevel } from "@prisma/client";

/**
 * Server Action: Save user profile data (onboarding step).
 * Validates input, calculates initial weight log, then redirects to dashboard.
 */
export async function saveProfileAction(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Sesi tidak valid. Silakan login ulang." };
  }

  const gender = formData.get("gender") as Gender;
  const ageStr = formData.get("age") as string;
  const heightStr = formData.get("heightCm") as string;
  const weightStr = formData.get("weightKg") as string;
  const activityLevel = formData.get("activityLevel") as ActivityLevel;
  const targetWeightStr = formData.get("targetWeightKg") as string;

  // --- Validation ---
  if (!gender || !ageStr || !heightStr || !weightStr || !activityLevel) {
    return { error: "Semua field wajib diisi." };
  }

  const age = parseInt(ageStr);
  const heightCm = parseFloat(heightStr);
  const weightKg = parseFloat(weightStr);
  const targetWeightKg = targetWeightStr ? parseFloat(targetWeightStr) : null;

  if (isNaN(age) || age < 10 || age > 120) {
    return { error: "Usia tidak valid (10–120 tahun)." };
  }
  if (isNaN(heightCm) || heightCm < 100 || heightCm > 250) {
    return { error: "Tinggi badan tidak valid (100–250 cm)." };
  }
  if (isNaN(weightKg) || weightKg < 20 || weightKg > 300) {
    return { error: "Berat badan tidak valid (20–300 kg)." };
  }

  const validGenders: Gender[] = ["MALE", "FEMALE"];
  const validActivities: ActivityLevel[] = [
    "SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE",
  ];

  if (!validGenders.includes(gender)) {
    return { error: "Pilihan jenis kelamin tidak valid." };
  }
  if (!validActivities.includes(activityLevel)) {
    return { error: "Pilihan tingkat aktivitas tidak valid." };
  }

  try {
    const payload: UpdateProfilePayload = {
      gender,
      age,
      heightCm,
      weightKg,
      activityLevel,
      targetWeightKg: targetWeightKg ?? undefined,
    };

    // Update profile and create initial weight log in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: payload,
      }),
      prisma.weightLog.create({
        data: {
          userId: session.user.id,
          weightKg,
        },
      }),
    ]);
  } catch (error) {
    console.error("[saveProfileAction]", error);
    return { error: "Gagal menyimpan profil. Coba lagi." };
  }

  redirect("/dashboard");
}
