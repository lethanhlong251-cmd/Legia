/** Các hàm định dạng dùng chung cho cả website */

/** 229000 → "229.000₫" */
export function dinhDangTien(soTien: number, ngonNgu: NgonNgu = "vi") {
  if (ngonNgu === "en") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(soTien);
  }
  return `${new Intl.NumberFormat("vi-VN").format(soTien)}₫`;
}

/** Ngày giờ kiểu Việt Nam: "12/08/2026 14:30" */
export function dinhDangNgay(ngay: Date | string) {
  const d = typeof ngay === "string" ? new Date(ngay) : ngay;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(d);
}

/** "Sen tứ quý" → "sen-tu-quy" — dùng khi thêm sản phẩm mới trong admin */
export function taoSlug(chuoi: string) {
  return chuoi
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Sinh mã đơn hàng dạng CH2608120001 */
export function taoMaDonHang(soThuTu: number) {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `CH${yy}${mm}${dd}${String(soThuTu).padStart(4, "0")}`;
}

/** Kiểm tra số điện thoại Việt Nam */
export function laSoDienThoaiVN(sdt: string) {
  return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(sdt.replace(/[\s.-]/g, ""));
}

/** Tính % giảm giá để hiện huy hiệu "-27%" */
export function phanTramGiam(gia: number, giaGach?: number | null) {
  if (!giaGach || giaGach <= gia) return null;
  return Math.round(((giaGach - gia) / giaGach) * 100);
}

export type NgonNgu = "vi" | "en";
