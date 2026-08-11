import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/** GET /api/food-items?q=nasi — search food items from database */
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
    const q = searchParams.get("q")?.trim() ?? "";

    const items = await prisma.foodItem.findMany({
      where: q
        ? {
            name: {
              contains: q,
              mode: "insensitive",
            },
          }
        : undefined,
      select: {
        id: true,
        name: true,
        caloriesPer100g: true,
        proteinPer100g: true,
        carbsPer100g: true,
        fatPer100g: true,
        servingSize: true,
        servingUnit: true,
      },
      orderBy: { name: "asc" },
      take: 20,
    });

    return NextResponse.json<ApiResponse>({ success: true, data: items });
  } catch (error) {
    console.error("[GET /api/food-items]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal mengambil data makanan." },
      { status: 500 }
    );
  }
}
