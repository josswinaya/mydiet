"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

/**
 * Server Action: Login user with email + password via NextAuth credentials provider.
 * Returns error string on failure, redirects on success (handled by NextAuth).
 */
export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah." };
        default:
          return { error: "Terjadi kesalahan. Coba lagi." };
      }
    }
    // Re-throw redirect errors so Next.js can handle them
    throw error;
  }
}

/**
 * Server Action: Register new user then auto-login.
 */
export async function registerAction(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Client-side duplicate validation on server as well
  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Registrasi gagal." };
    }

    // Auto-login after successful registration
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/profile/setup",
    });

    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Akun dibuat tapi login gagal. Silakan login manual." };
    }
    throw error;
  }
}
