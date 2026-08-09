import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { calculateTDEE } from "@/lib/calories";
import Link from "next/link";
import { Utensils, Dumbbell, Weight, Sparkles } from "lucide-react";
import { CalorieRing } from "@/components/dashboard/calorie-ring";
import { MacroPanel } from "@/components/dashboard/macro-panel";
import { TodayEntries } from "@/components/dashboard/today-entries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyDiet — Beranda",
  description: "Pantau asupan kalori dan progres diet harian Anda.",
};

// Quick action buttons
const QUICK_ACTIONS = [
  { href: "/log", label: "Log Makanan", icon: Utensils, color: "bg-warning-bg text-warning" },
  { href: "/log", label: "Catat Olahraga", icon: Dumbbell, color: "bg-success-bg text-success" },
  { href: "/chart", label: "Grafik", icon: Weight, color: "bg-primary/10 text-primary" },
  { href: "/predict", label: "Prediksi AI", icon: Sparkles, color: "bg-primary/10 text-primary" },
] as const;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

function formatDate(): string {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Dashboard page — server component.
 * Fetches user profile + today's entries in parallel,
 * computes TDEE, calories consumed/burned, and macro totals.
 */
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch in parallel
  const [user, foodEntries, exerciseEntries] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        gender: true,
        age: true,
        heightCm: true,
        weightKg: true,
        activityLevel: true,
        targetWeightKg: true,
      },
    }),
    prisma.foodEntry.findMany({
      where: { userId, loggedAt: { gte: startOfDay, lte: endOfDay } },
      include: {
        foodItem: {
          select: {
            name: true,
            caloriesPer100g: true,
            proteinPer100g: true,
            carbsPer100g: true,
            fatPer100g: true,
          },
        },
      },
      orderBy: { loggedAt: "desc" },
    }),
    prisma.exerciseEntry.findMany({
      where: { userId, loggedAt: { gte: startOfDay, lte: endOfDay } },
      include: { activity: { select: { name: true, metValue: true } } },
      orderBy: { loggedAt: "desc" },
    }),
  ]);

  // ── Calorie calculations ──────────────────────────────────────────────────
  const hasProfile =
    user?.gender && user?.age && user?.heightCm && user?.weightKg && user?.activityLevel;

  const tdee = hasProfile
    ? calculateTDEE({
        gender: user.gender!,
        age: user.age!,
        heightCm: user.heightCm!,
        weightKg: user.weightKg!,
        activityLevel: user.activityLevel!,
      }).tdee
    : 2000; // default if profile incomplete

  const totalCaloriesIn = foodEntries.reduce((sum, e) => sum + e.calories, 0);
  const totalCaloriesBurned = exerciseEntries.reduce((sum, e) => sum + e.caloriesBurned, 0);

  // ── Macro totals ──────────────────────────────────────────────────────────
  const macros = foodEntries.reduce(
    (acc, e) => {
      const factor = e.amountGrams / 100;
      return {
        protein: acc.protein + e.foodItem.proteinPer100g * factor,
        carbs: acc.carbs + e.foodItem.carbsPer100g * factor,
        fat: acc.fat + e.foodItem.fatPer100g * factor,
      };
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  // Macro targets: ~30% protein, ~45% carbs, ~25% fat of TDEE
  const targetProtein = Math.round((tdee * 0.3) / 4);  // 4 kcal/g protein
  const targetCarbs   = Math.round((tdee * 0.45) / 4); // 4 kcal/g carbs
  const targetFat     = Math.round((tdee * 0.25) / 9); // 9 kcal/g fat

  const greeting = getGreeting();
  const dateStr = formatDate();
  const displayName = user?.name?.split(" ")[0] ?? "Pengguna";

  return (
    <main className="min-h-screen bg-bg-app pb-4">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-primary to-primary-hover px-5 pt-10 pb-20 text-white">
        <p className="text-xs text-white/70 mb-1">{dateStr}</p>
        <h1 className="text-xl font-bold">
          {greeting}, {displayName}! 👋
        </h1>
        {!hasProfile && (
          <Link
            href="/profile/setup"
            className="inline-flex items-center gap-1.5 mt-3 text-xs bg-white/20 hover:bg-white/30
              px-3 py-1.5 rounded-full transition-colors"
          >
            ⚠️ Lengkapi profil untuk TDEE akurat
          </Link>
        )}
      </div>

      {/* ── Content cards pulled up over header ── */}
      <div className="-mt-14 px-4 flex flex-col gap-4">

        {/* ── Calorie summary card ── */}
        <div className="card">
          <p className="text-sm font-semibold text-text-dark mb-4 text-center">
            Kalori Hari Ini
          </p>
          <CalorieRing
            consumed={totalCaloriesIn}
            tdee={tdee}
            burned={totalCaloriesBurned}
          />

          {/* Stat row */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border">
            {[
              { label: "Target", value: tdee, color: "text-text-dark" },
              { label: "Masuk", value: totalCaloriesIn, color: "text-warning" },
              { label: "Terbakar", value: totalCaloriesBurned, color: "text-success" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-base font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                id={`quick-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-[16px]
                  border border-border hover:bg-bg-neutral transition-colors text-center"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[10px] text-text-secondary font-medium leading-tight">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Macro panel ── */}
        <MacroPanel
          proteinG={macros.protein}
          carbsG={macros.carbs}
          fatG={macros.fat}
          targetProtein={targetProtein}
          targetCarbs={targetCarbs}
          targetFat={targetFat}
        />

        {/* ── Today's entries preview ── */}
        <TodayEntries
          foodEntries={foodEntries}
          exerciseEntries={exerciseEntries}
        />

        {/* ── Target berat badan (if set) ── */}
        {user?.targetWeightKg && user?.weightKg && (
          <div className="card flex items-center gap-4">
            <div className="icon-circle bg-primary/10 flex-shrink-0">
              <Weight size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-muted">Target Berat Badan</p>
              <p className="text-sm font-bold text-text-dark">
                {user.weightKg} kg → {user.targetWeightKg} kg
              </p>
              <p className="text-xs text-primary font-medium">
                {Math.abs(user.weightKg - user.targetWeightKg).toFixed(1)} kg{" "}
                {user.weightKg > user.targetWeightKg ? "lagi untuk turun" : "lagi untuk naik"}
              </p>
            </div>
            <Link
              href="/predict"
              className="text-xs text-primary font-semibold hover:underline flex-shrink-0"
            >
              Prediksi
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
