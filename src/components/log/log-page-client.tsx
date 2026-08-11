"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Utensils, Dumbbell, Flame, TrendingDown, Trash2, Footprints, Activity } from "lucide-react";
import { toast } from "sonner";
import { FoodLogForm } from "./food-log-form";
import { ExerciseLogForm } from "./exercise-log-form";

interface FoodEntry {
  id: string;
  calories: number;
  amountGrams: number;
  mealType: string;
  loggedAt: Date | string;
  foodItem: { name: string; caloriesPer100g: number };
}

interface ExerciseEntry {
  id: string;
  caloriesBurned: number;
  durationMinutes: number;
  loggedAt: Date | string;
  activity: { name: string; metValue: number };
}

interface LogPageClientProps {
  initialFoodEntries: FoodEntry[];
  initialExerciseEntries: ExerciseEntry[];
  totalCaloriesIn: number;
  totalCaloriesBurned: number;
  userWeightKg: number;
}

type Tab = "food" | "exercise";

const MEAL_LABEL: Record<string, string> = {
  BREAKFAST: "Sarapan",
  LUNCH: "Makan Siang",
  DINNER: "Makan Malam",
  SNACK: "Camilan",
};

/**
 * Interactive client component for the daily log page.
 * Handles tab switching, entry display, and deletion.
 */
export function LogPageClient({
  initialFoodEntries,
  initialExerciseEntries,
  totalCaloriesIn,
  totalCaloriesBurned,
  userWeightKg,
}: LogPageClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("food");
  const [foodEntries, setFoodEntries] = useState(initialFoodEntries);
  const [exerciseEntries, setExerciseEntries] = useState(initialExerciseEntries);
  const [caloriesIn, setCaloriesIn] = useState(totalCaloriesIn);
  const [caloriesBurned, setCaloriesBurned] = useState(totalCaloriesBurned);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const netCalories = caloriesIn - caloriesBurned;

  // Refresh by calling router.refresh() to re-run server component
  const handleSuccess = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  async function handleDeleteFood(id: string) {
    const entry = foodEntries.find((e) => e.id === id);
    if (!entry) return;

    // Optimistic UI update
    setFoodEntries((prev) => prev.filter((e) => e.id !== id));
    setCaloriesIn((prev) => prev - entry.calories);

    try {
      const res = await fetch(`/api/food-entries?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        // Revert on failure
        setFoodEntries(initialFoodEntries);
        setCaloriesIn(totalCaloriesIn);
        toast.error("Gagal menghapus entry.");
      } else {
        toast.success("Entry makanan dihapus.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    }
  }

  async function handleDeleteExercise(id: string) {
    const entry = exerciseEntries.find((e) => e.id === id);
    if (!entry) return;

    setExerciseEntries((prev) => prev.filter((e) => e.id !== id));
    setCaloriesBurned((prev) => prev - entry.caloriesBurned);

    try {
      const res = await fetch(`/api/exercise-entries?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        setExerciseEntries(initialExerciseEntries);
        setCaloriesBurned(totalCaloriesBurned);
        toast.error("Gagal menghapus entry.");
      } else {
        toast.success("Entry olahraga dihapus.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    }
  }

  return (
    <main className="min-h-screen bg-bg-app pb-20">
      {/* Header summary */}
      <div className="bg-gradient-to-br from-primary to-primary-hover px-4 pt-8 pb-6 text-white">
        <h1 className="text-lg font-bold mb-4">Log Harian</h1>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-[16px] p-3 text-center">
            <Flame size={18} className="mx-auto mb-1 text-white/80" />
            <p className="text-lg font-bold">{caloriesIn}</p>
            <p className="text-xs text-white/70">Masuk</p>
          </div>
          <div className="bg-white/15 rounded-[16px] p-3 text-center">
            <TrendingDown size={18} className="mx-auto mb-1 text-white/80" />
            <p className="text-lg font-bold">{caloriesBurned}</p>
            <p className="text-xs text-white/70">Terbakar</p>
          </div>
          <div className={`rounded-[16px] p-3 text-center ${
            netCalories > 0 ? "bg-warning/20" : "bg-success/20"
          }`}>
            <div className="text-lg font-bold">{Math.abs(netCalories)}</div>
            <p className="text-xs text-white/70">
              {netCalories > 0 ? "Surplus" : "Defisit"}
            </p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="px-4 -mt-4 mb-4 relative z-10">
        <div className="bg-white rounded-[20px] p-1 flex shadow-sm border border-border">
          {(["food", "exercise"] as Tab[]).map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[16px] text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-bg-neutral"
              }`}
            >
              {tab === "food" ? <Utensils size={15} /> : <Dumbbell size={15} />}
              {tab === "food" ? "Makanan" : "Olahraga"}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="px-4 mb-4">
        <div className="card">
          <h2 className="text-sm font-semibold text-text-dark mb-4">
            {activeTab === "food" ? "Tambah Makanan" : "Catat Olahraga"}
          </h2>
          {activeTab === "food" ? (
            <FoodLogForm onSuccess={handleSuccess} />
          ) : (
            <ExerciseLogForm userWeightKg={userWeightKg} onSuccess={handleSuccess} />
          )}
        </div>
      </div>

      {/* Entries list */}
      <div className="px-4">
        <h2 className="text-sm font-semibold text-text-dark mb-3">
          {activeTab === "food" ? "Makanan Hari Ini" : "Olahraga Hari Ini"}
        </h2>

        {activeTab === "food" && (
          <div className="flex flex-col gap-2">
            {foodEntries.length === 0 && (
              <div className="card text-center py-8">
                <Utensils size={32} className="mx-auto text-text-muted/40 mb-2" />
                <p className="text-sm text-text-muted">Belum ada makanan yang dicatat hari ini.</p>
              </div>
            )}
            {foodEntries.map((entry) => (
              <div key={entry.id} className="card flex items-center gap-3 py-3">
                <div className="icon-circle bg-warning-bg flex-shrink-0">
                  <Flame size={16} className="text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-dark truncate">
                    {entry.foodItem.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {entry.amountGrams}g · {MEAL_LABEL[entry.mealType] ?? entry.mealType}
                  </p>
                </div>
                <span className="text-sm font-semibold text-warning flex-shrink-0">
                  {entry.calories} kcal
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteFood(entry.id)}
                  className="text-text-muted hover:text-danger transition-colors flex-shrink-0 p-1"
                  aria-label="Hapus entry makanan"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "exercise" && (
          <div className="flex flex-col gap-2">
            {exerciseEntries.length === 0 && (
              <div className="card text-center py-8">
                <Dumbbell size={32} className="mx-auto text-text-muted/40 mb-2" />
                <p className="text-sm text-text-muted">Belum ada olahraga yang dicatat hari ini.</p>
              </div>
            )}
            {exerciseEntries.map((entry) => (
              <div key={entry.id} className="card flex items-center gap-3 py-3">
                <div className="icon-circle bg-success-bg flex-shrink-0">
                  {(() => {
                    const name = entry.activity.name.toLowerCase();
                    if (name.includes("lari") || name.includes("jalan") || name.includes("jog")) {
                      return <Footprints size={16} className="text-success" />;
                    }
                    if (name.includes("beban") || name.includes("gym") || name.includes("angkat")) {
                      return <Dumbbell size={16} className="text-success" />;
                    }
                    return <Activity size={16} className="text-success" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-dark truncate">
                    {entry.activity.name}
                  </p>
                  <p className="text-xs text-text-muted">{entry.durationMinutes} menit</p>
                </div>
                <span className="text-sm font-semibold text-success flex-shrink-0">
                  -{entry.caloriesBurned} kcal
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteExercise(entry.id)}
                  className="text-text-muted hover:text-danger transition-colors flex-shrink-0 p-1"
                  aria-label="Hapus entry olahraga"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
