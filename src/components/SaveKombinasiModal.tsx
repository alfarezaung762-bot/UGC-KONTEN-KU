"use client";

import React, { useState } from "react";
import { X, BookmarkCheck, AlertCircle, Sparkles } from "lucide-react";
import { SelectedGerakan } from "@/lib/types";

interface SaveKombinasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGerakan: SelectedGerakan[];
  targetDuration: number;
  onSaveSuccess: () => void;
}

export function SaveKombinasiModal({
  isOpen,
  onClose,
  selectedGerakan,
  targetDuration,
  onSaveSuccess,
}: SaveKombinasiModalProps) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [urutan, setUrutan] = useState<number | string>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSeconds = selectedGerakan.reduce((acc, curr) => acc + curr.durasi, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama preset kombinasi wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/kombinasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: nama.trim(),
          deskripsi: deskripsi.trim() || null,
          targetDurasi: targetDuration,
          urutan: urutan !== "" ? Number(urutan) : 0,
          gerakanItems: selectedGerakan.map((item) => ({
            gerakanId: item.gerakan.id,
            durasi: item.durasi,
          })),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Gagal menyimpan kombinasi");
      }

      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <BookmarkCheck className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Simpan Preset Kombinasi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Summary Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 shadow-inner">
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-2">
              <span>Ringkasan Rangkaian:</span>
              <span className="font-mono text-blue-400 font-bold">
                {totalSeconds} Detik ({selectedGerakan.length} Shot)
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedGerakan.map((item, idx) => (
                <span
                  key={item.uid}
                  className="rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[11px] text-slate-300 font-mono"
                >
                  {idx + 1}. {item.gerakan.kode} ({item.durasi}s)
                </span>
              ))}
            </div>
          </div>

          {/* Preset Name */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Nama Preset Kombinasi *
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="misal: Try-On Hoodie Santai (10s), Pamer Zipper & Fit"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Preset Urutan (Sort Order) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold block">
                Urutan Tampilan Preset
              </label>
              <span className="text-[10px] text-blue-400 font-mono">
                Semakin kecil = semakin atas
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={urutan}
              onChange={(e) => setUrutan(e.target.value)}
              placeholder="1"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white text-xs focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Preset dengan urutan angka lebih kecil (misal: 1, 2, 3...) akan tampil di posisi paling atas/awal.
            </p>
          </div>

          {/* Preset Description */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Deskripsi Singkat (opsional)
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Catatan jenis produk yang cocok, suasana, atau gaya review..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition-all shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? "Menyimpan..." : "Simpan Preset"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
