import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Package,
  ScrollText,
  TrendingUp,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { dinhDangNgay, dinhDangTien } from "@/lib/dinh-dang";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { NHAN_TRANG_THAI } from "@/components/admin/nhan-trang-thai";

export const dynamic = "force-dynamic";

export default async function TrangTongQuan() {
  const nguoiDung = await batBuocDangNhap();

  const dauThang = new Date();
  dauThang.setDate(1);
  dauThang.setHours(0, 0, 0, 0);

  const [choXuLy, tongDon, doanhThuThang, sanPhamHien, hetHang, donGanDay] =
    await Promise.all([
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "DELIVERED", createdAt: { gte: dauThang } },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, inStock: false } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { _count: { select: { items: true } } },
      }),
    ]);

  const oThongKe = [
    {
      nhan: "Đơn chờ xử lý",
      giaTri: String(choXuLy),
      icon: AlertTriangle,
      nhanManh: choXuLy > 0,
      dich: "/admin/don-hang?trangThai=PENDING",
    },
    {
      nhan: "Tổng số đơn",
      giaTri: String(tongDon),
      icon: ScrollText,
      dich: "/admin/don-hang",
    },
    {
      nhan: "Doanh thu tháng này",
      giaTri: dinhDangTien(doanhThuThang._sum.total ?? 0),
      icon: TrendingUp,
      ghiChu: "Tính trên đơn đã giao thành công",
    },
    {
      nhan: "Sản phẩm đang bán",
      giaTri: String(sanPhamHien),
      icon: Package,
      ghiChu: hetHang > 0 ? `${hetHang} mẫu đang hết hàng` : undefined,
      dich: "/admin/san-pham",
    },
  ];

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe="Tổng quan"
      moTa="Tình hình bán hàng của Chourmas"
    >
      {/* Ô thống kê */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {oThongKe.map(({ nhan, giaTri, icon: Icon, nhanManh, ghiChu, dich }) => {
          const noiDung = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-medium text-muc-500">{nhan}</p>
                <Icon
                  className={`h-4 w-4 ${nhanManh ? "text-son-700" : "text-dong-500"}`}
                />
              </div>
              <p
                className={`mt-2.5 font-display text-2xl font-semibold ${
                  nhanManh ? "text-son-700" : "text-muc-900"
                }`}
              >
                {giaTri}
              </p>
              {ghiChu && (
                <p className="mt-1 text-[11px] text-muc-500">{ghiChu}</p>
              )}
            </>
          );

          return dich ? (
            <Link
              key={nhan}
              href={dich}
              className="rounded-lg border border-kem-300 bg-white p-5 transition-colors hover:border-dong-400"
            >
              {noiDung}
            </Link>
          ) : (
            <div
              key={nhan}
              className="rounded-lg border border-kem-300 bg-white p-5"
            >
              {noiDung}
            </div>
          );
        })}
      </div>

      {/* Đơn gần đây */}
      <div className="mt-8 overflow-hidden rounded-lg border border-kem-300 bg-white">
        <div className="flex items-center justify-between border-b border-kem-300 px-5 py-4">
          <h2 className="font-display text-lg text-muc-900">Đơn hàng gần đây</h2>
          <Link
            href="/admin/don-hang"
            className="inline-flex items-center gap-1 text-sm font-medium text-son-700 hover:underline"
          >
            Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {donGanDay.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muc-500">
            Chưa có đơn hàng nào. Đơn mới sẽ hiện ở đây và được báo qua Telegram.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-kem-100 text-left text-xs uppercase tracking-wider text-muc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Mã đơn</th>
                  <th className="px-5 py-3 font-semibold">Khách hàng</th>
                  <th className="px-5 py-3 font-semibold">Thời gian</th>
                  <th className="px-5 py-3 text-right font-semibold">Tổng tiền</th>
                  <th className="px-5 py-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kem-200">
                {donGanDay.map((don) => (
                  <tr key={don.id} className="hover:bg-kem-50">
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-muc-800">
                        {don.customerName}
                      </p>
                      <p className="text-[11px] text-muc-500">{don.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muc-600">
                      {dinhDangNgay(don.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-muc-800">
                      {dinhDangTien(don.total)}
                    </td>
                    <td className="px-5 py-3.5">
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
