"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { loginAction } from "@/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      id="btn-login"
      className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Masuk..." : (
        <>Masuk <ArrowRight size={18} /></>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen bg-bg-app flex flex-col">
      {/* Hero image area */}
      <div style={{ position: "relative", width: "100%", height: "224px", overflow: "hidden", flexShrink: 0, backgroundColor: "#376B00" }}>
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
            Kelola asupan nutrisi Anda dengan lebih cerdas.
          </p>
        </div>

        {/* Error message */}
        {state?.error && (
          <div
            id="login-error"
            className="mb-4 p-3 rounded-[12px] bg-danger-bg border border-danger/20 text-danger text-sm"
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-4">
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-text-secondary">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Lupa password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Masukkan password"
              autoComplete="current-password"
            />
          </div>

          <div className="mt-2">
            <SubmitButton />
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-text-muted mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Daftar di sini
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
