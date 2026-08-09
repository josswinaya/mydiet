import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { weightKg, loggedAt } = await req.json();

    if (!weightKg || typeof weightKg !== "number" || weightKg <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Berat badan tidak valid." },
        { status: 400 }
      );
    }

    const date = loggedAt ? new Date(loggedAt) : new Date();

    // Use a transaction:
    // 1. Create the weight log entry.
    // 2. Update the user's current weight so TDEE uses the newest weight.
    const [weightLog] = await prisma.$transaction([
      prisma.weightLog.create({
        data: {
          userId: session.user.id,
          weightKg,
          loggedAt: date,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { weightKg },
      }),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: weightLog,
    });
  } catch (error: any) {
    console.error("Error creating weight log:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal mencatat berat badan." },
      { status: 500 }
    );
  }
}
