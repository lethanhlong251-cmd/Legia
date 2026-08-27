"use client";

import { ChevronDown, Loader2 } from "lucide-react";

import {
  MAU_TRANG_THAI,
  TEN_TRANG_THAI,
  THU_TU_TRANG_THAI,
} from "./nhan-trang-thai";

/**
 * Ô chọn trạng thái ngay trên dòng đơn hàng — đổi là lưu luôn,
 * không phải mở từng đơn ra.
 */
export function OChonTrangThai({
  trangThai,
  dangLuu,
  khiDoi,
}: {
  trangThai: string;
  dangLuu: boolean;
  khiDoi: (trangThaiMoi: string) => void;
}) {
  const mau = MAU_TRANG_THAI[trangThai] ?? "bg-kem-300 text-muc-600";

  return (
    <div className={`relative inline-flex rounded-full ${mau}`}>
      <select
        aria-label="Đổi trạng thái đơn"
        value={trangThai}
        disabled={dangLuu}
        onChange={(e) => khiDoi(e.target.value)}
        className="cursor-pointer appearance-none rounded-full bg-transparent py-1 pl-2.5 pr-7 text-[11px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-son-700 disabled:cursor-wait"
      >
        {THU_TU_TRANG_THAI.map((tt) => (
          <option key={tt} value={tt} className="bg-white text-muc-800">
            {TEN_TRANG_THAI[tt]}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2">
        {dangLuu ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ChevronDown className="h-3 w-3 opacity-60" />
        )}
      </span>
    </div>
  );
}
