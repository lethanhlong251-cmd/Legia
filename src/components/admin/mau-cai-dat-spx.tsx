"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Check, Loader2, Truck } from "lucide-react";

import { luuCaiDat } from "@/app/actions/quan-tri";
import type { CaiDat } from "@/lib/du-lieu";

/**
 * Thông số bưu gửi điền sẵn vào file Excel gửi cho SPX.
 * Sửa ở đây, không phải sửa code.
 */
export function MauCaiDatSPX({ banDau }: { banDau: CaiDat }) {
  const [dangChay, batDau] = useTransition();
  const [thongBao, setThongBao] = useState<{ ok: boolean; chu: string } | null>(
    null,
  );

  function gui(formData: FormData) {
    batDau(async () => {
      const kq = await luuCaiDat(formData);
      setThongBao(
        kq.ok
          ? { ok: true, chu: kq.thongBao ?? "Đã lưu." }
          : { ok: false, chu: kq.loi ?? "Có lỗi." },
      );
      setTimeout(() => setThongBao(null), 3000);
    });
  }

  const cacO = [
    {
      khoa: "spxCanNang",
      nhan: "Cân nặng mỗi sản phẩm (kg)",
      giaTri: banDau.spxCanNang,
      moTa: "Nhân với số lượng hàng trong đơn ra tổng cân nặng bưu gửi",
    },
    { khoa: "spxDai", nhan: "Chiều dài hộp (cm)", giaTri: banDau.spxDai, moTa: "" },
    { khoa: "spxRong", nhan: "Chiều rộng hộp (cm)", giaTri: banDau.spxRong, moTa: "" },
    { khoa: "spxCao", nhan: "Chiều cao hộp (cm)", giaTri: banDau.spxCao, moTa: "" },
  ];

  const cacBatTat = [
    {
      khoa: "spxChoXemHang",
      nhan: "Cho xem hàng, không cho thử",
      giaTri: banDau.spxChoXemHang,
      moTa: "Khách được mở hộp xem trước khi trả tiền",
    },
    {
      khoa: "spxChoThuHang",
      nhan: "Cho phép thử hàng",
      giaTri: banDau.spxChoThuHang,
      moTa: "Thường tắt với hàng khuôn bánh",
    },
  ];

  return (
    <form
      action={gui}
      className="space-y-5 rounded-lg border border-kem-300 bg-white p-6"
    >
      <div>
        <h2 className="flex items-center gap-2 font-display text-lg text-muc-900">
          <Truck className="h-4.5 w-4.5 text-dong-600" />
          Thông số gửi hàng SPX
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-muc-500">
          Điền sẵn vào file Excel khi bấm{" "}
          <strong className="text-muc-700">Xuất file SPX</strong> ở mục Đơn
          hàng. Tải file đó lên spx.vn qua Tạo đơn → Tạo nhiều đơn hàng.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cacO.map(({ khoa, nhan, giaTri, moTa }) => (
          <div key={khoa}>
            <label htmlFor={khoa} className="nhan-o-nhap">
              {nhan}
            </label>
            <input
              id={khoa}
              name={khoa}
              type="number"
              step="0.01"
              min="0"
              defaultValue={giaTri}
              className="o-nhap"
            />
            {moTa && <p className="mt-1 text-[11px] text-muc-500">{moTa}</p>}
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-kem-300 pt-5">
        {cacBatTat.map(({ khoa, nhan, giaTri, moTa }) => (
          <label key={khoa} className="flex cursor-pointer gap-3">
            {/* Ô ẩn để khi bỏ đánh dấu vẫn có giá trị gửi lên máy chủ */}
            <input type="hidden" name={khoa} value="off" />
            <input
              type="checkbox"
              name={khoa}
              defaultChecked={giaTri}
              className="mt-0.5 h-4 w-4 accent-son-700"
            />
            <span>
              <span className="block text-sm font-medium text-muc-800">
                {nhan}
              </span>
              <span className="block text-[11px] text-muc-500">{moTa}</span>
            </span>
          </label>
        ))}
      </div>

      {thongBao && (
        <div
          className={`flex gap-2.5 rounded-md p-3 ${
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

      <button type="submit" disabled={dangChay} className="nut-chinh w-full">
        {dangChay && <Loader2 className="h-4 w-4 animate-spin" />}
        Lưu thông số SPX
      </button>
    </form>
  );
}
