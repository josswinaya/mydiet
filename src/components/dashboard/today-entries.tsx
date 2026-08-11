import Link from "next/link";
import { Utensils, Dumbbell, ChevronRight, Flame, Footprints, Activity } from "lucide-react";

interface FoodEntryPreview {
  id: string;
  calories: number;
  amountGrams: number;
  mealType: string;
  foodItem: { name: string };
}

interface ExerciseEntryPreview {
  id: string;
  caloriesBurned: number;
  durationMinutes: number;
  activity: { name: string };
}

interface TodayEntriesProps {
  foodEntries: FoodEntryPreview[];
  exerciseEntries: ExerciseEntryPreview[];
}

const MEAL_LABEL: Record<string, string> = {
  BREAKFAST: "Sarapan",
  LUNCH: "Makan Siang",
  DINNER: "Makan Malam",
  SNACK: "Camilan",
};

/**
 * Preview card showing today's top 3 food and exercise entries.
 * Links to full log page.
 */
export function TodayEntries({ foodEntries, exerciseEntries }: TodayEntriesProps) {
  const previewFood = foodEntries.slice(0, 3);
  const previewExercise = exerciseEntries.slice(0, 2);
  const hasMore = foodEntries.length > 3 || exerciseEntries.length > 2;

  if (foodEntries.length === 0 && exerciseEntries.length === 0) {
    return (
      <div className="card text-center py-6">
        <Utensils size={28} className="mx-auto text-text-muted/40 mb-2" />
        <p className="text-sm text-text-muted">Belum ada catatan hari ini.</p>
        <Link
          href="/log"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3 hover:underline"
        >
          Mulai catat sekarang <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-dark">Aktivitas Hari Ini</p>
        <Link
          href="/log"
          className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline"
          id="link-view-all-log"
        >
          Lihat semua <ChevronRight size={12} />
        </Link>
      </div>

      {/* Food entries */}
      {previewFood.map((entry) => (
        <div key={entry.id} className="flex items-center gap-3">
          <div className="icon-circle bg-warning-bg flex-shrink-0 w-8 h-8">
            <Utensils size={14} className="text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-dark truncate">
              {entry.foodItem.name}
            </p>
            <p className="text-[10px] text-text-muted">
              {entry.amountGrams}g · {MEAL_LABEL[entry.mealType] ?? entry.mealType}
            </p>
          </div>
          <span className="text-xs font-semibold text-warning flex-shrink-0">
            {entry.calories} kcal
          </span>
        </div>
      ))}

      {/* Exercise entries */}
      {previewExercise.map((entry) => (
        <div key={entry.id} className="flex items-center gap-3">
          <div className="icon-circle bg-success-bg flex-shrink-0 w-8 h-8">
            {(() => {
              const name = entry.activity.name.toLowerCase();
              if (name.includes("lari") || name.includes("jalan") || name.includes("jog")) {
                return <Footprints size={14} className="text-success" />;
              }
              if (name.includes("beban") || name.includes("gym") || name.includes("angkat")) {
                return <Dumbbell size={14} className="text-success" />;
              }
              return <Activity size={14} className="text-success" />;
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-dark truncate">
              {entry.activity.name}
            </p>
            <p className="text-[10px] text-text-muted">
              {entry.durationMinutes} menit
            </p>
          </div>
          <span className="text-xs font-semibold text-success flex-shrink-0 flex items-center gap-0.5">
            <Flame size={11} />-{entry.caloriesBurned} kcal
          </span>
        </div>
      ))}

      {hasMore && (
        <p className="text-xs text-text-muted text-center pt-1">
          +{(foodEntries.length - previewFood.length) + (exerciseEntries.length - previewExercise.length)} entri lainnya
        </p>
      )}
    </div>
  );
}
