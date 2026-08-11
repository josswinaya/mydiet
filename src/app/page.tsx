import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import saladImg from "../../public/images/salad.webp";
import kitchenImg from "../../public/images/kitchen.webp";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-10">

      <div className="px-5 mt-2 flex flex-col gap-6">
        {/* ── Hero Section ── */}
        <div className="bg-white rounded-[32px] overflow-hidden p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-full max-w-[280px] aspect-square relative mb-2 rounded-full overflow-hidden">
             <Image 
               src={saladImg} 
               alt="Healthy Salad Bowl" 
               className="w-full h-full object-cover"
               placeholder="blur"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-4">
            <span className="text-text-dark">Capai Berat Badan</span><br/>
            <span className="text-primary">Ideal dengan Sehat</span>
          </h1>
          <p className="text-[13px] text-text-muted mb-8 leading-relaxed px-2">
            Pantau asupan nutrisi harian Anda dengan mudah. Teknologi AI kami memberikan prediksi akurat untuk membantu Anda mencapai target kesehatan tanpa rasa lapar yang berlebihan.
          </p>
          <Link
            href="/dashboard"
            className="w-full block text-center py-4 rounded-[20px] bg-primary text-white font-semibold shadow-md hover:bg-primary-hover transition-colors"
          >
            Mulai Sekarang
          </Link>
        </div>

        {/* ── Card: Prediksi AI Pintar ── */}
        <div className="bg-[#EAF7DC] rounded-[24px] p-6 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-full text-white text-[10px] font-bold mb-4">
            <Sparkles size={12} />
            Prediksi AI Pintar
          </div>
          <h2 className="text-[18px] font-bold text-text-dark leading-tight mb-2">
            Tahu Masa Depan<br/>Berat Badanmu
          </h2>
          <p className="text-[13px] text-[#414939] leading-relaxed">
            Algoritma cerdas kami menganalisis kebiasaan makan Anda dan memprediksi progres berat badan dalam 30 hari ke depan secara akurat.
          </p>
        </div>

        {/* ── Card: Log Cepat ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm">
          <h2 className="text-[18px] font-semibold text-text-dark mb-2">
            Log Cepat
          </h2>
          <p className="text-[13px] text-[#414939] leading-relaxed">
            Catat apa pun yang Anda makan hanya dengan satu ketukan atau foto makanan Anda.
          </p>
        </div>

        {/* ── Card: Detail Nutrisi ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm">
          <h2 className="text-[18px] font-semibold text-text-dark mb-2">
            Detail Nutrisi
          </h2>
          <p className="text-[13px] text-[#414939] leading-relaxed">
            Bukan hanya kalori. Pantau makro (protein, karbo, lemak) dan mikro nutrisi Anda.
          </p>
        </div>

        {/* ── Testimonial Card ── */}
        <div className="relative rounded-[32px] overflow-hidden p-6 mt-2 shadow-sm h-[320px] flex items-center justify-center">
          <Image 
            src={kitchenImg}
            alt="Kitchen Background"
            className="absolute inset-0 w-full h-full object-cover"
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-[24px] p-6 shadow-lg text-center w-full max-w-[300px]">
            <div className="text-primary text-4xl leading-none font-serif mb-2">"</div>
            <p className="italic font-semibold text-[14px] text-text-dark leading-relaxed mb-6">
              "Berkat MyDiet, saya turun 8kg dalam 3 bulan tanpa merasa sedang diet ketat. Prediksi AI-nya sangat membantu saya tetap termotivasi!"
            </p>
            <p className="font-bold text-primary text-sm mb-0.5">Joshua</p>
            <p className="text-[10px] text-text-secondary">Mahasiswa TI | Founder</p>
          </div>
        </div>

      </div>
    </main>
  );
}
