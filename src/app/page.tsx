"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { GerakanSidebar } from "@/components/GerakanSidebar";
import { BuilderCanvas } from "@/components/BuilderCanvas";
import { PromptPreview } from "@/components/PromptPreview";
import { GerakanModal } from "@/components/GerakanModal";
import { SaveKombinasiModal } from "@/components/SaveKombinasiModal";
import { GerakanCRUDView } from "@/components/GerakanCRUDView";
import { KombinasiView } from "@/components/KombinasiView";
import { RulesetGuideView } from "@/components/RulesetGuideView";
import {
  GerakanType,
  SelectedGerakan,
  KombinasiType,
  MasterRuleConfig,
  DEFAULT_MASTER_RULE_CONFIG,
} from "@/lib/types";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"builder" | "gerakan" | "kombinasi" | "rules">("builder");

  // Database state
  const [gerakanList, setGerakanList] = useState<GerakanType[]>([]);
  const [kombinasiList, setKombinasiList] = useState<KombinasiType[]>([]);
  const [loading, setLoading] = useState(true);

  // Builder timeline state
  const [selectedGerakan, setSelectedGerakan] = useState<SelectedGerakan[]>([]);
  const [targetDuration, setTargetDuration] = useState<number>(10);
  const [config, setConfig] = useState<MasterRuleConfig>(DEFAULT_MASTER_RULE_CONFIG);

  // Modals state
  const [isGerakanModalOpen, setIsGerakanModalOpen] = useState(false);
  const [editingGerakan, setEditingGerakan] = useState<GerakanType | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resGerakan, resKombinasi] = await Promise.all([
        fetch("/api/gerakan"),
        fetch("/api/kombinasi"),
      ]);

      const dataG = await resGerakan.json();
      const dataK = await resKombinasi.json();

      if (dataG.success) setGerakanList(dataG.data);
      if (dataK.success) setKombinasiList(dataK.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add movement to active timeline
  const handleAddGerakan = (g: GerakanType) => {
    const newItem: SelectedGerakan = {
      uid: `${g.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      gerakan: g,
      durasi: g.durasiMin || 2,
    };
    setSelectedGerakan((prev) => [...prev, newItem]);
    showToast(`Ditambahkan: ${g.kode} - ${g.nama}`);
  };

  // Update movement duration in timeline
  const handleUpdateDuration = (uid: string, newDuration: number) => {
    setSelectedGerakan((prev) =>
      prev.map((item) =>
        item.uid === uid ? { ...item, durasi: Math.max(1, newDuration) } : item
      )
    );
  };

  // Remove movement from timeline
  const handleRemoveGerakan = (uid: string) => {
    setSelectedGerakan((prev) => prev.filter((item) => item.uid !== uid));
  };

  // Reorder movements
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSelectedGerakan((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedGerakan.length - 1) return;
    setSelectedGerakan((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Reset timeline
  const handleClearTimeline = () => {
    if (selectedGerakan.length === 0) return;
    if (window.confirm("Kosongkan semua susunan gerakan di timeline?")) {
      setSelectedGerakan([]);
      showToast("Timeline berhasil direset");
    }
  };

  // Quick Preset Loader
  const handleLoadPreset = (presetType: string) => {
    if (gerakanList.length === 0) return;

    let targetCodes: { kode: string; dur: number }[] = [];

    if (presetType === "PROMPT_1") {
      targetCodes = [
        { kode: "A2", dur: 2 },
        { kode: "B4", dur: 2 },
        { kode: "C4", dur: 3 },
        { kode: "C1", dur: 3 },
      ];
    } else if (presetType === "PROMPT_2") {
      targetCodes = [
        { kode: "C4", dur: 1 },
        { kode: "B1", dur: 4 },
        { kode: "C3", dur: 2 },
        { kode: "D1", dur: 3 },
      ];
    } else if (presetType === "PROMPT_3") {
      targetCodes = [
        { kode: "A3", dur: 2 },
        { kode: "A4", dur: 2 },
        { kode: "D4", dur: 3 },
      ];
    } else if (presetType === "PROMPT_6") {
      targetCodes = [{ kode: "KOMP1", dur: 10 }];
    }

    const newItems: SelectedGerakan[] = [];
    targetCodes.forEach((t) => {
      const g = gerakanList.find((item) => item.kode === t.kode);
      if (g) {
        newItems.push({
          uid: `${g.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          gerakan: g,
          durasi: t.dur,
        });
      }
    });

    if (newItems.length > 0) {
      setSelectedGerakan(newItems);
      setTargetDuration(10);
      showToast("Preset kombinasi berhasil dimuat!");
    }
  };

  // Load saved combination from DB
  const handleLoadKombinasi = (kombinasi: KombinasiType) => {
    const loaded: SelectedGerakan[] = kombinasi.gerakanList.map((item) => ({
      uid: `${item.gerakan.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      gerakan: item.gerakan,
      durasi: item.durasiOverride || item.gerakan.durasiMin,
    }));

    setSelectedGerakan(loaded);
    setTargetDuration(kombinasi.targetDurasi || 10);
    setActiveTab("builder");
    showToast(`Preset "${kombinasi.nama}" berhasil dimuat ke timeline!`);
  };

  // Save movement (Create or Update)
  const handleSaveGerakan = async (data: Partial<GerakanType>) => {
    if (editingGerakan) {
      // Update
      const res = await fetch(`/api/gerakan/${editingGerakan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      showToast(`Gerakan ${result.data.kode} berhasil diupdate`);
    } else {
      // Create
      const res = await fetch("/api/gerakan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      showToast(`Gerakan baru ${result.data.kode} berhasil dibuat`);
    }

    await fetchData();
    setEditingGerakan(null);
  };

  // Delete movement
  const handleDeleteGerakan = async (id: string) => {
    const res = await fetch(`/api/gerakan/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (!result.success) throw new Error(result.error);

    // Also remove from selected timeline if present
    setSelectedGerakan((prev) => prev.filter((item) => item.gerakan.id !== id));
    showToast("Gerakan berhasil dihapus");
    await fetchData();
  };

  // Delete combination preset
  const handleDeleteKombinasi = async (id: string) => {
    const res = await fetch(`/api/kombinasi/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (!result.success) throw new Error(result.error);

    showToast("Preset kombinasi berhasil dihapus");
    await fetchData();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalGerakanCount={gerakanList.length}
        totalKombinasiCount={kombinasiList.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-blue-500/40 bg-slate-900/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[calc(100vh-64px)]">
            {/* Sidebar Gerakan (3 cols on lg) */}
            <aside className="lg:col-span-3 h-auto lg:h-[calc(100vh-64px)] border-b lg:border-b-0">
              <GerakanSidebar
                gerakanList={gerakanList}
                kombinasiList={kombinasiList}
                selectedGerakan={selectedGerakan}
                onAddGerakan={handleAddGerakan}
                onLoadKombinasi={handleLoadKombinasi}
                onOpenCreateModal={() => {
                  setEditingGerakan(null);
                  setIsGerakanModalOpen(true);
                }}
                selectedCount={selectedGerakan.length}
              />
            </aside>

            {/* Timeline Builder Canvas (5 cols on lg) */}
            <section className="lg:col-span-5 h-auto lg:h-[calc(100vh-64px)] border-b lg:border-b-0 border-slate-800">
              <BuilderCanvas
                selectedGerakan={selectedGerakan}
                targetDuration={targetDuration}
                setTargetDuration={setTargetDuration}
                onUpdateDuration={handleUpdateDuration}
                onRemoveGerakan={handleRemoveGerakan}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onClearTimeline={handleClearTimeline}
                onOpenSaveModal={() => setIsSaveModalOpen(true)}
                onLoadPreset={handleLoadPreset}
              />
            </section>

            {/* Prompt Live Preview & Export (4 cols on lg) */}
            <section className="lg:col-span-4 h-auto lg:h-[calc(100vh-64px)]">
              <PromptPreview
                selectedGerakan={selectedGerakan}
                targetDuration={targetDuration}
                config={config}
                setConfig={setConfig}
              />
            </section>
          </div>
        )}

        {activeTab === "gerakan" && (
          <GerakanCRUDView
            gerakanList={gerakanList}
            kombinasiList={kombinasiList}
            onOpenCreateModal={() => {
              setEditingGerakan(null);
              setIsGerakanModalOpen(true);
            }}
            onOpenEditModal={(g) => {
              setEditingGerakan(g);
              setIsGerakanModalOpen(true);
            }}
            onDeleteGerakan={handleDeleteGerakan}
            onUseInBuilder={(g) => {
              handleAddGerakan(g);
              setActiveTab("builder");
            }}
          />
        )}

        {activeTab === "kombinasi" && (
          <KombinasiView
            kombinasiList={kombinasiList}
            onLoadKombinasi={handleLoadKombinasi}
            onDeleteKombinasi={handleDeleteKombinasi}
            onSwitchToBuilder={() => setActiveTab("builder")}
          />
        )}

        {activeTab === "rules" && <RulesetGuideView />}
      </main>

      {/* Modals */}
      <GerakanModal
        isOpen={isGerakanModalOpen}
        onClose={() => {
          setIsGerakanModalOpen(false);
          setEditingGerakan(null);
        }}
        onSave={handleSaveGerakan}
        initialData={editingGerakan}
      />

      <SaveKombinasiModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        selectedGerakan={selectedGerakan}
        targetDuration={targetDuration}
        onSaveSuccess={() => {
          showToast("Preset kombinasi berhasil disimpan ke database!");
          fetchData();
        }}
      />
    </div>
  );
}
