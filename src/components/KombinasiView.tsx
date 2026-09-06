"use client";

import React, { useState, useMemo } from "react";
import {
  BookmarkCheck,
  Clock,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-600 shadow-xs">
              <BookmarkCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Preset Kombinasi Gerakan
              </h2>
              <p className="text-xs text-slate-500">
                Pilih atau simpan rangkaian shot favorit untuk dipakai ulang dengan 1 kali klik
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onSwitchToBuilder}
          className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
        >
          <Sparkles className="h-4 w-4" />
          <span>Buka Prompt Builder</span>
        </button>
      </div>

      {/* Kombinasi Grid */}
      <div className="mt-6">
        {sortedKombinasiList.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <BookmarkCheck className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Belum Ada Preset Tersimpan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              Susun gerakan di <strong>Prompt Builder</strong> lalu klik tombol <strong>"Simpan Preset"</strong> untuk menyimpannya di sini.
            </p>
            <button
              onClick={onSwitchToBuilder}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-xs"
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
                  className="group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 transition-all duration-150 hover:border-blue-400 hover:shadow-sm"
                >
                  <div>
                    {/* Header: Name, Urutan & Target Duration */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="font-mono text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1"
                            title={`Urutan tampilan: ${k.urutan ?? 0}`}
                          >
                            <ArrowDownUp className="h-2.5 w-2.5 text-blue-600" />
                            <span>Urutan #{k.urutan ?? 0}</span>
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {k.nama}
                        </h3>
                        {k.deskripsi && (
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {k.deskripsi}
                          </p>
                        )}
                      </div>

                      <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                        <Clock className="h-3 w-3 text-emerald-600" />
                        {totalSec}s
                      </span>
                    </div>

                    {/* Movement Sequence Chips */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Urutan Shot ({k.gerakanList?.length || 0} Beat):
                      </span>

                      <div className="space-y-1.5">
                        {k.gerakanList?.map((item, idx) => {
                          const g = item.gerakan;
                          if (!g) return null;
                          const dur = item.durasiOverride || g.durasiMin;

                          return (
                            <div
                              key={item.id || idx}
                              className="flex items-center justify-between rounded bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 border border-slate-200"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-slate-400 font-bold">
                                  #{idx + 1}
                                </span>
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  {g.kode}
                                </span>
                                <span className="text-slate-800 text-xs truncate max-w-[140px] font-semibold">
                                  {g.nama}
                                </span>
                              </div>

                              <span className="font-mono text-[11px] text-blue-700 font-bold">
                                {dur}s
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingKombinasi(k)}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                        title="Edit nama & deskripsi preset"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(k.id, k.nama)}
                        disabled={deletingId === k.id}
                        className="rounded p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Hapus preset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onLoadKombinasi(k)}
                      className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all shadow-2xs"
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
