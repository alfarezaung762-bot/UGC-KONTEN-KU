# UGC Prompt Studio (UGC-KONTEN-KU) 🎬

A modern, high-precision **AI Video Movement & Visual Showcase Prompt Builder** for fashion & apparel UGC content creation (optimized for Gemini Flow, Kling, Runway Gen-3, Luma Dream Machine, Sora, and AI Video Models).

---

## ✨ Features

- 🎯 **Interactive Prompt Builder & Timeline**:
  - Live target duration counter (5s, 10s, 15s, 20s, 30s, or custom).
  - Dynamic beat reordering (Up/Down), duration stepper per shot, and time range mapping (`0-2s`, `2-4s`, etc.).
  - 1-click Quick Presets loader (`Review Pundak + Kerah`, `Saku + Fit + Respons`, `Detail Tekstur + Shrug`, `360 Spin Showcase`).
  
- 🏷️ **Bank Gerakan (27+ Curated Movements)**:
  - Categorized into:
    - **A**: Uji Bahan (Kenyamanan, Tekstur, Elastisitas)
    - **B**: Fitur Fungsional (Saku, Kerah, Zipper, Serut, Cuff)
    - **C**: Potongan / Fit Badan (Siluet, Hem, Fleksibilitas)
    - **D**: Respons Non-Verbal (Puas, Senyum, Shrug)
    - **E**: Transisi (Langkah, Condong-Tegak)
    - **F**: Highlight Visual (Detail Logo, Kerah)
    - **KOMP**: Gerakan Komposit (Full 10s Single-Take 360°)
  - Dynamic Combination Usage Labels (`🔖 Di Kombinasi`, `🟢 Belum di Kombinasi`, `✨ Timeline`).
  - Combination preset mapping inside movement detail accordion with 1-click **"Muat"** button.

- 🔖 **Kombinasi Presets (CRUD & Save)**:
  - Save custom timeline sequences as reusable presets into PostgreSQL.
  - Quick load presets into timeline in 1 click.
  - Delete or inspect saved presets.

- ⚙️ **Prompt Generator & Settings**:
  - Customizable placeholders (`[PRODUCT]`, `[CREATOR]`, `[BACKGROUND]`).
  - Target audience context customization.
  - Live character/word count and instant clipboard copy / `.md` export.

- 🛡️ **Master Rules Minim-Halusinasi**:
  - Silent Review rules (1 active hand per moment, silent character, natural camera handheld micro-movement).
  - Visual hierarchy consistency (`PRODUK > CREATOR > BACKGROUND`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Database & ORM**: PostgreSQL & [Prisma ORM](https://www.prisma.io/)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/alfarezaung762-bot/UGC-KONTEN-KU.git
cd UGC-KONTEN-KU
npm install
```

### 2. Configure Environment (.env)
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ugc?schema=public"
```

### 3. Setup Database Schema & Seed Data
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Production Build

```bash
npm run build
npm run start
```
