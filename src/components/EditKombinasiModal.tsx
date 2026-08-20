"use client";

import React, { useState, useEffect } from "react";
import { X, BookmarkCheck, AlertCircle, Save, Clock, Layers } from "lucide-react";
import { KombinasiType, KATEGORI_CONFIG } from "@/lib/types";

interface EditKombinasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  kombinasi: KombinasiType | null;
  onSave: (
    id: string,
    data: { nama: string; deskripsi: string | null; targetDurasi?: number; urutan?: number }
  ) => Promise<void>;
}

export function EditKombinasiModal({
  isOpen,
  onClose,
  kombinasi,
  onSave,
}: EditKombinasiModalProps) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [targetDurasi, setTargetDurasi] = useState(10);
  const [urutan, setUrutan] = useState<number | string>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (kombinasi) {
      setNama(kombinasi.nama || "");
      setDeskripsi(kombinasi.deskripsi || "");
      setTargetDurasi(kombinasi.targetDurasi || 10);
      setUrutan(kombinasi.urutan ?? 0);
      setError(null);
    }
  }, [kombinasi, isOpen]);

  if (!isOpen || !kombinasi) return null;

  const totalSeconds =
    kombinasi.gerakanList?.reduce(
      (acc, curr) => acc + (curr.durasiOverride || curr.gerakan?.durasiMin || 2),
      0
    ) || targetDurasi;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama preset kombinasi wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(kombinasi.id, {
        nama: nama.trim(),
        deskripsi: deskripsi.trim() || null,
        targetDurasi: Number(targetDurasi) || totalSeconds,
        urutan: urutan !== "" ? Number(urutan) : 0,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <BookmarkCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Edit Preset Kombinasi
              </h3>
              <p className="text-[11px] text-slate-400">
                Ubah nama atau deskripsi rangkuman preset ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
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

          {/* Preset Shot Info Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 shadow-inner">
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Layers className="h-3.5 w-3.5 text-blue-400" />
                Urutan Shot ({kombinasi.gerakanList?.length || 0} Gerakan)
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                <Clock className="h-3 w-3" />
                {totalSeconds} Detik
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {kombinasi.gerakanList?.map((item, idx) => {
                const g = item.gerakan;
                const cat = g ? KATEGORI_CONFIG[g.kategori] : null;
                return (
                  <span
                    key={item.id || idx}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-900 border border-slate-800 px-2 py-1 text-[11px] text-slate-300 font-mono"
                  >
                    <span className="text-slate-500 font-bold">#{idx + 1}</span>
                    {g && (
                      <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${cat?.badgeBg || "bg-slate-800"}`}>
                        {g.kode}
                      </span>
                    )}
                    <span className="text-slate-200 truncate max-w-[120px]">
                      {g?.nama || "Gerakan"}
                    </span>
                    <span className="text-blue-400 font-semibold">
                      ({item.durasiOverride || g?.durasiMin || 2}s)
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Preset Name */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Nama Preset Kombinasi <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="misal: Try-On Hoodie Santai (10s)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Preset dengan urutan angka lebih kecil (misal: 1, 2, 3...) akan tampil di posisi paling atas/awal.
            </p>
          </div>

          {/* Preset Description */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Deskripsi / Catatan Preset
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Catatan jenis produk yang cocok, panduan shot, atau gaya review yang digunakan..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors leading-relaxed"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Deskripsi ini membantu mengidentifikasi tujuan kombinasi shot untuk produk tertentu.
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
