"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  Dumbbell,
  PersonStanding,
  Zap,
  Flame,
  LogOut,
  Save,
} from "lucide-react";
import type { UserProfile } from "@/types";

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

interface ProfilePageClientProps {
  user: UserProfile;
}

export function ProfilePageClient({ user }: ProfilePageClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Form State
  const [age, setAge] = useState(user.age?.toString() || "");
  const [heightCm, setHeightCm] = useState(user.heightCm?.toString() || "");
  const [weightKg, setWeightKg] = useState(user.weightKg?.toString() || "");
  const [targetWeightKg, setTargetWeightKg] = useState(user.targetWeightKg?.toString() || "");
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || "SEDENTARY");
  const [gender, setGender] = useState(user.gender || "MALE");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(age) || null,
          heightCm: parseFloat(heightCm) || null,
          weightKg: parseFloat(weightKg) || null,
          targetWeightKg: parseFloat(targetWeightKg) || null,
          activityLevel,
          gender,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate profil.");
      
      toast.success("Profil berhasil diperbarui!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-24 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-xl font-bold text-text-dark">Pengaturan Profil</h1>
        <p className="text-sm text-text-muted mt-1">{user.email}</p>
      </div>

      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        
        {/* === Gender === */}
        <div>
          <p className="text-sm font-semibold text-text-dark mb-3">Jenis Kelamin</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "MALE", label: "Laki-laki", emoji: "♂️" },
              { value: "FEMALE", label: "Perempuan", emoji: "♀️" },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setGender(opt.value as "MALE" | "FEMALE")}
                className={`flex flex-col items-center gap-2 p-4 rounded-[20px] border-2 transition-all
                  ${gender === opt.value
                    ? "bg-primary-soft-bg border-primary"
                    : "border-border bg-white hover:bg-bg-neutral"
                  }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-sm font-semibold text-text-dark">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* === Fisik === */}
        <div className="card flex flex-col gap-4">
          <p className="text-sm font-semibold text-text-dark">Data Fisik</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Usia</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Tinggi (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Berat (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Target (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* === Aktivitas === */}
        <div>
          <p className="text-sm font-semibold text-text-dark mb-3">Tingkat Aktivitas</p>
          <div className="flex flex-col gap-3">
            {ACTIVITY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isChecked = activityLevel === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setActivityLevel(opt.value as any)}
                  className={`flex items-center text-left gap-3 p-4 rounded-[16px] border-2 transition-all
                    ${isChecked ? "bg-primary-soft-bg border-primary" : "border-border bg-white hover:bg-bg-neutral"}
                  `}
                >
                  <div className={`icon-circle flex-shrink-0 ${isChecked ? "bg-primary text-white" : "bg-border text-primary"}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-dark">{opt.label}</span>
                    <span className="text-xs text-text-muted">{opt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex justify-center gap-2"
        >
          {isLoading ? "Menyimpan..." : <><Save size={18} /> Simpan Perubahan</>}
        </button>
      </form>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="mt-4 flex items-center justify-center gap-2 p-3 text-sm font-semibold text-danger border border-danger/20 bg-danger/5 hover:bg-danger/10 rounded-xl transition-colors"
      >
        <LogOut size={16} />
        {isLoggingOut ? "Keluar..." : "Keluar dari Akun"}
      </button>

    </div>
  );
}
