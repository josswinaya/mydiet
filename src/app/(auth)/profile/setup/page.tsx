"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveProfileAction } from "@/actions/profile";
import {
  Dumbbell,
  PersonStanding,
  Zap,
  Flame,
  ArrowRight,
} from "lucide-react";

const ACTIVITY_OPTIONS = [
  {
    value: "SEDENTARY",
    label: "Santai",
    desc: "Sedikit atau tidak ada olahraga",
    icon: PersonStanding,
  },
  {
    value: "LIGHT",
    label: "Ringan",
    desc: "Olahraga ringan 1–3x seminggu",
    icon: Zap,
  },
  {
    value: "MODERATE",
    label: "Sedang",
    desc: "Olahraga 3–5 kali seminggu",
    icon: Dumbbell,
  },
  {
    value: "ACTIVE",
    label: "Aktif",
    desc: "Olahraga intens 6–7x seminggu",
    icon: Flame,
  },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      id="btn-save-profile"
      className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Menyimpan..." : (
        <>Simpan Biodata <ArrowRight size={18} /></>
      )}
    </button>
  );
}

export default function ProfileSetupPage() {
  const [state, formAction] = useActionState(saveProfileAction, null);

  return (
    <main className="min-h-screen bg-bg-app px-4 py-8 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-text-dark">
          Mari Lengkapi Profil Anda
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Data ini membantu kami menghitung kebutuhan kalori harian Anda secara akurat.
        </p>
      </div>

      {/* Error */}
      {state?.error && (
        <div
          id="profile-error"
          className="mb-4 p-3 rounded-[12px] bg-danger-bg border border-danger/20 text-danger text-sm"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-6">
        {/* === Jenis Kelamin === */}
        <div>
          <p className="text-sm font-semibold text-text-dark mb-3">
            Jenis Kelamin
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "MALE", label: "Laki-laki", emoji: "♂️" },
              { value: "FEMALE", label: "Perempuan", emoji: "♀️" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex flex-col items-center gap-2 p-4 rounded-[20px] border-2 cursor-pointer transition-all
                  has-[:checked]:bg-primary-soft-bg has-[:checked]:border-primary
                  border-border bg-white hover:bg-bg-neutral"
              >
                <input
                  type="radio"
                  name="gender"
                  value={opt.value}
                  required
                  className="sr-only"
                  defaultChecked={opt.value === "MALE"}
                />
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-sm font-semibold text-text-dark">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* === Data Fisik === */}
        <div className="card flex flex-col gap-4">
          <p className="text-sm font-semibold text-text-dark">Data Fisik</p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="age" className="text-xs font-medium text-text-secondary">
              Usia (Tahun)
            </label>
            <input
              id="age"
              name="age"
              type="number"
              placeholder="Misal: 22"
              min={10}
              max={120}
              required
              className="input-field"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="heightCm" className="text-xs font-medium text-text-secondary">
              Tinggi Badan (cm)
            </label>
            <input
              id="heightCm"
              name="heightCm"
              type="number"
              placeholder="Misal: 170"
              min={100}
              max={250}
              required
              className="input-field"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="weightKg" className="text-xs font-medium text-text-secondary">
              Berat Badan (kg)
            </label>
            <input
              id="weightKg"
              name="weightKg"
              type="number"
              placeholder="Misal: 65"
              min={20}
              max={300}
              step={0.1}
              required
              className="input-field"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="targetWeightKg" className="text-xs font-medium text-text-secondary">
              Target Berat Badan (kg) <span className="text-text-muted">(opsional)</span>
            </label>
            <input
              id="targetWeightKg"
              name="targetWeightKg"
              type="number"
              placeholder="Misal: 60"
              min={20}
              max={300}
              step={0.1}
              className="input-field"
            />
          </div>
        </div>

        {/* === Tingkat Aktivitas === */}
        <div>
          <p className="text-sm font-semibold text-text-dark mb-3">
            Tingkat Aktivitas
          </p>
          <div className="flex flex-col gap-3">
            {ACTIVITY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 p-4 rounded-[16px] border-2 cursor-pointer transition-all
                    has-[:checked]:bg-primary-soft-bg has-[:checked]:border-primary
                    border-border bg-white hover:bg-bg-neutral"
                >
                  <input
                    type="radio"
                    name="activityLevel"
                    value={opt.value}
                    required
                    className="sr-only"
                    defaultChecked={opt.value === "SEDENTARY"}
                  />
                  {/* Icon circle */}
                  <div
                    className="icon-circle bg-border group-has-[:checked]:bg-primary
                    has-checked:bg-primary flex-shrink-0"
                  >
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-dark">
                      {opt.label}
                    </span>
                    <span className="text-xs text-text-muted">{opt.desc}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <SubmitButton />
      </form>
    </main>
  );
}
