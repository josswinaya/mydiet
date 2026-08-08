import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCaloriesBurned } from "@/lib/calories";
import type { ApiResponse } from "@/types";

/** GET /api/exercise-entries?date=2026-08-08 — get exercise entries for a specific date */
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
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    const entries = await prisma.exerciseEntry.findMany({
      where: {
        userId: session.user.id,
        loggedAt: { gte: startDate, lte: endDate },
      },
      include: {
        activity: {
          select: { id: true, name: true, metValue: true },
        },
      },
      orderBy: { loggedAt: "desc" },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: entries });
  } catch (error) {
    console.error("[GET /api/exercise-entries]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal mengambil data log olahraga." },
      { status: 500 }
    );
  }
}

/** POST /api/exercise-entries — log an exercise entry */
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
    const { activityId, durationMinutes } = body;

    if (!activityId || !durationMinutes) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "activityId dan durationMinutes wajib diisi." },
        { status: 400 }
      );
    }

    const duration = parseInt(durationMinutes);
    if (isNaN(duration) || duration <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Durasi tidak valid." },
        { status: 400 }
      );
    }

    // Get activity MET value and user weight for calorie calculation
    const [activity, user] = await Promise.all([
      prisma.metActivity.findUnique({ where: { id: activityId } }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { weightKg: true },
      }),
    ]);

    if (!activity) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivitas tidak ditemukan." },
        { status: 404 }
      );
    }

    // Default weight 70kg if user hasn't set profile yet
    const weightKg = user?.weightKg ?? 70;
    const caloriesBurned = calculateCaloriesBurned(
      activity.metValue,
      weightKg,
      duration
    );

    const entry = await prisma.exerciseEntry.create({
      data: {
        userId: session.user.id,
        activityId,
        durationMinutes: duration,
        caloriesBurned,
      },
      include: {
        activity: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: entry },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/exercise-entries]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal menyimpan log olahraga." },
      { status: 500 }
    );
  }
}

/** DELETE /api/exercise-entries?id=xxx — delete an exercise entry */
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

    const entry = await prisma.exerciseEntry.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!entry) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Entry tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.exerciseEntry.delete({ where: { id } });

    return NextResponse.json<ApiResponse>({ success: true, data: null });
  } catch (error) {
    console.error("[DELETE /api/exercise-entries]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal menghapus log olahraga." },
      { status: 500 }
    );
  }
}
