import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "MyDiet — Prediksi AI",
  description: "Prediksi perubahan berat badan dengan kecerdasan buatan.",
};

/**
 * Predict page placeholder — will be fully implemented in commit 4.
 */
export default function PredictPage() {
  return (
    <main className="min-h-screen bg-bg-app flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="icon-circle bg-primary/10 mx-auto mb-4 w-16 h-16">
          <Sparkles size={32} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-text-dark mb-2">Prediksi AI</h1>
        <p className="text-sm text-text-muted">
          Fitur prediksi berat badan berbasis Gemini AI sedang disiapkan.
        </p>
        <p className="text-xs text-text-muted mt-1 opacity-60">Coming soon — Commit 4</p>
      </div>
    </main>
  );
}
