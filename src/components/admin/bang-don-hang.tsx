"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileSpreadsheet } from "lucide-react";

import { dinhDangNgay, dinhDangTien } from "@/lib/dinh-dang";
import { NHAN_TRANG_THAI } from "@/components/admin/nhan-trang-thai";

export type DongDonHang = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  createdAt: string;
  total: number;
  status: string;
  soMon: number;
};

/**
 * Bảng đơn hàng kèm ô chọn để xuất file SPX.
 * Không chọn đơn nào thì nút xuất lấy toàn bộ đơn đang hiện.
 */
export function BangDonHang({
  danhSach,
  trangThaiDangLoc,
}: {
  danhSach: DongDonHang[];
  trangThaiDangLoc: string | null;
}) {
  const [daChon, setDaChon] = useState<string[]>([]);

  const chonHet = daChon.length > 0 && daChon.length === danhSach.length;

  const duongDanXuat = useMemo(() => {
    const thamSo = new URLSearchParams();
    if (daChon.length) thamSo.set("ma", daChon.join(","));
    else if (trangThaiDangLoc) thamSo.set("trangThai", trangThaiDangLoc);
    const chuoi = thamSo.toString();
    return `/admin/don-hang/xuat-spx${chuoi ? `?${chuoi}` : ""}`;
  }, [daChon, trangThaiDangLoc]);

  function bat(id: string) {
    setDaChon((cu) =>
      cu.includes(id) ? cu.filter((m) => m !== id) : [...cu, id],
    );
  }

  return (
    <>
      {/* ---------- Thanh xuất file ---------- */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-kem-300 bg-white px-5 py-3.5">
        <p className="text-[13px] text-muc-600">
          {daChon.length > 0 ? (
            <>
              Đã chọn{" "}
              <strong className="text-muc-900">{daChon.length} đơn</strong>
              {" · "}
              <button
                type="button"
                onClick={() => setDaChon([])}
                className="text-son-700 hover:underline"
              >
                Bỏ chọn
              </button>
            </>
          ) : (
            <>
              Chưa chọn đơn nào — xuất file sẽ lấy cả{" "}
              <strong className="text-muc-900">{danhSach.length} đơn</strong>{" "}
              đang hiện
            </>
          )}
        </p>

        <a
          href={duongDanXuat}
          className="nut-chinh !py-2 !text-[13px]"
          download
        >
          <FileSpreadsheet className="h-4 w-4" />
          Xuất file SPX
        </a>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-kem-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead className="bg-kem-100 text-left text-xs uppercase tracking-wider text-muc-500">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Chọn tất cả đơn"
                    checked={chonHet}
                    onChange={(e) =>
                      setDaChon(e.target.checked ? danhSach.map((d) => d.id) : [])
                    }
                    className="h-4 w-4 accent-son-700"
                  />
                </th>
                <th className="px-5 py-3 font-semibold">Mã đơn</th>
                <th className="px-5 py-3 font-semibold">Khách hàng</th>
                <th className="px-5 py-3 font-semibold">Địa chỉ</th>
                <th className="px-5 py-3 font-semibold">Thời gian</th>
                <th className="px-5 py-3 text-right font-semibold">Tổng tiền</th>
                <th className="px-5 py-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kem-200">
              {danhSach.map((don) => {
                const chon = daChon.includes(don.id);
                return (
                  <tr
                    key={don.id}
                    className={chon ? "bg-dong-50" : "hover:bg-kem-50"}
                  >
                    <td className="px-4 py-3.5 align-top">
                      <input
                        type="checkbox"
                        aria-label={`Chọn đơn ${don.code}`}
                        checked={chon}
                        onChange={() => bat(don.id)}
                        className="mt-0.5 h-4 w-4 accent-son-700"
                      />
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <Link
                        href={`/admin/don-hang/${don.id}`}
                        className="font-semibold text-son-700 hover:underline"
                      >
                        {don.code}
                      </Link>
                      <p className="text-[11px] text-muc-500">
                        {don.soMon} sản phẩm
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
