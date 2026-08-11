"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Mail, User, ArrowRight } from "lucide-react";
import { registerAction } from "@/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      id="btn-register"
      className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Membuat akun..." : (
        <>Buat Akun <ArrowRight size={18} /></>
      )}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerAction, null);

  return (
    <main className="min-h-screen bg-bg-app flex flex-col">
      {/* Hero image area */}
      <div style={{ position: "relative", width: "100%", height: "192px", overflow: "hidden", flexShrink: 0, backgroundColor: "#376B00" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/auth-hero.webp"
          alt="Healthy vegetables"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-app via-transparent to-transparent" />
      </div>

      {/* Form container */}
      <div className="flex-1 -mt-8 relative z-10 rounded-t-[20px] bg-bg-app px-6 pt-8 pb-6 flex flex-col max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-1">MyDiet</h1>
          <p className="text-text-muted text-sm">
            Mulai perjalanan hidup sehatmu hari ini.
          </p>
        </div>

        {/* Error message */}
        {state?.error && (
          <div
            id="register-error"
            className="mb-4 p-3 rounded-[12px] bg-danger-bg border border-danger/20 text-danger text-sm"
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-4">
          {/* Nama */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium text-text-secondary">
              Nama Lengkap
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                className="input-field !pl-10"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-text-secondary">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="contoh@email.com"
                required
                autoComplete="email"
                className="input-field !pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-text-secondary">
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Minimal 6 karakter"
              required
              autoComplete="new-password"
            />
          </div>

          {/* Konfirmasi Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-text-secondary">
              Konfirmasi Password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Ulangi password"
              required
              autoComplete="new-password"
            />
          </div>

          {/* ToS note */}
          <p className="text-xs text-text-muted text-center">
            Dengan mendaftar, kamu menyetujui{" "}
            <span className="text-primary">Syarat & Ketentuan</span> dan{" "}
            <span className="text-primary">Kebijakan Privasi</span> kami.
          </p>

          <div className="mt-1">
            <SubmitButton />
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-text-muted mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Masuk
          </Link>
        </p>

        {/* Bottom bar */}
        <div className="mt-auto pt-8 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            © 2026 MyDiet. Digital Nutrition Assistant.
          </p>
        </div>
      </div>
    </main>
  );
}
