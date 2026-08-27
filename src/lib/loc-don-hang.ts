import type { OrderWhereInput } from "@/generated/prisma/models";
import type { OrderStatus } from "@/generated/prisma/enums";

/**
 * Bộ lọc dùng chung cho trang danh sách đơn và cho việc xuất file SPX,
 * để hai chỗ luôn hiểu tham số giống nhau — cái gì đang hiện trên bảng
 * thì xuất ra file đúng chừng ấy đơn.
 */

export const CAC_TRANG_THAI = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
] as const;

export type ThamSoLoc = {
  trangThai: OrderStatus | null;
  /** Tên khách, số điện thoại, mã đơn hoặc mã vận đơn */
  tim: string;
  /** Dạng 2026-08-27, tính theo giờ Việt Nam */
  tuNgay: string;
  denNgay: string;
};

const LA_NGAY = /^\d{4}-\d{2}-\d{2}$/;

function motChuoi(giaTri: unknown) {
  return typeof giaTri === "string" ? giaTri.trim() : "";
}

function motNgay(giaTri: unknown) {
  const chu = motChuoi(giaTri);
  if (!LA_NGAY.test(chu)) return "";
  return Number.isNaN(new Date(`${chu}T00:00:00+07:00`).getTime()) ? "" : chu;
}

/** Đọc tham số lọc từ địa chỉ trang, bỏ qua những giá trị không hợp lệ */
export function docThamSoLoc(
  thamSo: Record<string, string | string[] | undefined> | URLSearchParams,
): ThamSoLoc {
  const lay = (khoa: string) =>
    thamSo instanceof URLSearchParams ? thamSo.get(khoa) : thamSo[khoa];

  const tt = motChuoi(lay("trangThai"));

  return {
    trangThai: (CAC_TRANG_THAI as readonly string[]).includes(tt)
      ? (tt as OrderStatus)
      : null,
    tim: motChuoi(lay("tim")).slice(0, 100),
    tuNgay: motNgay(lay("tuNgay")),
    denNgay: motNgay(lay("denNgay")),
  };
}

/**
 * Chuyển bộ lọc thành điều kiện truy vấn.
 *
 * `boTrangThai` dùng khi đếm số đơn cho từng thẻ trạng thái: lúc đó cần
 * đếm trong phạm vi ngày và từ khoá đang lọc, nhưng không giới hạn trạng thái.
 */
export function taoDieuKienLoc(
  loc: ThamSoLoc,
  boTrangThai = false,
): OrderWhereInput {
  const dieuKien: OrderWhereInput = {};

  if (loc.trangThai && !boTrangThai) dieuKien.status = loc.trangThai;

  if (loc.tuNgay || loc.denNgay) {
    dieuKien.createdAt = {
      // Giờ Việt Nam, để lọc "ngày 27" ra đúng các đơn của ngày 27
      ...(loc.tuNgay ? { gte: new Date(`${loc.tuNgay}T00:00:00+07:00`) } : {}),
      ...(loc.denNgay
        ? { lte: new Date(`${loc.denNgay}T23:59:59.999+07:00`) }
        : {}),
    };
  }

  if (loc.tim) {
    // Mã vận đơn được ghi trong Ghi chú nội bộ, nên tìm cả ở đó
    const chiSo = loc.tim.replace(/\D/g, "");
    dieuKien.OR = [
      { code: { contains: loc.tim } },
      { customerName: { contains: loc.tim } },
      { phone: { contains: loc.tim } },
      { address: { contains: loc.tim } },
      { province: { contains: loc.tim } },
      { adminNote: { contains: loc.tim } },
      // Khách hay gõ số điện thoại có dấu cách hoặc dấu chấm
      ...(chiSo.length >= 3 ? [{ phone: { contains: chiSo } }] : []),
    ];
  }

  return dieuKien;
}

/** Có đang lọc gì không, để biết lúc nào hiện nút "Xoá lọc" */
export function dangLoc(loc: ThamSoLoc) {
  return Boolean(loc.tim || loc.tuNgay || loc.denNgay || loc.trangThai);
}

/**
 * Dựng lại địa chỉ trang khi đổi một tham số, giữ nguyên các tham số còn lại.
 * Nhờ vậy bấm sang thẻ trạng thái khác không mất từ khoá đang tìm.
 */
export function duongDanLoc(loc: ThamSoLoc, thayDoi: Partial<ThamSoLoc> = {}) {
  const gop = { ...loc, ...thayDoi };
  const thamSo = new URLSearchParams();
  if (gop.trangThai) thamSo.set("trangThai", gop.trangThai);
  if (gop.tim) thamSo.set("tim", gop.tim);
  if (gop.tuNgay) thamSo.set("tuNgay", gop.tuNgay);
  if (gop.denNgay) thamSo.set("denNgay", gop.denNgay);
  const chuoi = thamSo.toString();
  return `/admin/don-hang${chuoi ? `?${chuoi}` : ""}`;
}
