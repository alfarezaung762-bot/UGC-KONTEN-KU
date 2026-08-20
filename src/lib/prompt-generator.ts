import { SelectedGerakan, MasterRuleConfig } from "./types";

export function generatePrompt({
  selectedGerakan,
  targetDuration = 10,
  config,
}: {
  selectedGerakan: SelectedGerakan[];
  targetDuration?: number;
  config?: Partial<MasterRuleConfig>;
}): string {
  const totalSeconds = selectedGerakan.reduce((acc, curr) => acc + curr.durasi, 0);
  const actualDuration = totalSeconds > 0 ? totalSeconds : targetDuration;

  const productRef = config?.productPlaceholder || "[PRODUCT]";
  const creatorRef = config?.creatorPlaceholder || "[CREATOR]";
  const backgroundRef = config?.backgroundPlaceholder || "[BACKGROUND]";
  const audience =
    config?.audienceContext ||
    "anak muda, anak kuliah, anak SMK, remaja usia 20-30 tahun";
  const cameraStyle =
    config?.cameraStyle ||
    "FIX/STATIS sepanjang video dengan micro-movement handheld yang sangat halus (goyangan kecil natural seperti dipegang tangan, bukan tripod mati total) supaya tidak terkesan footage green-screen/composite yang kaku. Pastikan bayangan creator jatuh natural sesuai arah cahaya di background, perspektif dan skala tubuh proporsional.";

  // Blok referensi gambar — aturan produk & creator langsung menyatu di sini (lebih efisien, kurangi konteks berlebih)
  const referensiGambar = `=== REFERENSI GAMBAR ===
- Product: ${productRef} Ikuti foto ${productRef} 100% akurat: bentuk, warna, motif, jahitan, kancing/resleting, saku, logo/teks, tekstur sama persis di semua frame. Sisi tak terlihat buat polos/netral. JANGAN tambah fitur fiktif. Resleting/kancing diam di posisi tertutup, tangan hanya menyentuh kain di sekitarnya.
- Creator: ${creatorRef}Wajah, gaya rambut, warna kulit, dan proporsi tubuh sama persis dengan foto ${creatorRef}. Mulut diam natural, TIDAK ADA gerakan bibir bicara/lipsync.
- Background: ${backgroundRef} lokasi,warna, lighting, dan komposisi environment HARUS konsisten mengikuti foto ini di semua shot. JANGAN berubah drastis (jangan jadi lebih gelap/terang dari foto aslinya, objek/furniture di background jangan berpindah posisi atau berubah bentuk). Prioritas kalau ada KONFLIK/tabrakan antar elemen (bukan berarti boleh diabaikan): produk > creator > background.`;

  // Blok aturan master — hanya anatomi/gerakan & kamera (produk & creator sudah di atas)
  const aturanMaster = `=== ATURAN MASTER (MINIM HALUSINASI) ===
1. ANATOMI & GERAKAN: 2 tangan, 2 kaki normal. Maksimal satu tangan aktif per momen (kecuali gestur simetris 2 tangan identik). Hindari menyentuh punggung tengah. Kecepatan normal/real-time (BUKAN slow motion). DILARANG gerakan berulang/joget/ritmis — tiap gestur dilakukan 1x natural.
2. KAMERA & FORMAT: ${cameraStyle}. 9:16 vertical, TANPA voiceover/dialog/musik.
3. DILARANG KERAS menambahkan teks, judul, watermark, logo, subtitle, atau elemen UI apapun di dalam frame video.`;

  // If no movements selected, provide a placeholder template
  if (selectedGerakan.length === 0) {
    return `Buat video UGC affiliate pakaian, SILENT (mulut tidak bergerak/tidak bicara), PRODUCT-ACCURATE (warna/desain wajib sesuai foto referensi, tidak boleh berhalusinasi), standalone ${actualDuration} detik (video berdiri sendiri, memiliki opening dan closing yang lengkap).

${referensiGambar}

${aturanMaster}

Konteks target penonton: ${audience}.

Shot script (total ${actualDuration} detik):
[Pilih gerakan dari Bank Gerakan di sebelah kiri untuk menyusun shot script otomatis]`;
  }

  // Build Shot Script
  let currentSecond = 0;
  const shotLines: string[] = [];

  selectedGerakan.forEach((item, index) => {
    const startSec = currentSecond;
    const endSec = currentSecond + item.durasi;
    currentSecond = endSec;

    const shotNumber = index + 1;
    const g = item.gerakan;

    let shotText = `Shot ${shotNumber} (${startSec}-${endSec}s) - ${g.nama}: `;

    // Opening beat context for first shot
    if (index === 0) {
      shotText += `creator ${creatorRef} sudah mengenakan produk ${productRef}, muncul di frame medium shot dengan pose santai/percaya diri, mulut diam natural (senyum tipis atau ekspresi cool, tanpa gerak bibir bicara). Lanjut aksi: ${g.deskripsi} `;
    } else if (index === selectedGerakan.length - 1) {
      // Closing beat context for last shot
      shotText += `Aksi: ${g.deskripsi} Ditutup dengan creator berdiri tegak natural menghadap kamera sebagai closing pose. `;
    } else {
      shotText += `Aksi: ${g.deskripsi} `;
    }

    if (g.kondisi) {
      shotText += `[Catatan: ${g.kondisi}]`;
    }

    shotLines.push(shotText.trim());
  });

  const promptOutput = `Buat video UGC affiliate pakaian, SILENT (mulut tidak bergerak/tidak bicara), PRODUCT-ACCURATE (warna/desain wajib sesuai foto referensi, tidak boleh berhalusinasi), standalone ${actualDuration} detik (video berdiri sendiri, memiliki opening dan closing yang lengkap di dalam durasi ini).

${referensiGambar}

${aturanMaster}

Konteks target penonton: ${audience}.
*Cek ulang foto ${productRef} sebelum render — pastikan warna & detail produk akurat.*

Shot script (${selectedGerakan.length} shot, total ${actualDuration} detik):
${shotLines.join("\n\n")}`;

  return promptOutput;
}
