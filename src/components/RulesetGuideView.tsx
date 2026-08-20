"use client";

import React from "react";
import { BookOpen, ShieldCheck, CheckCircle, AlertTriangle, Sparkles, Layers, Eye } from "lucide-react";
import { KATEGORI_CONFIG } from "@/lib/types";

export function RulesetGuideView() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3.5 border-b border-slate-800 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-md shadow-blue-500/10">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Panduan Ruleset Prompt AI (Minim Halusinasi)
          </h2>
          <p className="text-xs text-slate-400">
            Standar baku untuk menghasilkan prompt video review pakaian AI yang presisi & stabil
          </p>
        </div>
      </div>

      {/* Critical Rule Highlight */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 p-5.5 backdrop-blur-md shadow-xl">
        <div className="flex items-start gap-3.5">
          <ShieldCheck className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Formula Konsistensi Visual 3-Elemen:</span>
              <span className="rounded-full bg-blue-500/20 px-2 py-0.2 text-[10px] font-mono text-blue-300 border border-blue-500/30">
                PRODUK &gt; CREATOR &gt; BACKGROUND
              </span>
            </h3>
            <div className="font-mono text-xs text-slate-200 bg-slate-950/90 p-4 rounded-xl border border-slate-800 leading-relaxed shadow-inner">
              <strong>Background:</strong> [BACKGROUND] lokasi, warna, lighting, dan komposisi environment HARUS konsisten mengikuti foto ini di semua shot. JANGAN berubah drastis (jangan jadi lebih gelap/terang dari foto aslinya, objek/furniture di background jangan berpindah posisi atau berubah bentuk).
              <br /><br />
              <span className="text-emerald-400 font-bold">
                Prioritas jika ada KONFLIK/tabrakan antar elemen: PRODUK &gt; CREATOR &gt; BACKGROUND.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Produk Rule */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 space-y-2 hover:border-blue-500/40 transition-colors">
          <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            1. Aturan Akurasi Produk (100%)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Bentuk, warna, motif, jahitan, kancing/resleting, saku, dan logo wajib sama persis di semua frame. Sisi tidak terlihat dibuat polos/netral konsisten. JANGAN tambah fitur fiktif. Resleting/kancing tetap diam di posisi tertutup — tangan hanya menyentuh area kain di sekitarnya.
          </p>
        </div>

        {/* Creator Rule */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 space-y-2 hover:border-blue-500/40 transition-colors">
          <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            2. Karakter & Wajah (Silent Review)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Wajah, rambut (model & warna), warna kulit, dan postur mengikuti foto referensi. Karakter <strong>diam total, tidak bicara, tidak lipsync</strong>. Mulut diam natural (senyum tipis diperbolehkan tanpa gerak bibir bicara).
          </p>
        </div>

        {/* Anatomi Rule */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 space-y-2 hover:border-blue-500/40 transition-colors">
          <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            3. Anatomi & Satu Tangan Aktif
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            2 tangan dan 2 kaki normal. <strong>Hanya SATU tangan aktif per momen</strong>, KECUALI gestur simetris 2 tangan identik (misal mengelus kedua pundak). Hindari menyentuh area punggung tengah yang tidak wajar dijangkau. Angle belakang gunakan 3/4.
          </p>
        </div>

        {/* Gerakan & Kamera Rule */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 space-y-2 hover:border-blue-500/40 transition-colors">
          <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            4. Kecepatan & Gaya Kamera
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kecepatan <strong>normal/real-time</strong> (BUKAN slow-motion). DILARANG gerakan berulang/joget/ritmis — tiap gestur 1x saja. Kamera FIX/statis dengan micro-shake handheld yang sangat halus agar tidak terlihat green-screen buatan.
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-400" />
          Kategori Gerakan dalam Bank Data
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(KATEGORI_CONFIG).map(([key, cat]) => (
            <div
              key={key}
              className={`rounded-xl border ${cat.border} ${cat.bg} p-4 space-y-1.5 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold ${cat.color}`}>
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-400">
                  {cat.sublabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
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
