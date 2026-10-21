"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, PackagePlus } from "lucide-react";

import { boTheoDoiKho, kiemKho, nhapKho } from "@/app/actions/quan-tri";

/**
 * Một dòng trong trang Tồn kho: một cỡ của một sản phẩm.
 * Gõ số rồi bấm "Nhập thêm" (cộng vào kho) hoặc "Đặt đúng số" (sau khi
 * đếm lại hàng thực tế).
 */
export function DongTonKho({
  id,
  nhan,
  ghiChu,
  ton,
  dangBat,
  laMonLe,
  nguongSapHet,
}: {
  id: string;
  nhan: string;
  ghiChu?: string | null;
  ton: number | null;
  /** Công tắc "Cỡ này còn hàng" trong trang sửa sản phẩm */
  dangBat: boolean;
  laMonLe: boolean;
  nguongSapHet: number;
}) {
  const [soNhap, setSoNhap] = useState("");
  const [dangChay, batDau] = useTransition();
  const [thongBao, setThongBao] = useState<{ ok: boolean; chu: string } | null>(
    null,
  );

  const so = soNhap === "" ? NaN : Number(soNhap);
  const soHopLe = Number.isInteger(so) && so >= 0;
  const theoDoi = ton !== null;

  function chay(viec: () => Promise<{ ok: boolean; loi?: string; thongBao?: string }>) {
    setThongBao(null);
    batDau(async () => {
      const kq = await viec();
      setThongBao(
        kq.ok
          ? { ok: true, chu: kq.thongBao ?? "Đã lưu." }
          : { ok: false, chu: kq.loi ?? "Có lỗi xảy ra." },
      );
      if (kq.ok) {
        setSoNhap("");
        setTimeout(() => setThongBao(null), 3500);
      }
    });
  }

  let trangThai: { chu: string; mau: string };
  if (!theoDoi) {
    trangThai = { chu: "Chưa theo dõi", mau: "bg-kem-200 text-muc-500" };
  } else if (ton <= 0) {
    trangThai = { chu: "Hết hàng", mau: "bg-son-50 text-son-700" };
  } else if (ton <= nguongSapHet) {
    trangThai = { chu: "Sắp hết", mau: "bg-amber-100 text-amber-800" };
  } else {
    trangThai = { chu: "Còn hàng", mau: "bg-emerald-50 text-emerald-700" };
  }

  return (
    <div className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_88px_minmax(0,22rem)] sm:items-center sm:gap-5">
      {/* Tên cỡ */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-muc-800">
          {nhan}
          {laMonLe && (
            <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider text-dong-600">
              Mua lẻ
            </span>
          )}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${trangThai.mau}`}
          >
            {trangThai.chu}
          </span>
          {!dangBat && (
            <span
              className="rounded-full bg-muc-800 px-2 py-0.5 text-[11px] font-semibold text-kem-100"
              title="Đang tắt công tắc “Cỡ này còn hàng” trong trang sửa sản phẩm, khách không đặt được dù kho còn"
            >
              Đang tắt bán
            </span>
          )}
          {ghiChu && <span className="text-[11px] text-muc-500">{ghiChu}</span>}
        </div>
      </div>

      {/* Số tồn */}
      <div className="flex items-baseline gap-1.5 sm:block sm:text-right">
        <span className="text-[11px] text-muc-500 sm:hidden">Trong kho:</span>
        <span
          className={`font-display text-2xl font-semibold tabular-nums ${
            !theoDoi
              ? "text-muc-300"
              : ton <= 0
                ? "text-son-700"
                : ton <= nguongSapHet
                  ? "text-amber-700"
                  : "text-muc-900"
          }`}
        >
          {theoDoi ? ton : "—"}
        </span>
      </div>

      {/* Thao tác */}
      <div>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={soNhap}
            onChange={(e) => setSoNhap(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && soHopLe && so > 0) {
                chay(() => nhapKho(id, so));
              }
            }}
            placeholder="Số lượng"
            aria-label={`Số lượng cho ${nhan}`}
            className="o-nhap !w-24 shrink-0 !px-3 !py-2 !text-sm"
          />
          <button
            type="button"
            disabled={dangChay || !soHopLe || so === 0}
            onClick={() => chay(() => nhapKho(id, so))}
            title="Cộng thêm số này vào kho"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-son-700 px-3 py-2 text-[13px] font-semibold text-kem-50 transition-colors hover:bg-son-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {dangChay ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <PackagePlus className="h-3.5 w-3.5" />
            )}
            Nhập thêm
          </button>
          <button
            type="button"
            disabled={dangChay || !soHopLe}
            onClick={() => chay(() => kiemKho(id, so))}
            title="Sau khi đếm lại hàng: đặt kho đúng bằng số này"
            className="inline-flex flex-1 items-center justify-center rounded-md border border-kem-400 bg-white px-3 py-2 text-[13px] font-semibold text-muc-700 transition-colors hover:border-son-700 hover:text-son-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Đặt đúng số
          </button>
        </div>

        {thongBao ? (
          <p
            className={`mt-1.5 flex items-center gap-1 text-[12px] ${
              thongBao.ok ? "text-emerald-700" : "text-son-700"
            }`}
          >
            {thongBao.ok && <Check className="h-3 w-3" />}
            {thongBao.chu}
          </p>
        ) : theoDoi ? (
          <button
            type="button"
            disabled={dangChay}
            onClick={() => {
              if (
                window.confirm(
                  `Thôi theo dõi kho cho “${nhan}”?\n\nKhách sẽ đặt được không giới hạn, như trước khi có tồn kho. Lịch sử cũ vẫn được giữ.`,
                )
              ) {
                chay(() => boTheoDoiKho(id));
              }
            }}
            className="mt-1.5 text-[11px] text-muc-400 underline-offset-2 hover:text-son-700 hover:underline"
          >
            Thôi theo dõi kho cỡ này
          </button>
        ) : (
          <p className="mt-1.5 text-[11px] text-muc-400">
            Nhập số để bắt đầu theo dõi. Đang bán không giới hạn.
          </p>
        )}
      </div>
    </div>
  );
}
