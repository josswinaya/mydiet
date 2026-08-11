import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

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

    const weightLog = await prisma.weightLog.create({
      data: {
        userId: session.user.id,
        weightKg,
        loggedAt: date,
      },
    });

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
