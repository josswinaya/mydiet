"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Search, Timer, Flame, X } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  metValue: number;
}

interface ExerciseLogFormProps {
  userWeightKg?: number;
  onSuccess: () => void;
}

/**
 * Form to log an exercise entry.
 * Features: activity search, duration input, live calorie burn preview.
 */
export function ExerciseLogForm({ userWeightKg = 70, onSuccess }: ExerciseLogFormProps) {
  const [query, setQuery] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selected, setSelected] = useState<Activity | null>(null);
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estimated calories using MET formula
  const estimatedCalories =
    selected && duration
      ? Math.round(
          (selected.metValue * userWeightKg * parseFloat(duration || "0")) / 60
        )
      : null;

  useEffect(() => {
    if (query.length < 2) {
      setActivities([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/activities?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setActivities(data.data);
          setOpen(true);
        }
      } catch {
        // silent error
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !duration) return;

    const parsedDuration = parseInt(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      toast.error("Masukkan durasi yang valid.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/exercise-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: selected.id,
          durationMinutes: parsedDuration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal menyimpan log olahraga.");
        return;
      }

      toast.success(`🏃 ${selected.name} (${parsedDuration} menit) berhasil dicatat!`);
      setSelected(null);
      setQuery("");
      setDuration("30");
      onSuccess();
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Activity search */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          {searchLoading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          )}
          {!searchLoading && query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setActivities([]); setSelected(null); setOpen(false); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
            >
              <X size={14} />
            </button>
          )}
          <input
            type="text"
            placeholder="Cari olahraga... (mis. lari, renang)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            className="input-field pl-10 pr-10"
            id="exercise-search-input"
            autoComplete="off"
          />
        </div>

        {open && activities.length > 0 && (
          <ul className="absolute z-50 w-full top-full mt-1 bg-white border border-border rounded-[16px] shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            {activities.map((act) => (
              <li key={act.id}>
                <button
                  type="button"
                  onClick={() => { setSelected(act); setQuery(act.name); setOpen(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-primary-soft-bg transition-colors flex justify-between items-center"
                >
                  <span className="text-sm font-medium text-text-dark">{act.name}</span>
                  <span className="text-xs text-text-muted ml-2 flex-shrink-0">MET {act.metValue}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Duration + calorie preview */}
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-1.5">
          <label htmlFor="exercise-duration" className="text-xs font-medium text-text-secondary">
            Durasi (menit)
          </label>
          <div className="relative">
            <Timer size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="exercise-duration"
              type="number"
              min={1}
              max={480}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {estimatedCalories !== null && (
          <div className="flex flex-col gap-1.5 items-center justify-end">
            <div className="flex items-center gap-1.5 px-3 py-2.5 bg-success-bg rounded-[12px]">
              <Flame size={14} className="text-success" />
              <span className="text-sm font-bold text-success">-{estimatedCalories} kcal</span>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!selected || !duration || loading}
        id="btn-log-exercise"
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Menyimpan..." : "Catat Olahraga"}
      </button>
    </form>
  );
}
