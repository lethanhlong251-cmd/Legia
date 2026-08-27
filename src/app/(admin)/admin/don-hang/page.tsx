import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { TEN_TRANG_THAI } from "@/components/admin/nhan-trang-thai";
import { BangDonHang } from "@/components/admin/bang-don-hang";
import type { OrderStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const CAC_TRANG_THAI = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
];

export default async function TrangDanhSachDon({
  searchParams,
}: PageProps<"/admin/don-hang">) {
  const nguoiDung = await batBuocDangNhap();
  const { trangThai } = await searchParams;
  const locTheo =
    typeof trangThai === "string" && CAC_TRANG_THAI.includes(trangThai)
      ? (trangThai as OrderStatus)
      : null;

  const [danhSach, demTheoTrangThai] = await Promise.all([
    prisma.order.findMany({
      where: locTheo ? { status: locTheo } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { _count: { select: { items: true } } },
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const soLuong = Object.fromEntries(
    demTheoTrangThai.map((d) => [d.status, d._count]),
  );
  const tongTatCa = demTheoTrangThai.reduce((t, d) => t + d._count, 0);

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe="Đơn hàng"
      moTa="Bấm vào mã đơn để xem chi tiết và đổi trạng thái"
    >
      {/* Thanh lọc */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/don-hang"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !locTheo
              ? "bg-son-700 text-kem-50"
              : "border border-kem-400 bg-white text-muc-600 hover:border-son-700"
          }`}
        >
          Tất cả ({tongTatCa})
        </Link>
        {CAC_TRANG_THAI.map((tt) => (
          <Link
            key={tt}
            href={`/admin/don-hang?trangThai=${tt}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              locTheo === tt
                ? "bg-son-700 text-kem-50"
                : "border border-kem-400 bg-white text-muc-600 hover:border-son-700"
            }`}
          >
            {TEN_TRANG_THAI[tt]} ({soLuong[tt] ?? 0})
          </Link>
        ))}
      </div>

      {danhSach.length === 0 ? (
        <p className="mt-6 rounded-lg border border-kem-300 bg-white px-5 py-16 text-center text-sm text-muc-500">
          Không có đơn hàng nào ở mục này.
        </p>
      ) : (
        <BangDonHang
          danhSach={danhSach.map((don) => ({
            id: don.id,
            code: don.code,
            customerName: don.customerName,
            phone: don.phone,
            address: don.address,
            createdAt: don.createdAt.toISOString(),
            total: don.total,
            status: don.status,
            soMon: don._count.items,
          }))}
          trangThaiDangLoc={locTheo}
        />
      )}

    </KhungQuanTri>
  );
}
