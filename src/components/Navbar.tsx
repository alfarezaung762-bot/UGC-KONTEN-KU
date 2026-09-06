"use client";

import React from "react";
import { Film, Layers, BookmarkCheck, BookOpen, Database, Sparkles } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                UGC Prompt Studio
              </h1>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                PRO v2.0
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              AI Video Movement & Visual Showcase Prompt Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Bootstrap Nav-Pills Style) */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-blue-600 hover:bg-white"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>

                {tab.badge !== null && tab.badge > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold font-mono ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-white text-slate-700 border border-slate-200"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Database Status Indicator (Bootstrap Badge Style) */}
        <div className="hidden lg:flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1.5 border border-emerald-200 text-xs shadow-2xs">
          <div className="flex h-2 w-2 rounded-full bg-emerald-500"></div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-800 font-medium">
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>PostgreSQL: ugc</span>
          </span>
        </div>
      </div>
    </header>
  );
}
