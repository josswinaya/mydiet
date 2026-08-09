import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "MyDiet — Grafik Progres",
  description: "Pantau tren berat badan dan kalori harian Anda.",
};

/**
 * Chart page placeholder — will be fully implemented in commit 3.
 */
export default function ChartPage() {
  return (
    <main className="min-h-screen bg-bg-app flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="icon-circle bg-primary/10 mx-auto mb-4 w-16 h-16">
          <TrendingUp size={32} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-text-dark mb-2">Grafik Progres</h1>
        <p className="text-sm text-text-muted">
          Fitur grafik berat badan dan kalori sedang disiapkan.
        </p>
        <p className="text-xs text-text-muted mt-1 opacity-60">Coming soon — Commit 3</p>
      </div>
    </main>
  );
}
