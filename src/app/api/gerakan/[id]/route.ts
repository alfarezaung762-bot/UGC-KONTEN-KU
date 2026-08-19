import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const gerakan = await prisma.gerakan.findUnique({
      where: { id },
    });

    if (!gerakan) {
      return NextResponse.json(
        { success: false, error: "Gerakan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gerakan });
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

    const updated = await prisma.gerakan.update({
      where: { id },
      data: {
        nama: body.nama,
        kategori: body.kategori,
        kategoriLabel: body.kategoriLabel,
        tipe: body.tipe,
        durasiMin: Number(body.durasiMin),
        durasiMax: Number(body.durasiMax),
        deskripsi: body.deskripsi,
        tujuan: body.tujuan,
        kondisi: body.kondisi || null,
        status: body.status,
        dipakaiDi: body.dipakaiDi || null,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
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
    await prisma.gerakan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Gerakan berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
