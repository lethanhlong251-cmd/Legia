"use client";

import { useOptimistic, useTransition } from "react";

import {
  batTatConHang,
  batTatNoiBat,
  batTatSanPham,
} from "@/app/actions/quan-tri";

type Loai = "hien" | "conHang" | "noiBat";

/**
 * Công tắc bật/tắt ngay trong bảng danh sách sản phẩm.
 * Giao diện đổi ngay khi bấm, không phải chờ máy chủ trả lời.
 */
export function CongTacNhanh({
  id,
  loai,
  batDau,
}: {
  id: string;
  loai: Loai;
  batDau: boolean;
}) {
  const [dangChay, batDauChuyen] = useTransition();
  const [bat, datBatTamThoi] = useOptimistic(batDau);

  const nhan = {
    hien: "Hiện trên web",
    conHang: "Còn hàng",
    noiBat: "Nổi bật ở trang chủ",
  }[loai];

  function chuyen() {
    batDauChuyen(async () => {
      const giaTriMoi = !bat;
      datBatTamThoi(giaTriMoi);
      if (loai === "hien") await batTatSanPham(id, giaTriMoi);
      else if (loai === "conHang") await batTatConHang(id, giaTriMoi);
      else await batTatNoiBat(id, giaTriMoi);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={bat}
      aria-label={nhan}
      title={nhan}
      disabled={dangChay}
      onClick={chuyen}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-60 ${
        bat ? "bg-emerald-600" : "bg-kem-400"
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
          bat ? "translate-x-6" : "translate-x-1"
        }`}
        style={{ height: "1.125rem", width: "1.125rem" }}
      />
    </button>
  );
}
