"use client";

import React from "react";
import { BookOpen, ShieldCheck, CheckCircle, Layers } from "lucide-react";
import { KATEGORI_CONFIG } from "@/lib/types";

export function RulesetGuideView() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3.5 border-b border-slate-200 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Panduan Ruleset Prompt AI (Minim Halusinasi)
          </h2>
          <p className="text-xs text-slate-500">
            Standar baku untuk menghasilkan prompt video review pakaian AI yang presisi & konsisten
          </p>
        </div>
      </div>

      {/* Critical Rule Highlight (Bootstrap Alert-Primary Style) */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 flex-wrap">
              <span>SISTEM REFERENSI MUTLAK:</span>
              <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-2xs">
                PRODUCT &gt; CREATOR &gt; BACKGROUND
              </span>
            </h3>
            <div className="font-mono text-xs text-slate-800 bg-white p-4 rounded-md border border-blue-200 leading-relaxed shadow-2xs space-y-2">
              <p>
                <strong className="text-blue-700">PRODUCT-ACCURACY:</strong> Gunakan [PRODUCT] sebagai identitas visual utama. Motif, warna, dan tekstur pakaian harus 100% identik dengan foto di setiap shot. Jangan memodifikasi corak.
              </p>
              <p>
                <strong className="text-blue-700">CREATOR-CONSISTENCY:</strong> Gunakan [CREATOR] sebagai model. Wajah, rambut, dan aksesori (kalung/chain) harus konsisten. SILENT, tidak ada gerakan mulut/bicara.
              </p>
              <p>
                <strong className="text-blue-700">ENVIRONMENT-LOCK:</strong> Lokasi video WAJIB berada di dalam [BACKGROUND]. Elemen kunci seperti cermin bulat backlit, dinding beton, dan lighting strips harus terlihat jelas untuk menetapkan lokasi yang konsisten.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Rules Grid (Bootstrap Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gerakan Rule */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 hover:border-blue-400 hover:shadow-xs transition-all">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            1. Aturan Gerakan & Anatomi
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Anatomi manusia normal (5 jari, 2 tangan). Maksimal <strong>satu tangan aktif</strong> menyentuh kain produk secara natural. Kecepatan <strong>real-time</strong>, gerakan non-repetitif.
          </p>
        </div>

        {/* Kamera Rule */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 hover:border-blue-400 hover:shadow-xs transition-all">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            2. Aturan Kamera Handheld
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Fixed shot</strong> dengan micro-shaking handheld organik. Hindari kesan statis tripod mati atau efek green-screen composite buatan.
          </p>
        </div>

        {/* Clean Frame Rule */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 hover:border-blue-400 hover:shadow-xs transition-all">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            3. Clean Frame (Zero Clutter)
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Dilarang keras</strong> menambahkan teks, logo, watermark, musik, audio voiceover, atau elemen UI apapun di dalam frame video.
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-600" />
          Kategori Gerakan dalam Bank Data
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(KATEGORI_CONFIG).map(([key, cat]) => (
            <div
              key={key}
              className="rounded-lg border border-slate-200 bg-white p-4 space-y-1.5 transition-all hover:border-blue-400 hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {cat.label}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {cat.sublabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                {key === "A" && "Uji kenyamanan, elastisitas, remas kain, dan tekstur bahan."}
                {key === "B" && "Tunjukkan saku, tali serut hoodie, lipat cuff, atau rapikan kerah."}
                {key === "C" && "Tarik hem bawah, angkat lengan bebas gerak, dan cek siluet 2 sisi."}
                {key === "D" && "Respons puas tanpa bicara: tarik napas, senyum, usap dada, kibas bahu."}
                {key === "E" && "Transisi natural: langkah kecil ke samping, bungkuk-tegak fleksibel."}
                {key === "F" && "Zoom kamera ke logo, sablon, bordir, atau jahitan kerah samping."}
                {key === "KOMP" && "Rangkaian utuh 10 detik: Putar 360°, Walking Showcase, Review Lengkap."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
