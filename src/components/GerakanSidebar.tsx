"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
  BookmarkCheck,
  Sparkle,
} from "lucide-react";
import { GerakanType, KombinasiType, SelectedGerakan, KATEGORI_CONFIG } from "@/lib/types";

interface GerakanSidebarProps {
  gerakanList: GerakanType[];
  kombinasiList?: KombinasiType[];
  selectedGerakan?: SelectedGerakan[];
  onAddGerakan: (gerakan: GerakanType) => void;
  onOpenCreateModal: () => void;
  onLoadKombinasi?: (kombinasi: KombinasiType) => void;
  selectedCount?: number;
}

export function GerakanSidebar({
  gerakanList,
  kombinasiList = [],
  selectedGerakan = [],
  onAddGerakan,
  onOpenCreateModal,
  onLoadKombinasi,
}: GerakanSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [comboFilter, setComboFilter] = useState<"ALL" | "USED" | "UNUSED" | "TIMELINE">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Map each gerakan to the combinations it belongs to
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

  // Track counts in the active timeline
  const timelineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!selectedGerakan) return counts;
    selectedGerakan.forEach((item) => {
      const id = item.gerakan.id;
      const kode = item.gerakan.kode;
      counts[id] = (counts[id] || 0) + 1;
      counts[kode] = (counts[kode] || 0) + 1;
    });
    return counts;
  }, [selectedGerakan]);

  const categories = useMemo(() => {
    return [
      { key: "ALL", label: "Semua" },
      { key: "A", label: "A. Bahan" },
      { key: "B", label: "B. Fungsional" },
      { key: "C", label: "C. Fit" },
      { key: "D", label: "D. Respons" },
      { key: "E", label: "E. Transisi" },
      { key: "F", label: "F. Highlight" },
      { key: "KOMP", label: "Komposit" },
    ];
  }, []);

  // Stats for combination usage
  const comboStats = useMemo(() => {
    let usedCount = 0;
    let unusedCount = 0;
    let inTimelineCount = 0;

    gerakanList.forEach((g) => {
      const combos = gerakanComboMap[g.id] || gerakanComboMap[g.kode] || [];
      const isUsed = combos.length > 0 || !!(g.dipakaiDi && g.dipakaiDi.toLowerCase().includes("prompt"));
      if (isUsed) usedCount++;
      else unusedCount++;

      if ((timelineCounts[g.id] || 0) > 0) inTimelineCount++;
    });

    return { usedCount, unusedCount, inTimelineCount };
  }, [gerakanList, gerakanComboMap, timelineCounts]);

  const filteredGerakan = useMemo(() => {
    return gerakanList.filter((g) => {
      const matchesCategory =
        selectedCategory === "ALL" || g.kategori === selectedCategory;

      const matchesType =
        filterType === "ALL" || g.tipe === filterType;

      const combos = gerakanComboMap[g.id] || gerakanComboMap[g.kode] || [];
      const isUsedInCombo = combos.length > 0 || !!(g.dipakaiDi && g.dipakaiDi.toLowerCase().includes("prompt"));
      const inTimeline = (timelineCounts[g.id] || 0) > 0;

      let matchesComboStatus = true;
      if (comboFilter === "USED") {
        matchesComboStatus = isUsedInCombo;
      } else if (comboFilter === "UNUSED") {
        matchesComboStatus = !isUsedInCombo;
      } else if (comboFilter === "TIMELINE") {
        matchesComboStatus = inTimeline;
      }

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        g.nama.toLowerCase().includes(q) ||
        g.kode.toLowerCase().includes(q) ||
        g.deskripsi.toLowerCase().includes(q) ||
        (g.kondisi && g.kondisi.toLowerCase().includes(q)) ||
        (g.dipakaiDi && g.dipakaiDi.toLowerCase().includes(q)) ||
        combos.some((c) => c.nama.toLowerCase().includes(q));

      return matchesCategory && matchesType && matchesComboStatus && matchesSearch;
    });
  }, [gerakanList, selectedCategory, filterType, comboFilter, searchQuery, gerakanComboMap, timelineCounts]);

  const handleAdd = (g: GerakanType) => {
    onAddGerakan(g);
    setJustAddedId(g.id);
    setTimeout(() => setJustAddedId(null), 800);
  };

  return (
    <div className="flex h-full flex-col border-r border-slate-800 bg-slate-950/60">
      {/* Header with Search & Add Gerakan Button */}
      <div className="border-b border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Bank Gerakan</h2>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
              {filteredGerakan.length}
            </span>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600/20 px-2.5 py-1.5 text-xs font-medium text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
            title="Tambah gerakan custom baru ke database"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Gerakan Baru</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, kode, atau preset kombinasi..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-xs text-slate-500 hover:text-slate-300"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Kombinasi Filter Pills */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase text-slate-400">
            <span>Status Kombinasi:</span>
            <span className="text-[10px] text-amber-400 font-normal">
              {kombinasiList.length} Preset Tersimpan
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setComboFilter("ALL")}
              className={`rounded px-1.5 py-1 text-[10px] font-medium transition-all text-center ${
                comboFilter === "ALL"
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              Semua ({gerakanList.length})
            </button>

            <button
              onClick={() => setComboFilter("USED")}
              className={`rounded px-1.5 py-1 text-[10px] font-medium transition-all text-center flex items-center justify-center gap-1 ${
                comboFilter === "USED"
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "bg-slate-900 text-amber-400/90 border border-amber-500/20 hover:bg-amber-500/10"
              }`}
              title="Gerakan yang sudah dipakai di preset kombinasi"
            >
              <BookmarkCheck className="h-3 w-3" />
              <span>Di Kombinasi ({comboStats.usedCount})</span>
            </button>

            <button
              onClick={() => setComboFilter("UNUSED")}
              className={`rounded px-1.5 py-1 text-[10px] font-medium transition-all text-center flex items-center justify-center gap-1 ${
                comboFilter === "UNUSED"
                  ? "bg-emerald-600 text-white font-semibold shadow-sm"
                  : "bg-slate-900 text-emerald-400/90 border border-emerald-500/20 hover:bg-emerald-500/10"
              }`}
              title="Gerakan yang belum dipakai di kombinasi (tersedia untuk preset baru)"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Belum ({comboStats.unusedCount})</span>
            </button>

            <button
              onClick={() => setComboFilter("TIMELINE")}
              className={`rounded px-1.5 py-1 text-[10px] font-medium transition-all text-center flex items-center justify-center gap-1 ${
                comboFilter === "TIMELINE"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "bg-slate-900 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/10"
              }`}
              title="Gerakan yang ada di susunan timeline saat ini"
            >
              <Sparkle className="h-3 w-3" />
              <span>Timeline ({comboStats.inTimelineCount})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/60">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-slate-900/80 text-slate-400 border border-slate-800/80 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sub-filter: Universal vs Kondisional */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Tipe Gerakan:</span>
          <div className="flex items-center gap-1">
            {["ALL", "UNIVERSAL", "KONDISIONAL"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded px-1.5 py-0.5 text-[10px] uppercase transition-all ${
                  filterType === t
                    ? "bg-slate-700 text-white font-semibold"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "ALL" ? "Semua" : t.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gerakan List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredGerakan.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center">
            <p className="text-xs text-slate-400">Tidak ada gerakan yang cocok dengan filter saat ini.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setFilterType("ALL");
                setComboFilter("ALL");
              }}
              className="mt-2 text-xs text-blue-400 hover:underline"
            >
              Reset semua filter
            </button>
          </div>
        ) : (
          filteredGerakan.map((g) => {
            const catConfig = KATEGORI_CONFIG[g.kategori] || {
              color: "text-slate-300",
              bg: "bg-slate-800/50",
              border: "border-slate-700/50",
              badgeBg: "bg-slate-800 text-slate-300",
            };

            const isExpanded = expandedId === g.id;
            const isJustAdded = justAddedId === g.id;

            const combos = gerakanComboMap[g.id] || gerakanComboMap[g.kode] || [];
            const timelineCount = timelineCounts[g.id] || timelineCounts[g.kode] || 0;
            const hasCombinations = combos.length > 0 || !!(g.dipakaiDi && g.dipakaiDi.toLowerCase().includes("prompt"));

            return (
              <div
                key={g.id}
                className={`group relative rounded-xl border ${
                  hasCombinations ? "border-amber-500/30" : catConfig.border
                } ${catConfig.bg} p-3 transition-all hover:border-blue-500/40 hover:shadow-md hover:shadow-black/20 ${
                  isJustAdded ? "ring-2 ring-emerald-500 bg-emerald-500/10" : ""
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${catConfig.badgeBg}`}
                      >
                        {g.kode}
                      </span>
                      <h3 className="text-xs font-semibold text-white leading-tight">
                        {g.nama}
                      </h3>
                    </div>

                    <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-blue-400 font-medium">
                        <Clock className="h-3 w-3" />
                        {g.durasiMin === g.durasiMax
                          ? `${g.durasiMin}s`
                          : `${g.durasiMin}-${g.durasiMax}s`}
                      </span>

                      <span
                        className={`text-[10px] px-1 py-0.2 rounded border ${
                          g.tipe === "UNIVERSAL"
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {g.tipe}
                      </span>

                      {g.kondisi && (
                        <span className="text-[10px] text-amber-300/90 font-mono">
                          • {g.kondisi}
                        </span>
                      )}
                    </div>

                    {/* Kombinasi & Timeline Status Label */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {combos.length > 0 ? (
                        <span
                          className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300 shadow-sm"
                          title={`Dipakai di preset kombinasi: ${combos.map((c) => c.nama).join(", ")}`}
                        >
                          <BookmarkCheck className="h-3 w-3 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[190px]">
                            {combos.length === 1
                              ? `Kombinasi: ${combos[0].nama}`
                              : `${combos.length} Kombinasi: ${combos.map((c) => c.nama).join(", ")}`}
                          </span>
                        </span>
                      ) : g.dipakaiDi ? (
                        <span
                          className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300"
                          title={g.dipakaiDi}
                        >
                          <BookmarkCheck className="h-3 w-3 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[190px]">Dipakai: {g.dipakaiDi}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                          <span>Belum di Kombinasi</span>
                        </span>
                      )}

                      {timelineCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/20 border border-blue-500/40 px-1.5 py-0.5 text-[10px] font-bold text-blue-300 animate-pulse">
                          <Sparkles className="h-2.5 w-2.5 text-blue-400" />
                          <span>Timeline ({timelineCount}x)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to timeline Button */}
                  <button
                    onClick={() => handleAdd(g)}
                    className={`flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium transition-all shrink-0 ${
                      isJustAdded
                        ? "bg-emerald-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-sm shadow-blue-500/20"
                    }`}
                    title="Tambah ke timeline prompt builder"
                  >
                    {isJustAdded ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="text-[10px]">Ditambah</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span className="text-[10px]">Pilih</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Short Description */}
                <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {g.deskripsi}
                </p>

                {/* Expand Toggle */}
                <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1 truncate max-w-[190px]">
                    <Tag className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                    {combos.length > 0 ? (
                      <span className="text-amber-300/90 font-medium truncate">
                        {combos.length === 1 ? combos[0].nama : `${combos.length} Preset Kombinasi`}
                      </span>
                    ) : g.dipakaiDi ? (
                      <span className="text-amber-300/90 font-medium truncate">{g.dipakaiDi}</span>
                    ) : (
                      <span className="text-slate-400">Tersedia untuk kombinasi</span>
                    )}
                  </span>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : g.id)}
                    className="flex items-center gap-0.5 text-slate-400 hover:text-slate-200 transition-colors shrink-0 ml-1"
                  >
                    <span>{isExpanded ? "Tutup" : "Detail"}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-2 space-y-2 rounded-lg bg-slate-950/80 p-2.5 text-xs border border-slate-800/80 text-slate-300 animate-fadeIn">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        Tujuan Gerakan:
                      </span>
                      <p className="text-slate-200 text-[11px] mt-0.5">
                        {g.tujuan || "Meningkatkan kesan visual produk."}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        Instruksi Lengkap:
                      </span>
                      <p className="text-slate-200 text-[11px] mt-0.5 leading-relaxed">
                        {g.deskripsi}
                      </p>
                    </div>

                    {g.kondisi && (
                      <div className="rounded bg-amber-500/10 p-1.5 border border-amber-500/20 text-amber-300 text-[11px]">
                        ⚠️ Syarat: {g.kondisi}
                      </div>
                    )}

                    {/* Combination Presets List using this movement */}
                    <div className="pt-2 border-t border-slate-800/80">
                      {combos.length > 0 ? (
                        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-amber-300 flex items-center gap-1">
                              <BookmarkCheck className="h-3.5 w-3.5 text-amber-400" />
                              Preset Kombinasi yang Memakai ({combos.length}):
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {combos.map((c) => {
                              const matchItem = c.gerakanList?.find(
                                (item) =>
                                  item.gerakanId === g.id ||
                                  item.gerakan?.id === g.id ||
                                  item.gerakan?.kode === g.kode
                              );
                              const itemDur = matchItem?.durasiOverride || g.durasiMin;
                              const beatIndex = matchItem ? matchItem.urutan : null;

                              return (
                                <div
                                  key={c.id}
                                  className="flex items-center justify-between rounded-lg bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-200 border border-slate-800"
                                >
                                  <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                                    {beatIndex && (
                                      <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-500/20 px-1 rounded">
                                        #{beatIndex}
                                      </span>
                                    )}
                                    <span className="font-medium truncate text-[11px]" title={c.nama}>
                                      {c.nama}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="font-mono text-[10px] text-blue-400 font-medium">
                                      {itemDur}s / {c.targetDurasi}s
                                    </span>
                                    {onLoadKombinasi && (
                                      <button
                                        onClick={() => onLoadKombinasi(c)}
                                        className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                                        title="Muat preset kombinasi ini langsung ke timeline"
                                      >
                                        Muat
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : g.dipakaiDi ? (
                        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-300">
                          📌 Tercatat pada aturan default: <strong>{g.dipakaiDi}</strong>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-slate-900/60 border border-slate-800/80 p-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                          <span>Gerakan ini <strong>belum tersimpan</strong> di preset kombinasi manapun.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
