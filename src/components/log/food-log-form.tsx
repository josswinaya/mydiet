"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Utensils, Flame } from "lucide-react";
import { FoodSearch } from "./food-search";

interface SelectedFood {
  id: string;
  name: string;
  caloriesPer100g: number;
  servingSize: number | null;
}

const MEAL_TYPES = [
  { value: "BREAKFAST", label: "Sarapan" },
  { value: "LUNCH", label: "Makan Siang" },
  { value: "DINNER", label: "Makan Malam" },
  { value: "SNACK", label: "Camilan" },
];

interface FoodLogFormProps {
  onSuccess: () => void;
}

/**
 * Form to log a food entry.
 * Uses FoodSearch for food selection, then prompts for portion amount.
 */
export function FoodLogForm({ onSuccess }: FoodLogFormProps) {
  const [selected, setSelected] = useState<SelectedFood | null>(null);
  const [amount, setAmount] = useState("");
  const [mealType, setMealType] = useState("LUNCH");
  const [loading, setLoading] = useState(false);

  const estimatedCalories =
    selected && amount
      ? Math.round((selected.caloriesPer100g * parseFloat(amount || "0")) / 100)
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !amount) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Masukkan jumlah yang valid.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/food-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodItemId: selected.id,
          amountGrams: parsedAmount,
          mealType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal menyimpan log makanan.");
        return;
      }

      toast.success(`✅ ${selected.name} berhasil dicatat!`);
      setSelected(null);
      setAmount("");
      onSuccess();
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Food search */}
      <FoodSearch onSelect={(item) => {
        setSelected(item);
        setAmount(item.servingSize ? String(item.servingSize) : "100");
      }} />

      {/* Selected food card */}
      {selected && (
        <div className="bg-primary-soft-bg rounded-[16px] p-4 flex items-start gap-3 border border-primary/20">
          <div className="icon-circle bg-primary/10 flex-shrink-0">
            <Utensils size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-dark">{selected.name}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {selected.caloriesPer100g} kcal per 100g
            </p>
          </div>
        </div>
      )}

      {/* Meal type pills */}
      <div className="flex gap-2 flex-wrap">
        {MEAL_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setMealType(type.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              mealType === type.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-text-secondary border-border hover:bg-bg-neutral"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-1.5">
          <label htmlFor="food-amount" className="text-xs font-medium text-text-secondary">
            Jumlah (gram)
          </label>
          <input
            id="food-amount"
            type="number"
            placeholder="Mis: 150"
            min={1}
            max={5000}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
            disabled={!selected}
          />
        </div>

        {/* Estimated calorie preview */}
        {estimatedCalories !== null && (
          <div className="flex flex-col gap-1.5 items-center justify-end">
            <div className="flex items-center gap-1.5 px-3 py-2.5 bg-warning-bg rounded-[12px]">
              <Flame size={14} className="text-warning" />
              <span className="text-sm font-bold text-warning">
                {estimatedCalories} kcal
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!selected || !amount || loading}
        id="btn-log-food"
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Menyimpan..." : "Tambah ke Log"}
      </button>
    </form>
  );
}
