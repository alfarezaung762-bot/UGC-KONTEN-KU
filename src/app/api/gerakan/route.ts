import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");

    const where: any = {};
    if (kategori && kategori !== "ALL") {
      where.kategori = kategori;
    }
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { kode: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
        { tujuan: { contains: search, mode: "insensitive" } },
      ];
    }

    const gerakanList = await prisma.gerakan.findMany({
      where,
      orderBy: [{ kategori: "asc" }, { kode: "asc" }],
    });

    return NextResponse.json({ success: true, data: gerakanList });
  } catch (error: any) {
    console.error("Error fetching gerakan:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gerakan" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      kode,
      nama,
      kategori,
      kategoriLabel,
      tipe,
      durasiMin,
      durasiMax,
      deskripsi,
      tujuan,
      kondisi,
      status,
      dipakaiDi,
    } = body;

    if (!kode || !nama || !kategori || !deskripsi) {
      return NextResponse.json(
        { success: false, error: "Field kode, nama, kategori, dan deskripsi wajib diisi." },
        { status: 400 }
      );
    }

    // Check if kode already exists
    const existing = await prisma.gerakan.findUnique({
      where: { kode },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Kode gerakan "${kode}" sudah digunakan.` },
        { status: 400 }
      );
    }

    const newGerakan = await prisma.gerakan.create({
      data: {
        kode: kode.trim().toUpperCase(),
        nama: nama.trim(),
        kategori,
        kategoriLabel: kategoriLabel || kategori,
        tipe: tipe || "UNIVERSAL",
        durasiMin: Number(durasiMin) || 2,
        durasiMax: Number(durasiMax) || Number(durasiMin) || 2,
        deskripsi: deskripsi.trim(),
        tujuan: tujuan ? tujuan.trim() : "",
        kondisi: kondisi ? kondisi.trim() : null,
        status: status || "tersedia",
        dipakaiDi: dipakaiDi ? dipakaiDi.trim() : null,
      },
    });

    return NextResponse.json({ success: true, data: newGerakan }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating gerakan:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create gerakan" },
      { status: 500 }
    );
  }
}
