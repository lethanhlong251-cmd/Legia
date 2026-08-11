import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { dinhDangNgay, dinhDangTien } from "@/lib/dinh-dang";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import {
  NHAN_TRANG_THAI,
  TEN_TRANG_THAI,
} from "@/components/admin/nhan-trang-thai";
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

      <div className="mt-6 overflow-hidden rounded-lg border border-kem-300 bg-white">
        {danhSach.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-muc-500">
            Không có đơn hàng nào ở mục này.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-kem-100 text-left text-xs uppercase tracking-wider text-muc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Mã đơn</th>
                  <th className="px-5 py-3 font-semibold">Khách hàng</th>
                  <th className="px-5 py-3 font-semibold">Địa chỉ</th>
                  <th className="px-5 py-3 font-semibold">Thời gian</th>
                  <th className="px-5 py-3 text-right font-semibold">Tổng tiền</th>
                  <th className="px-5 py-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kem-200">
                {danhSach.map((don) => (
                  <tr key={don.id} className="hover:bg-kem-50">
                    <td className="px-5 py-3.5 align-top">
                      <Link
                        href={`/admin/don-hang/${don.id}`}
                        className="font-semibold text-son-700 hover:underline"
                      >
                        {don.code}
                      </Link>
                      <p className="text-[11px] text-muc-500">
                        {don._count.items} sản phẩm
                      </p>
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-medium text-muc-800">
                        {don.customerName}
                      </p>
                      <a
                        href={`tel:${don.phone}`}
                        className="text-[11px] text-son-700 hover:underline"
                      >
                        {don.phone}
                      </a>
                    </td>
                    <td className="max-w-[260px] px-5 py-3.5 align-top text-[13px] text-muc-600">
                      {don.address}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 align-top text-muc-600">
                      {dinhDangNgay(don.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right align-top font-semibold text-muc-800">
                      {dinhDangTien(don.total)}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <NHAN_TRANG_THAI trangThai={don.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </KhungQuanTri>
  );
}
