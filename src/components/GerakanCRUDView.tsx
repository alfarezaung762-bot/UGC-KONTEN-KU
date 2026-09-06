"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  Layers,
  BookmarkCheck,
} from "lucide-react";
import { GerakanType, KombinasiType, KATEGORI_CONFIG } from "@/lib/types";

interface GerakanCRUDViewProps {
  gerakanList: GerakanType[];
  kombinasiList?: KombinasiType[];
  onOpenCreateModal: () => void;
  onOpenEditModal: (gerakan: GerakanType) => void;
  onDeleteGerakan: (id: string) => Promise<void>;
  onUseInBuilder: (gerakan: GerakanType) => void;
}

export function GerakanCRUDView({
  gerakanList,
  kombinasiList = [],
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteGerakan,
  onUseInBuilder,
}: GerakanCRUDViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [comboFilter, setComboFilter] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Map each gerakan to combinations
  const gerakanComboMap = useMemo(() => {
    const map: Record<string, KombinasiType[]> = {};
    if (!kombinasiList || kombinasiList.length === 0) return map;

    kombinasiList.forEach((k) => {
      k.gerakanList?.forEach((item) => {
        const ids = [item.gerakanId, item.gerakan?.id, item.gerakan?.kode].filter(Boolean) as string[];
        ids.forEach((key) => {
          if (!map[key]) map[key] = [];
          if (!map[key].some((existing) => existing.id === k.id)) {
            map[key].push(k);
          }
        });
      });
    });

    return map;
  }, [kombinasiList]);

  const categories = [
    { key: "ALL", label: "Semua Kategori" },
    { key: "A", label: "A. Uji Bahan" },
    { key: "B", label: "B. Fungsional" },
    { key: "C", label: "C. Fit Badan" },
    { key: "D", label: "D. Respons Non-Verbal" },
    { key: "E", label: "E. Transisi" },
    { key: "F", label: "F. Highlight Visual" },
    { key: "KOMP", label: "Gerakan Komposit" },
  ];

  const filtered = useMemo(() => {
    return gerakanList.filter((g) => {
      const matchCat =
        selectedCategory === "ALL" || g.kategori === selectedCategory;

      const combos = gerakanComboMap[g.id] || gerakanComboMap[g.kode] || [];
      const isUsed = combos.length > 0 || !!(g.dipakaiDi && g.dipakaiDi.toLowerCase().includes("prompt"));

      let matchCombo = true;
      if (comboFilter === "USED") matchCombo = isUsed;
      if (comboFilter === "UNUSED") matchCombo = !isUsed;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        g.nama.toLowerCase().includes(q) ||
        g.kode.toLowerCase().includes(q) ||
        g.deskripsi.toLowerCase().includes(q) ||
        (g.kondisi && g.kondisi.toLowerCase().includes(q)) ||
        (g.dipakaiDi && g.dipakaiDi.toLowerCase().includes(q)) ||
        combos.some((c) => c.nama.toLowerCase().includes(q));

      return matchCat && matchCombo && matchSearch;
    });
  }, [gerakanList, selectedCategory, comboFilter, searchQuery, gerakanComboMap]);

  const handleDelete = async (id: string, nama: string) => {
    if (!window.confirm(`Yakin ingin menghapus gerakan "${nama}"?`)) return;
    try {
      setDeletingId(id);
      await onDeleteGerakan(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-600 shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Bank Data Gerakan (CRUD)
              </h2>
              <p className="text-xs text-slate-500">
                Kelola, pantau penggunaan kombinasi, dan sesuaikan gerakan review produk pakaian
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-all shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Gerakan Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="my-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, kode, deskripsi, preset kombinasi..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Combination Status Filter */}
          <select
            value={comboFilter}
            onChange={(e) => setComboFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          >
            <option value="ALL">Semua Status Kombinasi</option>
            <option value="USED">🔖 Sudah Dipakai di Kombinasi</option>
            <option value="UNUSED">🟢 Belum Dipakai (Tersedia)</option>
          </select>
        </div>
      </div>

      {/* Gerakan Table (Bootstrap Table Style) */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3.5">Kode</th>
                <th className="px-4 py-3.5">Nama Gerakan</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Durasi</th>
                <th className="px-4 py-3.5">Tipe & Syarat</th>
                <th className="px-4 py-3.5">Penggunaan Kombinasi</th>
                <th className="px-4 py-3.5">Deskripsi Aksi</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ada gerakan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => {
                  const combos = gerakanComboMap[g.id] || gerakanComboMap[g.kode] || [];

                  return (
                    <tr
                      key={g.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      {/* Kode */}
                      <td className="px-4 py-3 font-mono font-bold">
                        <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs">
                          {g.kode}
                        </span>
                      </td>

                      {/* Nama */}
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <div>{g.nama}</div>
                        {g.tujuan && (
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                            {g.tujuan}
                          </div>
                        )}
                      </td>

                      {/* Kategori */}
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px]">
                          {g.kategoriLabel || g.kategori}
                        </span>
                      </td>

                      {/* Durasi */}
                      <td className="px-4 py-3 font-mono text-blue-700 font-bold">
                        {g.durasiMin === g.durasiMax
                          ? `${g.durasiMin}s`
                          : `${g.durasiMin}-${g.durasiMax}s`}
                      </td>

                      {/* Tipe & Kondisi */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold border w-fit ${
                              g.tipe === "UNIVERSAL"
                                ? "border-emerald-200 text-emerald-800 bg-emerald-50"
                                : "border-amber-200 text-amber-800 bg-amber-50"
                            }`}
                          >
                            {g.tipe}
                          </span>
                          {g.kondisi && (
                            <span className="text-[10px] text-amber-800 font-medium">
                              {g.kondisi}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Kombinasi Label */}
                      <td className="px-4 py-3">
                        {combos.length > 0 ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                              <BookmarkCheck className="h-3 w-3 text-amber-600 shrink-0" />
                              <span>{combos.length} Preset Kombinasi</span>
                            </span>
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {combos.map((c) => (
                                <span
                                  key={c.id}
                                  className="text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 truncate"
                                  title={c.nama}
                                >
                                  {c.nama}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : g.dipakaiDi ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                            <BookmarkCheck className="h-3 w-3 text-amber-600" />
                            <span>{g.dipakaiDi}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>Belum dipakai</span>
                          </span>
                        )}
                      </td>

                      {/* Deskripsi */}
                      <td className="px-4 py-3 max-w-xs text-slate-600 leading-relaxed text-[11px]">
                        {g.deskripsi}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onUseInBuilder(g)}
                            className="rounded bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                            title="Gunakan di builder"
                          >
                            + Gunakan
                          </button>

                          <button
                            onClick={() => onOpenEditModal(g)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="Edit gerakan"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(g.id, g.nama)}
                            disabled={deletingId === g.id}
                            className="rounded p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors disabled:opacity-50"
                            title="Hapus gerakan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
