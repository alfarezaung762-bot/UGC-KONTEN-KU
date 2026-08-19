"use client";

import React from "react";
import {
  Clock,
  Trash2,
  BookmarkPlus,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
} from "lucide-react";
import { SelectedGerakan, KATEGORI_CONFIG } from "@/lib/types";

interface BuilderCanvasProps {
  selectedGerakan: SelectedGerakan[];
  targetDuration: number;
  setTargetDuration: (dur: number) => void;
  onUpdateDuration: (uid: string, newDuration: number) => void;
  onRemoveGerakan: (uid: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onClearTimeline: () => void;
  onOpenSaveModal: () => void;
  onLoadPreset: (presetType: string) => void;
}

export function BuilderCanvas({
  selectedGerakan,
  targetDuration,
  setTargetDuration,
  onUpdateDuration,
  onRemoveGerakan,
  onMoveUp,
  onMoveDown,
  onClearTimeline,
  onOpenSaveModal,
  onLoadPreset,
}: BuilderCanvasProps) {
  const totalSeconds = selectedGerakan.reduce((acc, curr) => acc + curr.durasi, 0);
  const percentage = Math.min(100, Math.round((totalSeconds / targetDuration) * 100));

  const isOptimal = totalSeconds === targetDuration;
  const isOver = totalSeconds > targetDuration;
  const isUnder = totalSeconds < targetDuration;

  // Compute live timestamp ranges
  let accumulatedSeconds = 0;
  const itemsWithTime = selectedGerakan.map((item) => {
    const start = accumulatedSeconds;
    const end = accumulatedSeconds + item.durasi;
    accumulatedSeconds = end;
    return {
      ...item,
      timeRange: `${start}-${end}s`,
      start,
      end,
    };
  });

  return (
    <div className="flex h-full flex-col bg-slate-950/40 p-4 lg:p-6 overflow-y-auto">
      {/* Top Bar: Target Duration Controls & Action Buttons */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Target Duration Selector */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Target Durasi Video:
            </span>
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              {[5, 10, 15, 20, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setTargetDuration(sec)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    targetDuration === sec
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40"
                      : "bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {sec} Detik
                </button>
              ))}
              <div className="flex items-center gap-1.5 ml-1 text-xs text-slate-400">
                <span className="text-[11px]">Custom:</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(Math.max(1, parseInt(e.target.value) || 10))}
                  className="w-14 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-center font-mono text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="font-mono text-[11px]">s</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSaveModal}
              disabled={selectedGerakan.length === 0}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Simpan susunan gerakan ini sebagai preset kombinasi"
            >
              <BookmarkPlus className="h-4 w-4" />
              <span>Simpan Preset</span>
            </button>

            <button
              onClick={onClearTimeline}
              disabled={selectedGerakan.length === 0}
              className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-400 border border-slate-800 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Reset seluruh timeline"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Status Alert */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">Total Durasi Gerakan:</span>
              <span
                className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md ${
                  isOptimal
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : isOver
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                }`}
              >
                {totalSeconds} / {targetDuration} detik
              </span>
            </div>

            <span className="text-slate-400 font-mono text-xs font-semibold">
              {percentage}%
            </span>
          </div>

          {/* Meter Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOptimal
                  ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                  : isOver
                  ? "bg-gradient-to-r from-amber-400 to-rose-500 shadow-sm shadow-amber-400/50"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/40"
              }`}
              style={{ width: `${Math.min(100, (totalSeconds / targetDuration) * 100)}%` }}
            />
          </div>

          {/* Informational Message */}
          <div className="mt-2.5">
            {isOptimal && (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  Durasi pas <strong>{targetDuration} detik</strong>! Pas untuk Flow / Gemini standalone footage.
                </span>
              </div>
            )}

            {isOver && (
              <div className="flex items-center gap-2 text-xs font-medium text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Perhatian:</strong> Total durasi ({totalSeconds}s) melebihi target ({targetDuration}s). Model video AI mungkin memadatkan beat atau memotong shot terakhir, tetapi <strong>prompt tetap siap diexport & dapat digunakan</strong>.
                </span>
              </div>
            )}

            {isUnder && (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Tersisa <strong>{targetDuration - totalSeconds} detik</strong> untuk mencapai target {targetDuration}s.
                </span>
                <span className="text-[11px] text-slate-500 italic">
                  (Tambahkan gerakan dari sidebar di sebelah kiri)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Movements Timeline */}
      <div className="mt-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Susunan Timeline Video</h3>
            <span className="rounded-full bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 text-xs font-bold text-blue-400">
              {selectedGerakan.length} Shot
            </span>
          </div>

          {selectedGerakan.length > 0 && (
            <span className="text-xs text-slate-400">
              Gunakan tombol panah untuk mengatur urutan
            </span>
          )}
        </div>

        {selectedGerakan.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/30 p-8 sm:p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
              <Sparkles className="h-7 w-7 animate-pulse" />
            </div>

            <h4 className="text-base font-bold text-white mb-1">
              Timeline Masih Kosong
            </h4>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              Pilih gerakan dari <strong>Bank Gerakan</strong> di sidebar kiri, atau klik salah satu preset rekomendasi di bawah untuk langsung mencoba.
            </p>

            {/* Quick Presets */}
            <div className="w-full max-w-lg space-y-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                ⚡ Coba Preset Rekomendasi Cepat:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => onLoadPreset("PROMPT_1")}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs text-slate-200 hover:border-blue-500/50 hover:bg-slate-850 transition-all text-left group shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      🌟 Review Pundak + Kerah (10s)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      A2 + B4 + C4 + C1 (4 beat pas 10s)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </button>

                <button
                  onClick={() => onLoadPreset("PROMPT_2")}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs text-slate-200 hover:border-blue-500/50 hover:bg-slate-850 transition-all text-left group shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      🧥 Saku + Fit + Respons (10s)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      C4 + B1 + C3 + D1 + D3 (10s)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </button>

                <button
                  onClick={() => onLoadPreset("PROMPT_3")}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs text-slate-200 hover:border-blue-500/50 hover:bg-slate-850 transition-all text-left group shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      🔍 Detail Tekstur + Shrug (7s)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      A3 + A4 + D4 (Detail bahan)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </button>

                <button
                  onClick={() => onLoadPreset("PROMPT_6")}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs text-slate-200 hover:border-blue-500/50 hover:bg-slate-850 transition-all text-left group shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-400" />
                      <span>360 Spin Showcase (10s)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      KOMP1 (1 take 360 view produk)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* List of Timeline Items */
          <div className="space-y-3">
            {itemsWithTime.map((item, index) => {
              const g = item.gerakan;
              const catConfig = KATEGORI_CONFIG[g.kategori] || {
                badgeBg: "bg-slate-800 text-slate-300",
                border: "border-slate-800",
                bg: "bg-slate-900/70",
              };

              return (
                <div
                  key={item.uid}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800/90 bg-slate-900/80 p-4 transition-all hover:border-blue-500/50 hover:bg-slate-900 shadow-md backdrop-blur-sm"
                >
                  {/* Left: Shot Number, Time Badge & Gerakan Info */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1">
                    {/* Shot Index Pill */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 font-mono text-center min-w-[58px] shrink-0 shadow-inner">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Shot {index + 1}
                      </span>
                      <span className="text-xs font-bold text-blue-400">
                        {item.timeRange}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${catConfig.badgeBg}`}
                        >
                          {g.kode}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {g.nama}
                        </h4>
                        {g.kondisi && (
                          <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {g.kondisi}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-1">
                        {g.deskripsi}
                      </p>
                    </div>
                  </div>

                  {/* Right: Duration Adjuster & Reorder & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    {/* Duration Stepper */}
                    <div className="flex items-center gap-1 rounded-xl bg-slate-950 border border-slate-800 p-1 shadow-inner">
                      <button
                        onClick={() => onUpdateDuration(item.uid, Math.max(1, item.durasi - 1))}
                        disabled={item.durasi <= 1}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Kurangi 1 detik"
                      >
                        -
                      </button>

                      <span className="min-w-[38px] text-center font-mono text-xs font-bold text-white">
                        {item.durasi}s
                      </span>

                      <button
                        onClick={() => onUpdateDuration(item.uid, item.durasi + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                        title="Tambah 1 detik"
                      >
                        +
                      </button>
                    </div>

                    {/* Move Up / Down Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onMoveUp(index)}
                        disabled={index === 0}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                        title="Geser ke atas"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onMoveDown(index)}
                        disabled={index === selectedGerakan.length - 1}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                        title="Geser ke bawah"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => onRemoveGerakan(item.uid)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
                      title="Hapus dari timeline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
