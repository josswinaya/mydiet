"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Weight, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { PredictionResult } from "@/types";

interface PredictPageClientProps {
  currentWeight: number | null;
  targetWeight: number | null;
  lastPrediction: PredictionResult | null;
}

export function PredictPageClient({
  currentWeight,
  targetWeight,
  lastPrediction: initialPrediction,
}: PredictPageClientProps) {
  const [weeks, setWeeks] = useState<number>(4);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(initialPrediction);

  if (!currentWeight) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <Weight size={48} className="text-text-muted mb-4 opacity-50" />
        <p className="text-sm text-text-dark font-medium mb-2">Profil Belum Lengkap</p>
        <p className="text-xs text-text-muted">
          Silakan lengkapi profil Anda (tinggi, berat badan, umur) untuk menggunakan fitur Prediksi AI.
        </p>
      </div>
    );
  }

  const handlePredict = async () => {
    setIsLoading(true);
    setPrediction(null); // hide old prediction while loading
    
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectedWeeks: weeks }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mendapatkan prediksi.");

      setPrediction(json.data);
      toast.success("Prediksi AI berhasil digenerate!");
    } catch (err: any) {
      toast.error(err.message);
      // Restore if we had one
      if (initialPrediction) setPrediction(initialPrediction);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-24">
      {/* ── Header ── */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-text-dark flex items-center justify-center gap-2">
          Prediksi AI <Sparkles size={20} className="text-primary" />
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Lihat apa yang terjadi jika Anda mempertahankan rutinitas 7 hari terakhir.
        </p>
      </div>

      {/* ── Input Form ── */}
      <div className="card border-none bg-primary/5">
        <label className="text-sm font-semibold text-text-dark mb-2 block flex items-center gap-2">
          <Calendar size={16} className="text-primary" /> 
          Pilih Durasi Prediksi
        </label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 4, 8, 12].map((w) => (
            <button
              key={w}
              onClick={() => setWeeks(w)}
              className={`py-2 rounded-lg text-xs font-semibold transition-colors
                ${weeks === w 
                  ? "bg-primary text-white" 
                  : "bg-white text-text-dark border border-border hover:bg-bg-neutral"
                }`}
            >
              {w} W
            </button>
          ))}
        </div>
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="animate-pulse">Menghitung dengan AI...</span>
          ) : (
            <>Mulai Prediksi <ArrowRight size={16} /></>
          )}
        </button>
      </div>

      {/* ── Result ── */}
      {prediction && !isLoading && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="card bg-gradient-to-br from-primary to-primary-hover text-white border-none relative overflow-hidden">
            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/10" />
            <p className="text-xs text-white/80 font-medium mb-1">
              Proyeksi {prediction.projectedWeeks} Minggu ke Depan
            </p>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-xs text-white/60 mb-1">Saat Ini</p>
                <p className="text-2xl font-bold">{currentWeight} <span className="text-sm font-medium">kg</span></p>
              </div>
              
              <div className="flex flex-col items-center pb-1">
                <p className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full mb-1">
                  {prediction.projectedDeltaKg > 0 ? "+" : ""}{prediction.projectedDeltaKg} kg
                </p>
                <ArrowRight size={20} className="text-white/60" />
              </div>

              <div className="text-right">
                <p className="text-xs text-white/60 mb-1">Prediksi</p>
                <p className="text-2xl font-bold">
                  {(currentWeight + prediction.projectedDeltaKg).toFixed(1)} <span className="text-sm font-medium">kg</span>
                </p>
              </div>
            </div>
            
            {targetWeight && (
              <div className="mt-4 pt-3 border-t border-white/20 flex justify-between text-xs">
                <span className="text-white/80">Target Anda:</span>
                <span className="font-bold">{targetWeight} kg</span>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-text-dark flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-warning" /> 
              Analisis AI
            </h3>
            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {prediction.aiInsight}
            </div>
            <p className="text-[10px] text-text-muted mt-4 text-center">
              Dibuat pada: {new Date(prediction.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
