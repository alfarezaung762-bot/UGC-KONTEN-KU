import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:12345@localhost:5432/ugc?schema=public";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const gerakanData = [
  // === A: Uji Kenyamanan Bahan [UNIVERSAL] ===
  {
    kode: "A1",
    nama: "Pinch Test Kain",
    kategori: "A",
    kategoriLabel: "Uji Kenyamanan Bahan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 3,
    deskripsi:
      "Menjepit sedikit kain di area dada dengan ujung jari, tarik pelan lalu lepas — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan elastisitas dan kelembutan bahan kain.",
    kondisi: null,
    status: "tersedia",
    dipakaiDi: null,
  },
  {
    kode: "A2",
    nama: "Elus Pundak Simetris",
    kategori: "A",
    kategoriLabel: "Uji Kenyamanan Bahan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Kedua tangan mengelus pundak masing-masing sisi secara bersamaan (gerakan simetris identik, ini pengecualian aturan 1-tangan).",
    tujuan: "Cek bahan di area pundak secara menyeluruh dari kedua sisi.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 1",
  },
  {
    kode: "A3",
    nama: "Gosok Tekstur Lengan",
    kategori: "A",
    kategoriLabel: "Uji Kenyamanan Bahan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Satu tangan menggosok pelan permukaan lengan SISI SEBALIKNYA (misal tangan kanan ke lengan kiri), seperti merasakan tekstur bahan kain — tangan lain tetap rileks.",
    tujuan: "Menunjukkan tekstur permukaan kain secara visual.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 3, 4, 7",
  },
  {
    kode: "A4",
    nama: "Usap Kain Dada",
    kategori: "A",
    kategoriLabel: "Uji Kenyamanan Bahan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Satu telapak tangan mengusap vertikal pelan ke bawah di permukaan dada produk (gerakan elus lembut 1x dari atas ke bawah), lalu angkat tangan — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan bahan lembut, halus, dan tidak kaku saat disentuh.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 3",
  },
  {
    kode: "A5",
    nama: "Ketuk Kain",
    kategori: "A",
    kategoriLabel: "Uji Kenyamanan Bahan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Mengetuk ringan permukaan kain pakai ujung jari (2-3 ketukan pelan di area dada/lengan), mengecek kepadatan bahan — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan kepadatan dan kualitas soliditas bahan.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 4",
  },
  {
    kode: "A6",
    nama: "Tekan Bahu Pelan",
    kategori: "A",
    kategoriLabel: "Uji Kenyamanan Bahan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Satu telapak tangan menekan pelan bagian bahu (area pundak), tahan sebentar lalu lepas — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan ketebalan dan density kain di area bahu.",
    kondisi: null,
    status: "tersedia",
    dipakaiDi: null,
  },

  // === B: Fitur Fungsional [KONDISIONAL] ===
  {
    kode: "B1",
    nama: "Masuk Saku",
    kategori: "B",
    kategoriLabel: "Fitur Fungsional",
    tipe: "KONDISIONAL",
    durasiMin: 4,
    durasiMax: 4,
    deskripsi:
      "Masukkan satu tangan ke saku dengan tenang (~1.5 detik masuk), tahan di dalam saku (~1.5 detik), lalu keluarkan pelan (~1 detik) — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan fungsionalitas dan kedalaman saku pakaian.",
    kondisi: "Perlu SAKU",
    status: "dipakai",
    dipakaiDi: "Prompt 2, 8",
  },
  {
    kode: "B2",
    nama: "Tarik Tali Serut",
    kategori: "B",
    kategoriLabel: "Fitur Fungsional",
    tipe: "KONDISIONAL",
    durasiMin: 2,
    durasiMax: 3,
    deskripsi:
      "Satu tangan menarik pelan tali serut hoodie ke bawah, tahan sebentar, lalu lepas kembali ke posisi semula — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan fungsionalitas dan kualitas tali serut hoodie/jaket.",
    kondisi: "Perlu TALI SERUT",
    status: "tersedia",
    dipakaiDi: null,
  },
  {
    kode: "B3",
    nama: "Angkat Cuff Lengan",
    kategori: "B",
    kategoriLabel: "Fitur Fungsional",
    tipe: "KONDISIONAL",
    durasiMin: 2,
    durasiMax: 3,
    deskripsi:
      "Satu tangan menarik ujung lengan (cuff/rib) sedikit ke atas, tunjukkan detail jahitan/rib cuff sebentar, lalu lepas kembali. HANYA gunakan gerakan ini jika produk BENAR-BENAR memiliki cuff/rib di foto (jaket, hoodie, sweater dengan rib di pergelangan). Jika produk TIDAK ada cuff (batik, kemeja, kaos), gunakan B7 (Sentuh Ujung Lengan) sebagai gantinya. Tangan lain tetap rileks.",
    tujuan: "Menunjukkan detail rib, jahitan, dan elastisitas cuff lengan — KHUSUS produk yang memiliki cuff/rib.",
    kondisi: "Perlu CUFF/RIB di foto produk. Jika tidak ada, pakai B7.",
    status: "dipakai",
    dipakaiDi: "Prompt 7 (hanya jika ada cuff), 8",
  },
  {
    kode: "B4",
    nama: "Rapikan Kerah (Diam)",
    kategori: "B",
    kategoriLabel: "Fitur Fungsional",
    tipe: "KONDISIONAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Satu tangan pegang/rapikan kerah atau bagian hoodie di leher (diam di tempat, gerakan singkat 2 detik) — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan bentuk dan kerapian kerah pakaian.",
    kondisi: "Perlu KERAH/HOODIE",
    status: "dipakai",
    dipakaiDi: "Prompt 1",
  },
  {
    kode: "B5",
    nama: "Betulkan Kerah Sambil Jalan",
    kategori: "B",
    kategoriLabel: "Fitur Fungsional",
    tipe: "KONDISIONAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Betulkan kerah SAMBIL berjalan mendekat & memamerkan dada ke kamera (atau tarik bahu untuk kaos tanpa kerah nyata) — tangan lain tetap rileks.",
    tujuan: "Menunjukkan kerah sekaligus gerakan dinamis memamerkan pakaian.",
    kondisi: "Perlu KERAH NYATA (kaos: tarik bahu)",
    status: "dipakai",
    dipakaiDi: "Prompt 4",
  },
  {
    kode: "B6",
    nama: "Sentuh Area Resleting",
    kategori: "B",
    kategoriLabel: "Fitur Fungsional",
    tipe: "KONDISIONAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Satu tangan menyentuh/mengusap pelan area kain DI SEKITAR resleting (BUKAN memegang atau menggerakkan penarik resleting — resleting tetap diam tertutup di posisi seperti foto). Tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan keberadaan resleting dan kualitas area jahitan sekitarnya tanpa mengoperasikan mekanismenya.",
    kondisi: "Perlu RESLETING",
    status: "dipakai",
    dipakaiDi: "Prompt 8",
  },
  {
    kode: "B7",
    nama: "Sentuh Ujung Lengan (Tanpa Cuff)",
    kategori: "B",
    kategoriLabel: "Fitur Fungsional",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 3,
    deskripsi:
      "Satu tangan menyentuh/memegang ujung lengan (sleeve hem) sisi sebaliknya sebentar, tunjukkan finishing jahitan ujung lengan, lalu lepas. PENTING: Ikuti foto produk 100% — jika produk TIDAK memiliki cuff/rib (misal batik, kemeja, baju lengan pendek), JANGAN tambahkan cuff/rib. Tampilkan ujung lengan PERSIS seperti di foto produk. Tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan detail finishing ujung lengan tanpa memaksakan cuff — cocok untuk semua jenis pakaian (batik, kemeja, baju lengan pendek/panjang, kaos).",
    kondisi: null,
    status: "tersedia",
    dipakaiDi: "Alternatif B3 untuk produk tanpa cuff",
  },
  {
    kode: "B8",
    nama: "Pose Tangan Saku Celana",
    kategori: "B",
    kategoriLabel: "Fitur Fungsional",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 3,
    deskripsi:
      "Satu tangan masuk ke saku CELANA (bukan saku baju/jaket) dengan santai layaknya pose model, berdiri tegak percaya diri menghadap kamera. Tangan lain tetap rileks di samping badan. PENTING: Ini pose gaya, BUKAN gestur review produk — tangan TIDAK menyentuh pakaian atas sama sekali. Produk baju/batik/kemeja harus tetap terlihat utuh tanpa terlipat atau tersentuh.",
    tujuan: "Pose model santai yang menampilkan keseluruhan produk pakaian tanpa menyentuh/mengubah tampilannya — aman untuk semua jenis pakaian.",
    kondisi: null,
    status: "tersedia",
    dipakaiDi: "Prompt 7 UNIVERSAL",
  },

  // === C: Potongan/Fit Badan [UNIVERSAL] ===
  {
    kode: "C1",
    nama: "Tarik Hem Bawah",
    kategori: "C",
    kategoriLabel: "Potongan/Fit Badan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Satu tangan tarik pelan bagian bawah pakaian (hem) ke bawah sebentar, lalu lepas — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan panjang dan potongan hem pakaian pas di badan.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 1, 8",
  },
  {
    kode: "C2",
    nama: "Angkat Satu Tangan ke Samping",
    kategori: "C",
    kategoriLabel: "Potongan/Fit Badan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Angkat satu tangan lurus ke samping sebentar (menunjukkan lengan tidak sempit dan gerak bebas), tahan sesaat, lalu turunkan — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan keleluasaan gerak lengan pakaian.",
    kondisi: null,
    status: "tersedia",
    dipakaiDi: null,
  },
  {
    kode: "C3",
    nama: "Angkat Kedua Lengan ke Samping",
    kategori: "C",
    kategoriLabel: "Potongan/Fit Badan",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Angkat kedua lengan sedikit ke samping SEKALI (gerakan simetris identik), tahan sesaat, turunkan lagi — DILARANG mengulang gerakan ini.",
    tujuan: "Cek fleksibilitas gerak lengan tanpa kesan ritmis/joget.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 2",
  },
  {
    kode: "C4",
    nama: "Cek Siluet Dua Sisi",
    kategori: "C",
    kategoriLabel: "Potongan/Fit Badan",
    tipe: "UNIVERSAL",
    durasiMin: 4,
    durasiMax: 4,
    deskripsi:
      "Memutar badan dari pinggang pelan ke kanan (~1.5 detik, tahan sesaat), lalu putar balik ke kiri (~1.5 detik, tahan sesaat), kembali ke depan (~1 detik). Kedua tangan rileks di samping badan selama berputar.",
    tujuan: "Menunjukkan siluet samping kanan dan kiri pakaian dengan jelas.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 1, 2, 4",
  },

  // === D: Respons Non-Verbal Puas [UNIVERSAL] ===
  {
    kode: "D1",
    nama: "Tunduk Lihat Produk + Senyum",
    kategori: "D",
    kategoriLabel: "Respons Non-Verbal",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 3,
    deskripsi:
      "Menunduk sejenak melihat pakaian yang dikenakan (pandangan ke bawah ke dada/perut), lalu angkat wajah dengan senyum tipis puas ke kamera. Kedua tangan tetap rileks di samping badan.",
    tujuan: "Menunjukkan ekspresi kepuasan alami saat mengenakan produk.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 2",
  },
  {
    kode: "D2",
    nama: "Angguk + Lihat Produk",
    kategori: "D",
    kategoriLabel: "Respons Non-Verbal",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Angguk pelan 1x sambil pandangan turun ke arah dada/lengan produk (gesture non-verbal saja, TANPA tangan aktif). Kedua tangan tetap rileks di samping badan.",
    tujuan: "Gesture non-verbal menyetujui kualitas produk tanpa menyentuh produk.",
    kondisi: null,
    status: "tersedia",
    dipakaiDi: null,
  },
  {
    kode: "D3",
    nama: "Usap Dada + Angguk",
    kategori: "D",
    kategoriLabel: "Respons Non-Verbal",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 3,
    deskripsi:
      "Satu tangan mengusap pelan permukaan dada produk (gerakan vertikal lembut ke bawah 1x) sambil sedikit mengangguk — tangan lain tetap rileks di samping badan.",
    tujuan: "Menunjukkan produk nyaman dipakai dan memuaskan.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 2",
  },
  {
    kode: "D4",
    nama: "Kibas Bahu (Shoulder Shrug)",
    kategori: "D",
    kategoriLabel: "Respons Non-Verbal",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Kibas bahu kecil 1x (shoulder shrug natural) memperlihatkan bahan bergerak dan jatuh natural di badan. KEDUA TANGAN tetap diam rileks di samping badan (TIDAK ADA gerakan tangan apapun saat kibas bahu).",
    tujuan: "Menunjukkan drape/jatuhnya kain secara alami di tubuh.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 3",
  },

  // === E: Gerakan Transisi [UNIVERSAL] ===
  {
    kode: "E1",
    nama: "Langkah Kecil ke Samping",
    kategori: "E",
    kategoriLabel: "Gerakan Transisi",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Langkah kecil ke samping (setengah langkah) sambil badan tetap menghadap ke kamera. Kedua tangan rileks di samping badan.",
    tujuan: "Menambah dinamisme visual tanpa merusak framing shot.",
    kondisi: null,
    status: "tersedia",
    dipakaiDi: null,
  },
  {
    kode: "E2",
    nama: "Condong-Tegak",
    kategori: "E",
    kategoriLabel: "Gerakan Transisi",
    tipe: "UNIVERSAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Sedikit condong ke depan dari pinggang (BUKAN bungkuk dalam), lalu tegak kembali — menunjukkan gerak badan tidak terhambat pakaian. Kedua tangan rileks di samping badan.",
    tujuan: "Menunjukkan fleksibilitas potongan saat bergerak aktif.",
    kondisi: null,
    status: "tersedia",
    dipakaiDi: null,
  },

  // === F: Highlight Visual Khusus [KONDISIONAL] ===
  {
    kode: "F1",
    nama: "Tunjuk Area Logo/Grafis",
    kategori: "F",
    kategoriLabel: "Highlight Visual",
    tipe: "KONDISIONAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Satu tangan menunjuk/menyentuh pelan area DI SAMPING logo/grafis di dada (jangan menutupi logo), kamera otomatis sedikit mendekat mengikuti — tangan lain tetap rileks di samping badan.",
    tujuan: "Highlight detail artwork, sablon, atau bordir logo.",
    kondisi: "Perlu LOGO/GRAFIS/SABLON",
    status: "tersedia",
    dipakaiDi: null,
  },
  {
    kode: "F2",
    nama: "Sentuh Kerah Samping + Zoom",
    kategori: "F",
    kategoriLabel: "Highlight Visual",
    tipe: "KONDISIONAL",
    durasiMin: 2,
    durasiMax: 2,
    deskripsi:
      "Satu tangan menyentuh kerah bagian samping sambil kamera sedikit mendekat dari angle 3/4 — tangan lain tetap rileks di samping badan.",
    tujuan: "Highlight detail struktur kerah dari sudut samping yang estetik.",
    kondisi: "Perlu KERAH",
    status: "dipakai",
    dipakaiDi: "Prompt 7",
  },

  // === KOMP: Gerakan Komposit / Rangkaian Lengkap ===
  {
    kode: "KOMP1",
    nama: "Putar 360 Derajat Penuh",
    kategori: "KOMP",
    kategoriLabel: "Gerakan Komposit",
    tipe: "UNIVERSAL",
    durasiMin: 10,
    durasiMax: 10,
    deskripsi:
      "Berputar pelan satu arah penuh 360° selama 10 detik tanpa henti. Breakpoint: 0° depan (0s) → 90° samping kanan (2.5s) → 180° belakang (5s) → 270° samping kiri (7.5s) → 360° kembali ke depan (10s). Kecepatan konstan dan merata, kedua tangan rileks di samping badan sepanjang putaran.",
    tujuan: "Menunjukkan potongan pakaian dari semua sudut 360 derajat.",
    kondisi: null,
    status: "dipakai",
    dipakaiDi: "Prompt 6",
  },
  {
    kode: "KOMP2",
    nama: "Jalan Normal + Interaksi Lokasi",
    kategori: "KOMP",
    kategoriLabel: "Gerakan Komposit",
    tipe: "KONDISIONAL",
    durasiMin: 10,
    durasiMax: 10,
    deskripsi:
      "Shot 1 (0-5s): Berjalan kecepatan normal dengan kamera follow shot, kedua tangan bergerak natural mengayun saat jalan. Shot 2 (5-10s): Lanjut jalan sambil interaksi ringan dengan lokasi (misal menyentuh pagar/meja) lalu berhenti santai.",
    tujuan: "Menampilkan pakaian saat beraktivitas kasual di lokasi nyata.",
    kondisi: "Perlu BACKGROUND lokasi",
    status: "dipakai",
    dipakaiDi: "Prompt 5",
  },
  {
    kode: "KOMP3",
    nama: "Walk to Camera + Review Aktif",
    kategori: "KOMP",
    kategoriLabel: "Gerakan Komposit",
    tipe: "KONDISIONAL",
    durasiMin: 10,
    durasiMax: 10,
    deskripsi:
      "Berjalan mendekat ke kamera statis dengan 5 beat pendek (maks 2s per beat): elus bahan → pamer kerah/bahu → pose putar badan → ketuk kain → berhenti pose akhir menghadap kamera.",
    tujuan: "Kombinasi walking showcase dengan aksi review tekstur kain konkret.",
    kondisi: "Perlu BACKGROUND lokasi",
    status: "dipakai",
    dipakaiDi: "Prompt 4",
  },
];

async function main() {
  console.log("🌱 Seeding gerakan data (UPDATED v2 — audit-fixed)...");

  for (const g of gerakanData) {
    await prisma.gerakan.upsert({
      where: { kode: g.kode },
      update: g,
      create: g,
    });
  }

  // Also seed a default combination
  const combo1 = await prisma.kombinasi.upsert({
    where: { id: "combo-preset-1" },
    update: {},
    create: {
      id: "combo-preset-1",
      nama: "Review Klasik 10 Detik (Pundak + Kerah + Siluet)",
      deskripsi: "Kombinasi standar paling populer: Cek bahan pundak, rapikan kerah, dan cek siluet 2 sisi.",
      targetDurasi: 10,
    },
  });

  // Attach movements to combo1
  const gA2 = await prisma.gerakan.findUnique({ where: { kode: "A2" } });
  const gB4 = await prisma.gerakan.findUnique({ where: { kode: "B4" } });
  const gC4 = await prisma.gerakan.findUnique({ where: { kode: "C4" } });
  const gC1 = await prisma.gerakan.findUnique({ where: { kode: "C1" } });

  if (gA2 && gB4 && gC4 && gC1) {
    await prisma.kombinasiGerakan.deleteMany({
      where: { kombinasiId: combo1.id },
    });

    await prisma.kombinasiGerakan.createMany({
      data: [
        { kombinasiId: combo1.id, gerakanId: gA2.id, urutan: 1, durasiOverride: 2 },
        { kombinasiId: combo1.id, gerakanId: gB4.id, urutan: 2, durasiOverride: 2 },
        { kombinasiId: combo1.id, gerakanId: gC4.id, urutan: 3, durasiOverride: 4 },
        { kombinasiId: combo1.id, gerakanId: gC1.id, urutan: 4, durasiOverride: 2 },
      ],
    });
  }

  console.log(`✅ ${gerakanData.length} gerakan seeded successfully (v2 audit-fixed)!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
