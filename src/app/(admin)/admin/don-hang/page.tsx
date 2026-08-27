import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import {
  CAC_TRANG_THAI,
  dangLoc,
  docThamSoLoc,
  duongDanLoc,
  taoDieuKienLoc,
} from "@/lib/loc-don-hang";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { TEN_TRANG_THAI } from "@/components/admin/nhan-trang-thai";
import { BangDonHang } from "@/components/admin/bang-don-hang";
import { ThanhLocDon } from "@/components/admin/thanh-loc-don";

export const dynamic = "force-dynamic";

/** Lấy nhiều nhất chừng này đơn một lần, đơn cũ hơn thì lọc theo ngày để xem */
const TOI_DA = 200;

export default async function TrangDanhSachDon({
  searchParams,
}: PageProps<"/admin/don-hang">) {
  const nguoiDung = await batBuocDangNhap();
  const loc = docThamSoLoc(await searchParams);

  const [danhSach, demTheoTrangThai] = await Promise.all([
    prisma.order.findMany({
      where: taoDieuKienLoc(loc),
      orderBy: { createdAt: "desc" },
      take: TOI_DA,
      include: { _count: { select: { items: true } } },
    }),
    // Đếm trong phạm vi ngày và từ khoá đang lọc, để con số trên các thẻ
    // khớp với những gì đang xem
    prisma.order.groupBy({
      by: ["status"],
      where: taoDieuKienLoc(loc, true),
      _count: true,
    }),
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
      <ThanhLocDon key={duongDanLoc(loc)} loc={loc} />

      {/* Lọc theo trạng thái */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={duongDanLoc(loc, { trangThai: null })}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !loc.trangThai
              ? "bg-son-700 text-kem-50"
              : "border border-kem-400 bg-white text-muc-600 hover:border-son-700"
          }`}
        >
          Tất cả ({tongTatCa})
        </Link>
        {CAC_TRANG_THAI.map((tt) => (
          <Link
            key={tt}
            href={duongDanLoc(loc, { trangThai: tt })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              loc.trangThai === tt
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
          {dangLoc(loc)
            ? "Không tìm thấy đơn nào khớp với bộ lọc. Thử xoá bớt điều kiện xem sao."
            : "Chưa có đơn hàng nào."}
        </p>
      ) : (
        <>
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
            loc={loc}
          />

          {danhSach.length === TOI_DA && (
            <p className="mt-3 text-center text-[13px] text-muc-500">
              Đang hiện {TOI_DA} đơn mới nhất khớp bộ lọc. Muốn xem đơn cũ hơn
              thì chọn khoảng ngày cụ thể.
            </p>
          )}
        </>
      )}
    </KhungQuanTri>
  );
}
