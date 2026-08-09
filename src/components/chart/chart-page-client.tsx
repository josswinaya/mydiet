"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Scale } from "lucide-react";

interface WeightLogItem {
  id: string;
  weightKg: number;
  loggedAt: Date;
}

interface CalorieHistoryItem {
  date: string;
  in: number;
  out: number; // exercise calories
}

interface ChartPageClientProps {
  weightLogs: WeightLogItem[];
  calorieHistory: CalorieHistoryItem[];
  currentWeight: number;
}

export function ChartPageClient({
  weightLogs,
  calorieHistory,
  currentWeight,
}: ChartPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [weightInput, setWeightInput] = useState<string>("");

  // Format weight logs for Recharts
  const weightData = weightLogs.map((log) => ({
    date: new Date(log.loggedAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    }),
    weight: log.weightKg,
  }));

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightKg = parseFloat(weightInput);
    if (isNaN(weightKg) || weightKg <= 0) {
      toast.error("Masukkan berat badan yang valid.");
      return;
    }

    try {
      const res = await fetch("/api/weight-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weightKg }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan berat badan.");

      toast.success("Berat badan berhasil dicatat!");
      setWeightInput("");
      
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-20">
      <div className="text-center">
        <h1 className="text-xl font-bold text-text-dark">Grafik Progres</h1>
        <p className="text-sm text-text-muted">Pantau perjalanan diet Anda</p>
      </div>

      {/* ── Log Weight Card ── */}
      <div className="card bg-primary-soft-bg border-none">
        <div className="flex items-center gap-3 mb-3">
          <div className="icon-circle bg-white text-primary w-10 h-10 shadow-sm">
            <Scale size={20} />
          </div>
          <div>
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">
              Catat Hari Ini
            </p>
            <p className="text-sm text-text-dark font-medium">
              Berat Saat Ini: <span className="font-bold">{currentWeight} kg</span>
            </p>
          </div>
        </div>
        <form onSubmit={handleLogWeight} className="flex gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="Contoh: 70.5"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            disabled={isPending}
            className="input-field flex-1 bg-white"
            required
          />
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-auto px-5 py-3"
          >
            {isPending ? "..." : "Simpan"}
          </button>
        </form>
      </div>

      {/* ── Weight Line Chart ── */}
      <div className="card">
        <h2 className="text-sm font-semibold text-text-dark mb-4">
          Riwayat Berat Badan (kg)
        </h2>
        {weightData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  labelStyle={{ fontSize: "12px", color: "#6b7280" }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-10 text-text-muted text-sm">
            Belum ada data berat badan.
          </div>
        )}
      </div>

      {/* ── Calories Bar Chart ── */}
      <div className="card">
        <h2 className="text-sm font-semibold text-text-dark mb-4">
          Kalori 7 Hari Terakhir
        </h2>
        {calorieHistory.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="in" name="Masuk (kcal)" fill="var(--color-warning)" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="out" name="Terbakar (kcal)" fill="var(--color-success)" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-10 text-text-muted text-sm">
            Belum ada data kalori.
          </div>
        )}
      </div>
    </div>
  );
}
