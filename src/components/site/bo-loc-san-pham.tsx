"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowUpDown, X } from "lucide-react";

import type { NgonNgu } from "@/i18n";

/**
 * BỘ LỌC SẢN PHẨM
 * ---------------
 * Lựa chọn được ghi thẳng vào địa chỉ trang, ví dụ:
 *   /vi/san-pham?mat=4&co=150g&sap=gia-tang
 *
 * Nhờ vậy khách gửi đường dẫn cho bạn bè thì mở ra vẫn đúng bộ lọc đó,
 * và bấm nút quay lại của trình duyệt cũng hoạt động đúng.
 */

type MucDem = { giaTri: number | string; soLuong: number };

export function BoLocSanPham({
  ngonNgu,
  soMat,
  co,
  tong,
  soKetQua,
}: {
  ngonNgu: NgonNgu;
  soMat: MucDem[];
  co: MucDem[];
  tong: number;
  soKetQua: number;
}) {
  const router = useRouter();
  const thamSo = useSearchParams();
  const [dangDoi, batDauDoi] = useTransition();

  const vi = ngonNgu === "vi";
  const matDangChon = thamSo.get("mat");
  const coDangChon = thamSo.get("co");
  const sapDangChon = thamSo.get("sap") ?? "mac-dinh";
  const dangLoc = Boolean(matDangChon || coDangChon || thamSo.get("sap"));

  function doiThamSo(ten: string, giaTri: string | null) {
    const moi = new URLSearchParams(thamSo.toString());
    if (giaTri === null || moi.get(ten) === giaTri) moi.delete(ten);
    else moi.set(ten, giaTri);

    const chuoi = moi.toString();
    batDauDoi(() => {
      router.replace(`/${ngonNgu}/san-pham${chuoi ? `?${chuoi}` : ""}`, {
        scroll: false,
      });
    });
  }

  function xoaHetLoc() {
    batDauDoi(() => {
      router.replace(`/${ngonNgu}/san-pham`, { scroll: false });
    });
  }

  const kieuNut = (dangChon: boolean) =>
    `rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
      dangChon
        ? "border-son-700 bg-son-700 text-kem-50"
        : "border-kem-400 bg-white text-muc-600 hover:border-son-700 hover:text-son-700"
    }`;

  return (
    <div
      className={`transition-opacity ${dangDoi ? "opacity-60" : "opacity-100"}`}
    >
      <div className="flex flex-col gap-4 rounded-lg border border-kem-300 bg-kem-50 p-4 sm:p-5">
        {/* Lọc theo số mặt */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 w-full text-[11px] font-semibold uppercase tracking-[0.14em] text-muc-500 sm:w-auto">
            {vi ? "Số mặt hoa văn" : "Pattern faces"}
          </span>
          {soMat.map(({ giaTri, soLuong }) => (
            <button
              key={giaTri}
              type="button"
              onClick={() => doiThamSo("mat", String(giaTri))}
              aria-pressed={matDangChon === String(giaTri)}
              className={kieuNut(matDangChon === String(giaTri))}
            >
              {giaTri} {vi ? "mặt" : "faces"}
              <span className="ml-1.5 opacity-60">{soLuong}</span>
            </button>
          ))}
        </div>

        {/* Lọc theo cỡ */}
        <div className="flex flex-wrap items-center gap-2 border-t border-kem-300 pt-4">
          <span className="mr-1 w-full text-[11px] font-semibold uppercase tracking-[0.14em] text-muc-500 sm:w-auto">
            {vi ? "Cỡ bánh" : "Cake size"}
          </span>
          {co.map(({ giaTri, soLuong }) => (
            <button
              key={giaTri}
              type="button"
              onClick={() => doiThamSo("co", String(giaTri))}
              aria-pressed={coDangChon === String(giaTri)}
              className={kieuNut(coDangChon === String(giaTri))}
            >
              {giaTri}
              <span className="ml-1.5 opacity-60">{soLuong}</span>
            </button>
          ))}
        </div>

        {/* Sắp xếp và xoá lọc */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-kem-300 pt-4">
          <label className="flex items-center gap-2 text-[13px] text-muc-600">
            <ArrowUpDown className="h-3.5 w-3.5 text-muc-400" />
            <span className="sr-only">{vi ? "Sắp xếp" : "Sort"}</span>
            <select
              value={sapDangChon}
              onChange={(e) => doiThamSo("sap", e.target.value)}
              className="rounded-md border border-kem-400 bg-white px-3 py-1.5 text-[13px] font-medium text-muc-700 focus:border-son-700 focus:outline-none"
            >
              <option value="mac-dinh">
                {vi ? "Sắp xếp: Mặc định" : "Sort: Default"}
              </option>
              <option value="gia-tang">
                {vi ? "Giá thấp đến cao" : "Price: low to high"}
              </option>
              <option value="gia-giam">
                {vi ? "Giá cao đến thấp" : "Price: high to low"}
              </option>
            </select>
          </label>

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-muc-500">
              {dangLoc
                ? vi
                  ? `${soKetQua} trên ${tong} mẫu`
                  : `${soKetQua} of ${tong}`
                : vi
                  ? `${tong} mẫu khuôn`
                  : `${tong} molds`}
            </span>
            {dangLoc && (
              <button
                type="button"
                onClick={xoaHetLoc}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] font-medium text-son-700 transition-colors hover:bg-son-50"
              >
                <X className="h-3.5 w-3.5" />
                {vi ? "Bỏ lọc" : "Clear"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
