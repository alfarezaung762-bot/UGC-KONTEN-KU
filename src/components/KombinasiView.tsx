"use client";

import React, { useState, useMemo } from "react";
import {
  BookmarkCheck,
  Clock,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
  Layers,
  Calendar,
  ArrowDownUp,
} from "lucide-react";
import { KombinasiType, KATEGORI_CONFIG } from "@/lib/types";
import { EditKombinasiModal } from "./EditKombinasiModal";

interface KombinasiViewProps {
  kombinasiList: KombinasiType[];
  onLoadKombinasi: (kombinasi: KombinasiType) => void;
  onDeleteKombinasi: (id: string) => Promise<void>;
  onUpdateKombinasi?: (
    id: string,
    data: { nama: string; deskripsi: string | null; targetDurasi?: number; urutan?: number }
  ) => Promise<void>;
  onSwitchToBuilder: () => void;
}

export function KombinasiView({
  kombinasiList,
  onLoadKombinasi,
  onDeleteKombinasi,
  onUpdateKombinasi,
  onSwitchToBuilder,
}: KombinasiViewProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingKombinasi, setEditingKombinasi] = useState<KombinasiType | null>(null);

  // Urutkan kombinasi: urutan semakin rendah (1, 2, 3...) semakin ke atas / awal
  const sortedKombinasiList = useMemo(() => {
    return [...kombinasiList].sort((a, b) => {
      const orderA = a.urutan !== undefined && a.urutan !== null ? a.urutan : 999;
      const orderB = b.urutan !== undefined && b.urutan !== null ? b.urutan : 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [kombinasiList]);

  const handleDelete = async (id: string, nama: string) => {
    if (!window.confirm(`Hapus preset kombinasi "${nama}"?`)) return;
    try {
      setDeletingId(id);
      await onDeleteKombinasi(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (
    id: string,
    data: { nama: string; deskripsi: string | null; targetDurasi?: number; urutan?: number }
  ) => {
    if (onUpdateKombinasi) {
      await onUpdateKombinasi(id, data);
    }
  };


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 text-blue-400 shadow-sm">
              <BookmarkCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Preset Kombinasi Gerakan
              </h2>
              <p className="text-xs text-slate-400">
                Pilih atau simpan rangkaian shot favorit untuk dipakai ulang dengan 1 kali klik
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onSwitchToBuilder}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/30"
        >
          <Sparkles className="h-4 w-4" />
          <span>Buka Prompt Builder</span>
        </button>
      </div>

      {/* Kombinasi Grid */}
      <div className="mt-8">
        {sortedKombinasiList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
            <BookmarkCheck className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              Belum Ada Preset Tersimpan
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              Susun gerakan di <strong>Prompt Builder</strong> lalu klik tombol <strong>"Simpan Preset"</strong> untuk menyimpannya di sini.
            </p>
            <button
              onClick={onSwitchToBuilder}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20"
            >
              Mulai Susun Gerakan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedKombinasiList.map((k) => {
              const totalSec = k.gerakanList?.reduce(
                (acc, curr) => acc + (curr.durasiOverride || curr.gerakan?.durasiMin || 2),
                0
              ) || k.targetDurasi;

              return (
                <div
                  key={k.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 transition-all duration-200 hover:border-blue-500/50 hover:bg-slate-900 shadow-xl backdrop-blur-md"
                >
                  <div>
                    {/* Header: Name, Urutan & Target Duration */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="font-mono text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm"
                            title={`Urutan tampilan: ${k.urutan ?? 0}`}
                          >
                            <ArrowDownUp className="h-2.5 w-2.5 text-amber-400" />
                            <span>Urutan #{k.urutan ?? 0}</span>
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {k.nama}
                        </h3>
                        {k.deskripsi && (
                          <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                            {k.deskripsi}
                          </p>
                        )}
                      </div>

                      <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg shrink-0">
                        <Clock className="h-3 w-3 text-emerald-400" />
                        {totalSec}s
                      </span>
                    </div>

                    {/* Movement Sequence Chips */}
                    <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Urutan Shot ({k.gerakanList?.length || 0} Beat):
                      </span>

                      <div className="space-y-1.5">
                        {k.gerakanList?.map((item, idx) => {
                          const g = item.gerakan;
                          if (!g) return null;
                          const dur = item.durasiOverride || g.durasiMin;
                          const catConfig = KATEGORI_CONFIG[g.kategori] || {
                            badgeBg: "bg-slate-800 text-slate-300",
                          };

                          return (
                            <div
                              key={item.id || idx}
                              className="flex items-center justify-between rounded-lg bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-300 border border-slate-800/60"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-slate-400 font-semibold">
                                  #{idx + 1}
                                </span>
                                <span
                                  className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${catConfig.badgeBg}`}
                                >
                                  {g.kode}
                                </span>
                                <span className="text-slate-200 text-xs truncate max-w-[140px] font-medium">
                                  {g.nama}
                                </span>
                              </div>

                              <span className="font-mono text-[11px] text-blue-400 font-semibold">
                                {dur}s
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingKombinasi(k)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                        title="Edit nama & deskripsi preset"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(k.id, k.nama)}
                        disabled={deletingId === k.id}
                        className="rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                        title="Hapus preset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onLoadKombinasi(k)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-500/20"
                    >
                      <span>Gunakan Preset</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditKombinasiModal
        isOpen={Boolean(editingKombinasi)}
        onClose={() => setEditingKombinasi(null)}
        kombinasi={editingKombinasi}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
