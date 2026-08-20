import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const kombinasi = await prisma.kombinasi.findUnique({
      where: { id },
      include: {
        gerakanList: {
          orderBy: { urutan: "asc" },
          include: { gerakan: true },
        },
      },
    });

    if (!kombinasi) {
      return NextResponse.json(
        { success: false, error: "Kombinasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: kombinasi });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { nama, deskripsi, targetDurasi, urutan } = body;

    if (!nama || !nama.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama preset tidak boleh kosong" },
        { status: 400 }
      );
    }

    const updated = await prisma.kombinasi.update({
      where: { id },
      data: {
        nama: nama.trim(),
        deskripsi: deskripsi !== undefined ? (deskripsi ? deskripsi.trim() : null) : undefined,
        ...(targetDurasi !== undefined ? { targetDurasi: Number(targetDurasi) } : {}),
        ...(urutan !== undefined ? { urutan: Number(urutan) || 0 } : {}),
      },
      include: {
        gerakanList: {
          orderBy: { urutan: "asc" },
          include: { gerakan: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating kombinasi:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengupdate preset kombinasi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.kombinasi.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Kombinasi berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

