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
    <div className="flex h-full flex-col bg-[#f8f9fa] p-4 lg:p-6 overflow-y-auto">
      {/* Top Bar: Target Duration Controls & Action Buttons (Bootstrap Card Style) */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Target Duration Selector */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Target Durasi Video:
            </span>
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              {[5, 10, 15, 20, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setTargetDuration(sec)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    targetDuration === sec
                      ? "bg-blue-600 text-white shadow-2xs ring-2 ring-blue-300"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {sec} Detik
                </button>
              ))}
              <div className="flex items-center gap-1.5 ml-1 text-xs text-slate-500 font-medium">
                <span className="text-[11px]">Custom:</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(Math.max(1, parseInt(e.target.value) || 10))}
                  className="w-14 rounded-md border border-slate-300 bg-white px-2 py-1 text-center font-mono text-xs font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
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
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Simpan susunan gerakan ini sebagai preset kombinasi"
            >
              <BookmarkPlus className="h-4 w-4" />
              <span>Simpan Preset</span>
            </button>

            <button
              onClick={onClearTimeline}
              disabled={selectedGerakan.length === 0}
              className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Reset seluruh timeline"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Status Alert */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-slate-700">Total Durasi Gerakan:</span>
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  isOptimal
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : isOver
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                {totalSeconds} / {targetDuration} detik
              </span>
            </div>

            <span className="text-slate-500 font-mono text-xs font-bold">
              {percentage}%
            </span>
          </div>

          {/* Bootstrap Progress Meter Bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOptimal
                  ? "bg-emerald-500"
                  : isOver
                  ? "bg-amber-500"
                  : "bg-blue-600"
              }`}
              style={{ width: `${Math.min(100, (totalSeconds / targetDuration) * 100)}%` }}
            />
          </div>

          {/* Informational Message (Bootstrap Alert Style) */}
          <div className="mt-2.5">
            {isOptimal && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Durasi pas <strong>{targetDuration} detik</strong>! Sempurna untuk footage standalone Flow / Gemini.
                </span>
              </div>
            )}

            {isOver && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Perhatian:</strong> Total durasi ({totalSeconds}s) melebihi target ({targetDuration}s). AI mungkin memadatkan beat, namun prompt tetap dapat dipakai.
                </span>
              </div>
            )}

            {isUnder && (
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>
                  Tersisa <strong>{targetDuration - totalSeconds} detik</strong> untuk mencapai target {targetDuration}s.
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  (Tambahkan gerakan dari Bank Gerakan di sebelah kiri)
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
            <Layers className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Susunan Timeline Video</h3>
            <span className="rounded-full bg-blue-100 border border-blue-200 px-2 py-0.5 text-xs font-bold text-blue-800">
              {selectedGerakan.length} Shot
            </span>
          </div>

          {selectedGerakan.length > 0 && (
            <span className="text-xs text-slate-500 font-medium">
              Gunakan tombol panah untuk mengatur urutan beat
            </span>
          )}
        </div>

        {selectedGerakan.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-blue-600 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-1">
              Timeline Masih Kosong
            </h4>
            <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
              Pilih gerakan dari <strong>Bank Gerakan</strong> di sidebar kiri, atau klik salah satu preset rekomendasi di bawah untuk langsung mencoba.
            </p>

            {/* Quick Presets */}
            <div className="w-full max-w-lg space-y-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block text-center">
                ⚡ Coba Preset Rekomendasi Cepat:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => onLoadPreset("PROMPT_1")}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 hover:border-blue-400 hover:bg-white transition-all text-left group shadow-2xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      🌟 Review Pundak + Kerah (10s)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      A2 + B4 + C4 + C1 (4 beat pas 10s)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>

                <button
                  onClick={() => onLoadPreset("PROMPT_2")}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 hover:border-blue-400 hover:bg-white transition-all text-left group shadow-2xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      🧥 Saku + Fit + Respons (10s)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      C4 + B1 + C3 + D1 (10s)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>

                <button
                  onClick={() => onLoadPreset("PROMPT_3")}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 hover:border-blue-400 hover:bg-white transition-all text-left group shadow-2xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      🔍 Detail Tekstur + Shrug (7s)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      A3 + A4 + D4 (Detail bahan)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>

                <button
                  onClick={() => onLoadPreset("PROMPT_6")}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 hover:border-blue-400 hover:bg-white transition-all text-left group shadow-2xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      <span>360 Spin Showcase (10s)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      KOMP1 (1 take 360 view produk)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* List of Timeline Items */
          <div className="space-y-2.5">
            {itemsWithTime.map((item, index) => {
              const g = item.gerakan;

              return (
                <div
                  key={item.uid}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 transition-all hover:border-blue-400 hover:shadow-xs"
                >
                  {/* Left: Shot Number, Time Badge & Gerakan Info */}
                  <div className="flex items-start sm:items-center gap-3 flex-1">
                    {/* Shot Index Pill */}
                    <div className="flex flex-col items-center justify-center rounded-md bg-slate-50 border border-slate-200 px-2.5 py-1.5 font-mono text-center min-w-[54px] shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Shot {index + 1}
                      </span>
                      <span className="text-xs font-bold text-blue-700">
                        {item.timeRange}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {g.kode}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {g.nama}
                        </h4>
                        {g.kondisi && (
                          <span className="text-[10px] text-amber-800 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {g.kondisi}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-1">
                        {g.deskripsi}
                      </p>
                    </div>
                  </div>

                  {/* Right: Duration Adjuster & Reorder & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Duration Stepper */}
                    <div className="flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200 p-0.5">
                      <button
                        onClick={() => onUpdateDuration(item.uid, Math.max(1, item.durasi - 1))}
                        disabled={item.durasi <= 1}
                        className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Kurangi 1 detik"
                      >
                        -
                      </button>

                      <span className="min-w-[34px] text-center font-mono text-xs font-bold text-slate-900">
                        {item.durasi}s
                      </span>

                      <button
                        onClick={() => onUpdateDuration(item.uid, item.durasi + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
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
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Geser ke atas"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onMoveDown(index)}
                        disabled={index === selectedGerakan.length - 1}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Geser ke bawah"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => onRemoveGerakan(item.uid)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 transition-all"
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
