"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Settings2,
  Sparkles,
  Maximize2,
  Minimize2,
  FileText,
} from "lucide-react";
import { SelectedGerakan, MasterRuleConfig } from "@/lib/types";
import { generatePrompt } from "@/lib/prompt-generator";

interface PromptPreviewProps {
  selectedGerakan: SelectedGerakan[];
  targetDuration: number;
  config: MasterRuleConfig;
  setConfig: React.Dispatch<React.SetStateAction<MasterRuleConfig>>;
}

export function PromptPreview({
  selectedGerakan,
  targetDuration,
  config,
  setConfig,
}: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const promptText = generatePrompt({
    selectedGerakan,
    targetDuration,
    config,
  });

  const totalSeconds = selectedGerakan.reduce((acc, curr) => acc + curr.durasi, 0);
  const wordCount = promptText.trim().split(/\s+/).length;
  const charCount = promptText.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([promptText], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `ugc-prompt-${totalSeconds || targetDuration}s.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      className={`flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 bg-white transition-all ${
        isExpanded ? "fixed inset-4 z-50 rounded-lg shadow-xl bg-white border border-slate-300" : "h-full"
      }`}
    >
      {/* Header Bar (Bootstrap card-header style) */}
      <div className="flex items-center justify-between border-b border-slate-200 p-3.5 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 border border-blue-200 text-blue-600">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Prompt Siap Pakai</h3>
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-mono font-bold text-blue-700 border border-blue-200">
            {totalSeconds || targetDuration}s
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all ${
              showSettings
                ? "bg-blue-50 text-blue-700 border border-blue-300"
                : "text-slate-600 hover:bg-slate-200"
            }`}
            title="Pengaturan Placeholder / Master Rules"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pengaturan</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-all"
            title="Download sebagai file .md"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-200 transition-all"
            title={isExpanded ? "Kecilkan" : "Perbesar tampilan"}
          >
            {isExpanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            onClick={handleCopy}
            className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-bold transition-all shadow-2xs active:scale-95 ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            title="Salin prompt lengkap ke clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Salin Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Settings Panel (Bootstrap Form Group Style) */}
      {showSettings && (
        <div className="border-b border-slate-200 bg-slate-50 p-4 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5 text-blue-600" />
              Placeholder & Konfigurasi Prompt
            </span>
            <span className="text-[11px] text-slate-500">
              Ubah label referensi gambar
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Placeholder Produk:
              </label>
              <input
                type="text"
                value={config.productPlaceholder}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, productPlaceholder: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Placeholder Creator:
              </label>
              <input
                type="text"
                value={config.creatorPlaceholder}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, creatorPlaceholder: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Placeholder Background:
              </label>
              <input
                type="text"
                value={config.backgroundPlaceholder}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, backgroundPlaceholder: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Gaya Kamera:
            </label>
            <input
              type="text"
              value={config.cameraStyle}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, cameraStyle: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Main Text Display */}
      <div className="relative flex-1 overflow-y-auto p-4 font-mono text-xs">
        <textarea
          readOnly
          value={promptText}
          rows={25}
          className="w-full h-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-4 text-xs font-mono leading-relaxed text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none select-all selection:bg-blue-600 selection:text-white"
        />
      </div>

      {/* Footer Info Bar */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2.5 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>
            Total Shot: <strong className="text-slate-900">{selectedGerakan.length}</strong>
          </span>
          <span>•</span>
          <span>
            Kata: <strong className="text-slate-900">{wordCount}</strong>
          </span>
          <span>•</span>
          <span>
            Karakter: <strong className="text-slate-900">{charCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
          <Sparkles className="h-3 w-3 text-blue-600" />
          <span>Siap untuk Gemini Flow & AI Video</span>
        </div>
      </div>
    </div>
  );
}
