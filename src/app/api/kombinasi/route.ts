import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const kombinasiList = await prisma.kombinasi.findMany({
      include: {
        gerakanList: {
          orderBy: { urutan: "asc" },
          include: { gerakan: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: kombinasiList });
  } catch (error: any) {
    console.error("Error fetching kombinasi:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch kombinasi" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, deskripsi, targetDurasi, gerakanItems } = body;

    if (!nama || !gerakanItems || !Array.isArray(gerakanItems) || gerakanItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nama kombinasi dan minimal 1 gerakan wajib diisi." },
        { status: 400 }
      );
    }

    const newKombinasi = await prisma.kombinasi.create({
      data: {
        nama: nama.trim(),
        deskripsi: deskripsi ? deskripsi.trim() : null,
        targetDurasi: Number(targetDurasi) || 10,
        gerakanList: {
          create: gerakanItems.map((item: any, index: number) => ({
            gerakanId: item.gerakanId,
            urutan: index + 1,
            durasiOverride: item.durasi ? Number(item.durasi) : null,
          })),
        },
      },
      include: {
        gerakanList: {
          orderBy: { urutan: "asc" },
          include: { gerakan: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: newKombinasi }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating kombinasi:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create kombinasi" },
      { status: 500 }
    );
  }
}
