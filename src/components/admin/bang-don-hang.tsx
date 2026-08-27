"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, Check, FileSpreadsheet } from "lucide-react";

import {
  doiTrangThaiDon,
  doiTrangThaiNhieuDon,
} from "@/app/actions/quan-tri";
import { dinhDangNgay, dinhDangTien } from "@/lib/dinh-dang";
import {
  TEN_TRANG_THAI,
  THU_TU_TRANG_THAI,
} from "@/components/admin/nhan-trang-thai";
import { OChonTrangThai } from "@/components/admin/o-chon-trang-thai";

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
 * Bảng đơn hàng: đổi trạng thái ngay trên dòng, hoặc đánh dấu cả loạt,
 * và xuất file SPX cho những đơn đang chọn.
 */
export function BangDonHang({
  danhSach,
  trangThaiDangLoc,
}: {
  danhSach: DongDonHang[];
  trangThaiDangLoc: string | null;
}) {
  const [daChon, setDaChon] = useState<string[]>([]);
  const [dangChay, batDau] = useTransition();
  const [dangLuu, setDangLuu] = useState<string[]>([]);
  const [thongBao, setThongBao] = useState<{ ok: boolean; chu: string } | null>(
    null,
  );

  // Đổi xong là thấy ngay, không phải chờ máy chủ trả trang mới về
  const [ttVuaDoi, setTtVuaDoi] = useState<Record<string, string>>({});
  const trangThaiCua = (don: DongDonHang) => ttVuaDoi[don.id] ?? don.status;

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

  function bao(kq: { ok: boolean; loi?: string; thongBao?: string }) {
    setThongBao(
      kq.ok
        ? { ok: true, chu: kq.thongBao ?? "Đã lưu." }
        : { ok: false, chu: kq.loi ?? "Có lỗi." },
    );
    setTimeout(() => setThongBao(null), 3000);
  }

  /** Đổi trạng thái một đơn ngay trên dòng của nó */
  function doiMotDon(don: DongDonHang, trangThaiMoi: string) {
    if (trangThaiMoi === trangThaiCua(don)) return;
    if (
      trangThaiMoi === "CANCELLED" &&
      !window.confirm(`Huỷ đơn ${don.code}?`)
    ) {
      return;
    }

    setDangLuu((cu) => [...cu, don.id]);
    batDau(async () => {
      const kq = await doiTrangThaiDon(don.id, trangThaiMoi);
      if (kq.ok) setTtVuaDoi((cu) => ({ ...cu, [don.id]: trangThaiMoi }));
      setDangLuu((cu) => cu.filter((m) => m !== don.id));
      bao(kq);
    });
  }

  /** Đánh dấu cả loạt đơn đang chọn */
  function doiCaLoat(trangThaiMoi: string) {
    if (!trangThaiMoi || daChon.length === 0) return;
    const chac = window.confirm(
      `Chuyển ${daChon.length} đơn sang "${TEN_TRANG_THAI[trangThaiMoi]}"?`,
    );
    if (!chac) return;

    const cacId = [...daChon];
    setDangLuu(cacId);
    batDau(async () => {
      const kq = await doiTrangThaiNhieuDon(cacId, trangThaiMoi);
      if (kq.ok) {
        setTtVuaDoi((cu) => {
          const moi = { ...cu };
          for (const id of cacId) moi[id] = trangThaiMoi;
          return moi;
        });
        setDaChon([]);
      }
      setDangLuu([]);
      bao(kq);
    });
  }

  return (
    <>
      {/* ---------- Thanh thao tác hàng loạt ---------- */}
      <div className="mt-6 rounded-lg border border-kem-300 bg-white px-5 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
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
                Đánh dấu ô vuông để chọn đơn — chưa chọn thì xuất file lấy cả{" "}
                <strong className="text-muc-900">{danhSach.length} đơn</strong>{" "}
                đang hiện
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {daChon.length > 0 && (
              <select
                aria-label="Đánh dấu tất cả đơn đang chọn"
                value=""
                disabled={dangChay}
                onChange={(e) => doiCaLoat(e.target.value)}
                className="cursor-pointer rounded-md border border-kem-400 bg-white px-3 py-2 text-[13px] font-medium text-muc-700 outline-none hover:border-son-700 focus-visible:ring-2 focus-visible:ring-son-700 disabled:opacity-50"
              >
                <option value="">Đánh dấu tất cả là…</option>
                {THU_TU_TRANG_THAI.map((tt) => (
                  <option key={tt} value={tt}>
                    {TEN_TRANG_THAI[tt]}
                  </option>
                ))}
              </select>
            )}

            <a
              href={duongDanXuat}
              className="nut-chinh !py-2 !text-[13px]"
              download
            >
              <FileSpreadsheet className="h-4 w-4" />
              Xuất file SPX
            </a>
          </div>
        </div>

        {thongBao && (
          <div
            className={`mt-3 flex gap-2.5 rounded-md p-3 ${
              thongBao.ok
                ? "bg-emerald-50 text-emerald-800"
                : "bg-son-50 text-son-800"
            }`}
          >
            {thongBao.ok ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <p className="text-[13px]">{thongBao.chu}</p>
          </div>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-kem-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
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
                      <OChonTrangThai
                        trangThai={trangThaiCua(don)}
                        dangLuu={dangLuu.includes(don.id)}
                        khiDoi={(tt) => doiMotDon(don, tt)}
                      />
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
