"use client";

import React from "react";
import { Film, Layers, BookmarkCheck, BookOpen, Database, Sparkles, Wand2 } from "lucide-react";

interface NavbarProps {
  activeTab: "builder" | "gerakan" | "kombinasi" | "rules";
  setActiveTab: (tab: "builder" | "gerakan" | "kombinasi" | "rules") => void;
  totalGerakanCount?: number;
  totalKombinasiCount?: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  totalGerakanCount = 27,
  totalKombinasiCount = 0,
}: NavbarProps) {
  const tabs = [
    {
      id: "builder" as const,
      label: "Prompt Builder",
      icon: Sparkles,
      badge: null,
    },
    {
      id: "gerakan" as const,
      label: "Bank Gerakan",
      icon: Layers,
      badge: totalGerakanCount,
    },
    {
      id: "kombinasi" as const,
      label: "Kombinasi Preset",
      icon: BookmarkCheck,
      badge: totalKombinasiCount,
    },
    {
      id: "rules" as const,
      label: "Panduan Ruleset",
      icon: BookOpen,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-md shadow-blue-500/25 ring-1 ring-white/20">
            <Film className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                UGC Prompt Studio
              </h1>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                PRO v2.0
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 sm:block">
              AI Video Movement & Visual Showcase Prompt Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>

                {tab.badge !== null && tab.badge > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold font-mono ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Database Status Indicator */}
        <div className="hidden lg:flex items-center gap-2.5 rounded-xl bg-slate-900/80 px-3 py-1.5 border border-slate-800/80 text-xs shadow-sm">
          <div className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"></div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300 font-medium">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>PostgreSQL: ugc</span>
          </span>
        </div>
      </div>
    </header>
  );
}
