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
import { Scale, CheckCircle } from "lucide-react";

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
  hasLoggedToday: boolean;
}

export function ChartPageClient({
  weightLogs,
  calorieHistory,
  currentWeight,
  hasLoggedToday,
}: ChartPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [weightInput, setWeightInput] = useState<string>(currentWeight.toString());

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
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="icon-circle bg-white text-primary w-10 h-10 shadow-sm flex-shrink-0">
              <Scale size={20} />
            </div>
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                Catat Hari Ini
              </p>
              <div className="flex items-center gap-2">
                 <span className="text-sm text-text-dark font-medium">Berat Saat Ini:</span>
                 {!hasLoggedToday ? (
                   <div className="flex items-center">
                     <input
                       type="number"
                       step="0.1"
                       value={weightInput}
                       onChange={(e) => setWeightInput(e.target.value)}
                       disabled={isPending}
                       className="w-16 border-b-2 border-primary/30 focus:border-primary outline-none bg-transparent font-bold text-sm text-center px-1 transition-colors"
                       required
                     />
                     <span className="text-sm font-bold ml-1">kg</span>
                   </div>
                 ) : (
                   <span className="text-sm font-bold">{weightLogs[weightLogs.length - 1]?.weightKg || currentWeight} kg</span>
                 )}
              </div>
            </div>
          </div>

          {!hasLoggedToday ? (
             <button
               onClick={handleLogWeight}
               disabled={isPending || !weightInput}
               className="btn-primary w-full py-3 mt-1"
             >
               {isPending ? "Menyimpan..." : "Simpan"}
             </button>
          ) : (
             <div className="text-xs font-medium text-success bg-success/10 px-3 py-2.5 rounded-lg border border-success/20 flex items-center justify-center gap-2 mt-1">
               <CheckCircle size={14} /> Berat badan hari ini sudah dicatat
             </div>
          )}
        </div>
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
