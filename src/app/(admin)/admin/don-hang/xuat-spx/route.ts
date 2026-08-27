import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { layCaiDat } from "@/lib/du-lieu";
import { taoFileSPX, tenFileSPX } from "@/lib/xuat-spx";
import { docThamSoLoc, taoDieuKienLoc } from "@/lib/loc-don-hang";

export const dynamic = "force-dynamic";

/**
 * Tải file Excel theo mẫu SPX.
 *
 *   ?ma=id1,id2                        → đúng những đơn được chọn
 *   ?trangThai=&tim=&tuNgay=&denNgay=  → đúng những đơn đang lọc trên màn hình
 */
export async function GET(yeuCau: Request) {
  await batBuocDangNhap();

  const thamSo = new URL(yeuCau.url).searchParams;
  const ma = (thamSo.get("ma") ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const dieuKien = ma.length
    ? { id: { in: ma } }
    : taoDieuKienLoc(docThamSoLoc(thamSo));

  const [danhSach, caiDat] = await Promise.all([
    prisma.order.findMany({
      where: dieuKien,
      orderBy: { createdAt: "asc" },
      take: 500,
      include: { items: { select: { productName: true, variantLabel: true, quantity: true, unitPrice: true } } },
    }),
    layCaiDat(),
  ]);

  if (danhSach.length === 0) {
    return NextResponse.json(
      { loi: "Không có đơn hàng nào để xuất." },
      { status: 404 },
    );
  }

  const noiDung = taoFileSPX(danhSach, {
    canNangMoiMon: caiDat.spxCanNang,
    dai: caiDat.spxDai,
    rong: caiDat.spxRong,
    cao: caiDat.spxCao,
    choThuHang: caiDat.spxChoThuHang,
    choXemHang: caiDat.spxChoXemHang,
  });

  const ten = tenFileSPX(danhSach.length);

  return new NextResponse(new Uint8Array(noiDung), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(ten)}`,
      "Content-Length": String(noiDung.length),
      "Cache-Control": "no-store",
    },
  });
}
