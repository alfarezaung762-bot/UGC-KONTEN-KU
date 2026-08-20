export interface GerakanType {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  kategoriLabel: string;
  tipe: string; // UNIVERSAL | KONDISIONAL
  durasiMin: number;
  durasiMax: number;
  deskripsi: string;
  tujuan: string;
  kondisi: string | null;
  status: string; // tersedia | dipakai
  dipakaiDi: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SelectedGerakan {
  uid: string; // unique instance ID in the timeline
  gerakan: GerakanType;
  durasi: number; // chosen duration in seconds
}

export interface KombinasiGerakanItem {
  id: string;
  kombinasiId?: string;
  gerakanId?: string;
  urutan: number;
  durasiOverride: number | null;
  gerakan: GerakanType;
}

export interface KombinasiType {
  id: string;
  nama: string;
  deskripsi: string | null;
  targetDurasi: number;
  urutan?: number;
  createdAt?: string;
  updatedAt?: string;
  gerakanList: KombinasiGerakanItem[];
}

export interface MasterRuleConfig {
  productPlaceholder: string;
  creatorPlaceholder: string;
  backgroundPlaceholder: string;
  includeMasterRules: boolean;
  audienceContext: string;
  cameraStyle: string;
}

export const DEFAULT_MASTER_RULE_CONFIG: MasterRuleConfig = {
  productPlaceholder: "[PRODUCT]",
  creatorPlaceholder: "[CREATOR]",
  backgroundPlaceholder: "[BACKGROUND]",
  includeMasterRules: true,
  audienceContext: "anak muda, anak kuliah, anak SMK, remaja usia 20-30 tahun",
  cameraStyle: "FIX/STATIS dengan micro-movement handheld halus (bukan tripod mati, hindari kesan green-screen)",
};

export const KATEGORI_CONFIG: Record<
  string,
  {
    label: string;
    sublabel: string;
    color: string;
    bg: string;
    border: string;
    badgeBg: string;
    accent: string;
  }
> = {
  A: {
    label: "A. Uji Bahan",
    sublabel: "Kenyamanan & Tekstur",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/20 text-emerald-300",
    accent: "#10b981",
  },
  B: {
    label: "B. Fungsional",
    sublabel: "Saku, Kerah, Zipper",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    badgeBg: "bg-amber-500/20 text-amber-300",
    accent: "#f59e0b",
  },
  C: {
    label: "C. Fit Badan",
    sublabel: "Potongan & Siluet",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    badgeBg: "bg-sky-500/20 text-sky-300",
    accent: "#0ea5e9",
  },
  D: {
    label: "D. Respons Puas",
    sublabel: "Ekspresi Non-Verbal",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    badgeBg: "bg-violet-500/20 text-violet-300",
    accent: "#8b5cf6",
  },
  E: {
    label: "E. Transisi",
    sublabel: "Dinamisme Gerak",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    badgeBg: "bg-teal-500/20 text-teal-300",
    accent: "#14b8a6",
  },
  F: {
    label: "F. Highlight",
    sublabel: "Logo & Detail Khusus",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    badgeBg: "bg-rose-500/20 text-rose-300",
    accent: "#f43f5e",
  },
  KOMP: {
    label: "Gerakan Komposit",
    sublabel: "Full 10s Rangkaian",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    badgeBg: "bg-orange-500/20 text-orange-300",
    accent: "#f97316",
  },
};
