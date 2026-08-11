import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/** GET /api/activities?q=lari — search MET activities */
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

    const activities = await prisma.metActivity.findMany({
      where: q
        ? { name: { contains: q, mode: "insensitive" } }
        : undefined,
      select: {
        id: true,
        name: true,
        metValue: true,
        category: true,
      },
      orderBy: { name: "asc" },
      take: 20,
    });

    return NextResponse.json<ApiResponse>({ success: true, data: activities });
  } catch (error) {
    console.error("[GET /api/activities]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal mengambil data aktivitas." },
      { status: 500 }
    );
  }
}
