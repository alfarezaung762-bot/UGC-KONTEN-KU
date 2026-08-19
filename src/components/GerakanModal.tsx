"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, Layers } from "lucide-react";
import { GerakanType } from "@/lib/types";

interface GerakanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gerakanData: Partial<GerakanType>) => Promise<void>;
  initialData?: GerakanType | null;
}

export function GerakanModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: GerakanModalProps) {
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    kategori: "A",
    kategoriLabel: "Uji Kenyamanan Bahan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi: "",
    tujuan: "",
    kondisi: "",
    status: "tersedia",
    dipakaiDi: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        kode: initialData.kode,
        nama: initialData.nama,
        kategori: initialData.kategori,
        kategoriLabel: initialData.kategoriLabel,
        tipe: initialData.tipe,
        durasiMin: initialData.durasiMin,
        durasiMax: initialData.durasiMax,
        deskripsi: initialData.deskripsi,
        tujuan: initialData.tujuan || "",
        kondisi: initialData.kondisi || "",
        status: initialData.status,
        dipakaiDi: initialData.dipakaiDi || "",
      });
    } else {
      setFormData({
        kode: "",
        nama: "",
        kategori: "A",
        kategoriLabel: "Uji Kenyamanan Bahan",
        tipe: "UNIVERSAL",
        durasiMin: 2,
        durasiMax: 2,
        deskripsi: "",
        tujuan: "",
        kondisi: "",
        status: "tersedia",
        dipakaiDi: "",
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleKategoriChange = (kat: string) => {
    const labels: Record<string, string> = {
      A: "Uji Kenyamanan Bahan",
      B: "Fitur Fungsional",
      C: "Potongan/Fit Badan",
      D: "Respons Non-Verbal",
      E: "Gerakan Transisi",
      F: "Highlight Visual Khusus",
      KOMP: "Gerakan Komposit",
    };
    setFormData((prev) => ({
      ...prev,
      kategori: kat,
      kategoriLabel: labels[kat] || kat,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kode || !formData.nama || !formData.deskripsi) {
      setError("Kode, Nama Gerakan, dan Deskripsi wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan gerakan.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {initialData ? `Edit Gerakan: ${initialData.kode}` : "Tambah Gerakan Baru"}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-rose-400 border border-rose-500/20 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Kode & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Kode Gerakan *
              </label>
              <input
                type="text"
                required
                disabled={!!initialData}
                value={formData.kode}
                onChange={(e) =>
                  setFormData({ ...formData, kode: e.target.value.toUpperCase() })
                }
                placeholder="misal: A7, B7, D5"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white font-mono uppercase focus:border-blue-500 focus:outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Kategori *
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => handleKategoriChange(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none font-medium"
              >
                <option value="A">A. Uji Bahan</option>
                <option value="B">B. Fitur Fungsional</option>
                <option value="C">C. Fit Badan</option>
                <option value="D">D. Respons Non-Verbal</option>
                <option value="E">E. Gerakan Transisi</option>
                <option value="F">F. Highlight Visual</option>
                <option value="KOMP">KOMP. Gerakan Komposit</option>
              </select>
            </div>
          </div>

          {/* Nama Gerakan */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Nama Gerakan *
            </label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="misal: Pinch Test Kain, Kibas Bahu"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Tipe & Durasi */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Tipe Gerakan
              </label>
              <select
                value={formData.tipe}
                onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="UNIVERSAL">UNIVERSAL</option>
                <option value="KONDISIONAL">KONDISIONAL</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Durasi Min (detik)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.durasiMin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durasiMin: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Durasi Max (detik)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.durasiMax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durasiMax: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Deskripsi Aksi */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Deskripsi & Instruksi Gerakan (untuk Shot Script) *
            </label>
            <textarea
              required
              rows={3}
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi: e.target.value })
              }
              placeholder="Jelaskan gerakan detail: misal Kedua tangan mengelus pundak secara bersamaan..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Tujuan Gerakan */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Tujuan Gerakan
            </label>
            <input
              type="text"
              value={formData.tujuan}
              onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
              placeholder="misal: Menunjukkan elastisitas bahan kain"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Kondisi Syarat (Optional) */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Syarat Fitur Produk (jika kondisional)
            </label>
            <input
              type="text"
              value={formData.kondisi}
              onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
              placeholder="misal: Perlu SAKU, Perlu KERAH, Perlu RESLETING"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
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
              <Save className="h-4 w-4" />
              <span>{loading ? "Menyimpan..." : "Simpan Gerakan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
