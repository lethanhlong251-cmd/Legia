"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";

import { doiTrangThaiDon, luuGhiChuDon } from "@/app/actions/quan-tri";
import { TEN_TRANG_THAI, THU_TU_TRANG_THAI } from "./nhan-trang-thai";

export function DieuKhienDon({
  idDon,
  trangThaiHienTai,
  ghiChuHienTai,
}: {
  idDon: string;
  trangThaiHienTai: string;
  ghiChuHienTai: string;
}) {
  const [dangChay, batDau] = useTransition();
  const [thongBao, setThongBao] = useState<string | null>(null);
  const [ghiChu, setGhiChu] = useState(ghiChuHienTai);

  function doiTrangThai(tt: string) {
    batDau(async () => {
      const kq = await doiTrangThaiDon(idDon, tt);
      setThongBao(kq.ok ? (kq.thongBao ?? "Đã lưu.") : (kq.loi ?? "Có lỗi."));
      setTimeout(() => setThongBao(null), 2500);
    });
  }

  function luuGhiChu() {
    batDau(async () => {
      const kq = await luuGhiChuDon(idDon, ghiChu);
      setThongBao(kq.ok ? (kq.thongBao ?? "Đã lưu.") : (kq.loi ?? "Có lỗi."));
      setTimeout(() => setThongBao(null), 2500);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muc-600">
          Trạng thái đơn
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {THU_TU_TRANG_THAI.map((tt) => {
            const dangChon = tt === trangThaiHienTai;
            return (
              <button
                key={tt}
                type="button"
                disabled={dangChay || dangChon}
                onClick={() => doiTrangThai(tt)}
                className={`flex items-center justify-between rounded-md border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  dangChon
                    ? "border-son-700 bg-son-50 text-son-800"
                    : "border-kem-400 bg-white text-muc-700 hover:border-son-700 disabled:opacity-50"
                }`}
              >
                {TEN_TRANG_THAI[tt]}
                {dangChon && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="ghiChu"
          className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muc-600"
        >
          Ghi chú nội bộ
        </label>
        <p className="mt-1 text-xs text-muc-500">
          Chỉ bạn nhìn thấy, khách không thấy. Ví dụ: mã vận đơn, khách hẹn giao
          lại.
        </p>
        <textarea
          id="ghiChu"
          rows={4}
          value={ghiChu}
          onChange={(e) => setGhiChu(e.target.value)}
          className="o-nhap mt-2.5"
        />
        <button
          type="button"
          onClick={luuGhiChu}
          disabled={dangChay || ghiChu === ghiChuHienTai}
          className="nut-phu mt-2.5 w-full"
        >
          {dangChay ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Lưu ghi chú
        </button>
      </div>

      {thongBao && (
        <p className="rounded-md bg-emerald-50 px-3.5 py-2.5 text-center text-[13px] font-medium text-emerald-800">
          {thongBao}
        </p>
      )}
    </div>
  );
}
