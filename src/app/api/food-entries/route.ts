import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCaloriesBurned } from "@/lib/calories";
import type { ApiResponse } from "@/types";

/** GET /api/food-entries?date=2026-08-08 — get food entries for a specific date */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    let startDate: Date;
    let endDate: Date;

    if (dateStr) {
      startDate = new Date(dateStr);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(dateStr);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Default: today
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    const entries = await prisma.foodEntry.findMany({
      where: {
        userId: session.user.id,
        loggedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        foodItem: {
          select: {
            id: true,
            name: true,
            caloriesPer100g: true,
            proteinPer100g: true,
            carbsPer100g: true,
            fatPer100g: true,
          },
        },
      },
      orderBy: { loggedAt: "desc" },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: entries });
  } catch (error) {
    console.error("[GET /api/food-entries]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal mengambil data log makanan." },
      { status: 500 }
    );
  }
}

/** POST /api/food-entries — log a food entry */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { foodItemId, amountGrams, mealType } = body;

    if (!foodItemId || !amountGrams) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "foodItemId dan amountGrams wajib diisi." },
        { status: 400 }
      );
    }

    const amount = parseFloat(amountGrams);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Jumlah porsi tidak valid." },
        { status: 400 }
      );
    }

    // Validate food item exists
    const foodItem = await prisma.foodItem.findUnique({
      where: { id: foodItemId },
    });

    if (!foodItem) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Makanan tidak ditemukan." },
        { status: 404 }
      );
    }

    // Calculate actual calories for this portion
    // calories per 100g → scale to actual amount
    const calories = Math.round((foodItem.caloriesPer100g * amount) / 100);

    const entry = await prisma.foodEntry.create({
      data: {
        userId: session.user.id,
        foodItemId,
        amountGrams: amount,
        calories,
        mealType: mealType ?? "SNACK",
      },
      include: {
        foodItem: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: entry },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/food-entries]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal menyimpan log makanan." },
      { status: 500 }
    );
  }
}

/** DELETE /api/food-entries?id=xxx — delete a food entry */
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "ID entry diperlukan." },
        { status: 400 }
      );
    }

    // Ensure user owns this entry
    const entry = await prisma.foodEntry.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!entry) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Entry tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.foodEntry.delete({ where: { id } });

    return NextResponse.json<ApiResponse>({ success: true, data: null });
  } catch (error) {
    console.error("[DELETE /api/food-entries]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal menghapus log makanan." },
      { status: 500 }
    );
  }
}
