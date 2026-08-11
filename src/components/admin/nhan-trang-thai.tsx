/** Nhãn màu cho trạng thái đơn hàng, dùng chung ở nhiều trang quản trị */

export const TEN_TRANG_THAI: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã huỷ",
};

const MAU_TRANG_THAI: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPING: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-kem-300 text-muc-600",
};

export function NHAN_TRANG_THAI({ trangThai }: { trangThai: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        MAU_TRANG_THAI[trangThai] ?? "bg-kem-300 text-muc-600"
      }`}
    >
      {TEN_TRANG_THAI[trangThai] ?? trangThai}
    </span>
  );
}
