import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

/**
 * POST /api/auth/register
 * Registers a new user with email and password.
 * Password is hashed with bcrypt before storing.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // --- Validation ---
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // --- Check duplicate email ---
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    // --- Hash password ---
    const passwordHash = await bcrypt.hash(password, 12);

    // --- Create user ---
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Terjadi kesalahan server. Coba lagi." },
      { status: 500 }
    );
  }
}
