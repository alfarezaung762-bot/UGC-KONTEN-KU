"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  Clock,
  Layers,
  Sparkles,
  Tag,
  BookmarkCheck,
  CheckCircle2,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Bank Data Gerakan (CRUD)
              </h2>
              <p className="text-xs text-slate-400">
                Kelola, pantau penggunaan kombinasi, dan sesuaikan gerakan review produk pakaian
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Gerakan Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="my-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, kode, deskripsi, preset kombinasi..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 focus:border-blue-500 focus:outline-none"
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
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-amber-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">Semua Status Kombinasi</option>
            <option value="USED">🔖 Sudah Dipakai di Kombinasi</option>
            <option value="UNUSED">🟢 Belum Dipakai (Tersedia)</option>
          </select>
        </div>
      </div>

      {/* Gerakan Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold uppercase text-slate-400">
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
            <tbody className="divide-y divide-slate-800/60 font-normal">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ada gerakan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => {
                  const catConfig = KATEGORI_CONFIG[g.kategori] || {
                    badgeBg: "bg-slate-800 text-slate-300",
                    border: "border-slate-800",
                  };

                  const combos = gerakanComboMap[g.id] || gerakanComboMap[g.kode] || [];

                  return (
                    <tr
                      key={g.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Kode */}
                      <td className="px-4 py-3 font-mono font-bold">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${catConfig.badgeBg}`}
                        >
                          {g.kode}
                        </span>
                      </td>

                      {/* Nama */}
                      <td className="px-4 py-3 font-semibold text-white">
                        <div>{g.nama}</div>
                        {g.tujuan && (
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                            {g.tujuan}
                          </div>
                        )}
                      </td>

                      {/* Kategori */}
                      <td className="px-4 py-3 text-slate-400">
                        <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px]">
                          {g.kategoriLabel || g.kategori}
                        </span>
                      </td>

                      {/* Durasi */}
                      <td className="px-4 py-3 font-mono text-blue-400 font-medium">
                        {g.durasiMin === g.durasiMax
                          ? `${g.durasiMin}s`
                          : `${g.durasiMin}-${g.durasiMax}s`}
                      </td>

                      {/* Tipe & Kondisi */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium border w-fit ${
                              g.tipe === "UNIVERSAL"
                                ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                                : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                            }`}
                          >
                            {g.tipe}
                          </span>
                          {g.kondisi && (
                            <span className="text-[10px] text-amber-300 font-mono">
                              {g.kondisi}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Kombinasi Label */}
                      <td className="px-4 py-3">
                        {combos.length > 0 ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                              <BookmarkCheck className="h-3 w-3 text-amber-400 shrink-0" />
                              <span>{combos.length} Preset Kombinasi</span>
                            </span>
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {combos.map((c) => (
                                <span
                                  key={c.id}
                                  className="text-[10px] text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 truncate"
                                  title={c.nama}
                                >
                                  {c.nama}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : g.dipakaiDi ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                            <BookmarkCheck className="h-3 w-3" />
                            <span>{g.dipakaiDi}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            <span>Belum dipakai</span>
                          </span>
                        )}
                      </td>

                      {/* Deskripsi */}
                      <td className="px-4 py-3 max-w-xs text-slate-300 leading-relaxed text-[11px]">
                        {g.deskripsi}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onUseInBuilder(g)}
                            className="rounded-lg bg-blue-600/20 px-2.5 py-1 text-[11px] font-semibold text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all"
                            title="Gunakan di builder"
                          >
                            + Gunakan
                          </button>

                          <button
                            onClick={() => onOpenEditModal(g)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            title="Edit gerakan"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(g.id, g.nama)}
                            disabled={deletingId === g.id}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
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
