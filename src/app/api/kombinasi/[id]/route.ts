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
