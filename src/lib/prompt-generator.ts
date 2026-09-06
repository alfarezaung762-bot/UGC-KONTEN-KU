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
  const cameraStyle =
    config?.cameraStyle ||
    "Fixed shot dengan micro-shaking handheld organik. Hindari kesan statis tripod atau green-screen.";

  const header = `OPTIMIZED PROMPT\nBuat video UGC affiliate pakaian, ${actualDuration} detik, 9:16 vertical.`;

  const sistemReferensi = `SISTEM REFERENSI MUTLAK:

PRODUCT-ACCURACY: Gunakan ${productRef} sebagai identitas visual utama. Motif, warna, dan tekstur kemeja harus 100% identik dengan foto di setiap shot. Jangan memodifikasi corak.
CREATOR-CONSISTENCY: Gunakan ${creatorRef} sebagai model. Wajah, rambut, dan aksesori (kalung/chain) harus konsisten. SILENT, tidak ada gerakan mulut/bicara.
ENVIRONMENT-LOCK: Lokasi video WAJIB berada di dalam ${backgroundRef}. Elemen kunci seperti cermin bulat backlit, dinding beton, dan lighting strips harus terlihat jelas untuk menetapkan lokasi yang konsisten.`;

  const aturanEksekusi = `ATURAN EKSEKUSI (ZERO HALLUCINATION):

GERAKAN: Anatomi manusia normal (5 jari, 2 tangan). Maksimal satu tangan aktif menyentuh kain produk secara natural. Kecepatan real-time, gerakan non-repetitif.
KAMERA: ${cameraStyle}
CLEAN FRAME: Dilarang menambahkan teks, logo, musik, atau elemen UI apapun.`;

  // If no movements selected, provide the user's optimized template
  if (selectedGerakan.length === 0) {
    return `${header}

${sistemReferensi}

${aturanEksekusi}

SHOT SCRIPT (${actualDuration} DETIK):

Shot 1 (0-3s): Frontal Medium Shot. Kreator di depan ${backgroundRef}, tangan menyentuh bahan produk.
Shot 2 (3-6s): Side View Angle. Menunjukkan tekstur produk dari samping dengan latar studio yang konsisten.
Shot 3 (6-10s): 3/4 Back-Side View & Closing. Menunjukkan detail produk secara menyeluruh, diakhiri dengan pose berdiri tegak menghadap kamera.`;
  }

  // Build dynamic Shot Script
  let currentSecond = 0;
  const shotLines: string[] = [];

  selectedGerakan.forEach((item, index) => {
    const startSec = currentSecond;
    const endSec = currentSecond + item.durasi;
    currentSecond = endSec;

    const shotNumber = index + 1;
    const g = item.gerakan;

    let shotText = `Shot ${shotNumber} (${startSec}-${endSec}s): `;

    if (index === 0) {
      shotText += `Frontal Medium Shot. Kreator di depan ${backgroundRef}, ${g.deskripsi}`;
    } else if (index === selectedGerakan.length - 1) {
      shotText += `${g.nama} & Closing. ${g.deskripsi} Diakhiri dengan pose berdiri tegak menghadap kamera.`;
    } else {
      shotText += `${g.nama}. ${g.deskripsi}`;
    }

    if (g.kondisi) {
      shotText += ` [Catatan: ${g.kondisi}]`;
    }

    shotLines.push(shotText.trim());
  });

  return `${header}

${sistemReferensi}

${aturanEksekusi}

SHOT SCRIPT (${actualDuration} DETIK):

${shotLines.join("\n")}`;
}

