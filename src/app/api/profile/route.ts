import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, UpdateProfilePayload } from "@/types";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: UpdateProfilePayload = await req.json();

    // Pastikan tidak ada payload berbahaya atau ID yang di-bypass
    const allowedFields = [
      "name",
      "age",
      "heightCm",
      "weightKg",
      "gender",
      "activityLevel",
      "targetWeightKg",
    ];

    const dataToUpdate: any = {};
    for (const key of allowedFields) {
      if (key in body && body[key as keyof UpdateProfilePayload] !== undefined) {
        dataToUpdate[key] = body[key as keyof UpdateProfilePayload];
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });

    // Jangan kembalikan passwordHash
    const { passwordHash, ...safeUser } = updatedUser;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: safeUser,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal menyimpan perubahan profil." },
      { status: 500 }
    );
  }
}
