import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateTDEE, projectWeightChange } from "@/lib/calories";
import { GoogleGenAI } from "@google/genai";
import type { ApiResponse } from "@/types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const projectedWeeks = body.projectedWeeks ? parseInt(body.projectedWeeks) : 4;

    if (projectedWeeks <= 0 || projectedWeeks > 12) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Pilih durasi prediksi antara 1-12 minggu." },
        { status: 400 }
      );
    }

    // 1. Ambil data user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.gender || !user.age || !user.heightCm || !user.weightKg || !user.activityLevel) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Mohon lengkapi profil Anda (Umur, Tinggi, Berat, dsb) di halaman Setup Profil terlebih dahulu." },
        { status: 400 }
      );
    }

    // 2. Hitung TDEE
    const { tdee } = calculateTDEE({
      gender: user.gender,
      age: user.age,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
      activityLevel: user.activityLevel,
    });

    // 3. Ambil data log kalori 7 hari terakhir
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

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

    // 4. Hitung Rata-rata Balance Kalori Harian
    const totalDays = 7;
    let totalCaloriesIn = 0;
    let totalCaloriesBurned = 0;

    foodEntries.forEach((entry) => (totalCaloriesIn += entry.calories));
    exerciseEntries.forEach((entry) => (totalCaloriesBurned += entry.caloriesBurned));

    const avgCaloriesIn = totalCaloriesIn / totalDays;
    const avgCaloriesBurned = totalCaloriesBurned / totalDays;

    // Balance = (Input) - (TDEE + Olahraga)
    const avgDailyBalance = avgCaloriesIn - (tdee + avgCaloriesBurned);
    
    // 5. Kalkulasi Proyeksi Berat Badan
    const projectedDeltaKg = projectWeightChange(avgDailyBalance, projectedWeeks);
    const predictedWeight = parseFloat((user.weightKg + projectedDeltaKg).toFixed(1));

    // 6. Generate AI Insight dengan Gemini
    const prompt = `
Sebagai ahli gizi dan pelatih kebugaran yang empatik (bernama MyDiet AI), berikan ulasan singkat (maksimal 3 paragraf) untuk progres diet berikut:
- Nama: ${user.name || "Pengguna"}
- Target Berat: ${user.targetWeightKg ? user.targetWeightKg + " kg" : "Belum ditentukan"}
- Berat Saat Ini: ${user.weightKg} kg
- Rata-rata Kalori Masuk (7 hari terakhir): ${Math.round(avgCaloriesIn)} kcal/hari
- TDEE (Kebutuhan Kalori Harian): ${tdee} kcal/hari
- Rata-rata Kalori Terbakar dari Olahraga: ${Math.round(avgCaloriesBurned)} kcal/hari
- Proyeksi: Berdasarkan kebiasaan 7 hari terakhir, dalam ${projectedWeeks} minggu ke depan berat badan diprediksi akan menjadi ${predictedWeight} kg (perubahan ${projectedDeltaKg > 0 ? '+' : ''}${projectedDeltaKg} kg).

Instruksi:
1. Gunakan bahasa Indonesia yang santai, memotivasi, ramah dan tidak kaku.
2. Jangan mengulang data mentah seperti mesin, tapi rangkum intinya (apakah surplus/defisit kalori, apakah sehat).
3. Jika prediksi menjauh dari target (misal ingin turun tapi diprediksi naik), berikan saran perbaikan (misal kurangi porsi atau tambah kardio). Jika mendekati target, berikan pujian.
4. Gunakan sapaan akrab. Boleh pakai emoji.
`;

    let aiInsight = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      aiInsight = response.text || "Tidak ada saran AI saat ini.";
    } catch (aiError) {
      console.error("Gemini API Error:", aiError);
      aiInsight = "Maaf, prediksi AI sedang tidak dapat diakses saat ini, namun kalkulasi matematis tetap berjalan.";
    }

    // 7. Simpan Prediksi ke Database
    const prediction = await prisma.prediction.create({
      data: {
        userId,
        avgDailyBalance,
        projectedWeeks,
        projectedDeltaKg,
        aiInsight,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: prediction,
    });
  } catch (error: any) {
    console.error("Error generating prediction:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
