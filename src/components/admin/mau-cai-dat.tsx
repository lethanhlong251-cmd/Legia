"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";

import { luuCaiDat } from "@/app/actions/quan-tri";
import type { CaiDat } from "@/lib/du-lieu";

export function MauCaiDat({ banDau }: { banDau: CaiDat }) {
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
      khoa: "hotline",
      nhan: "Số điện thoại / Hotline",
      giaTri: banDau.hotline,
      goiY: "0377497286",
      moTa: "Hiện ở đầu trang, chân trang và trang Liên hệ",
    },
    {
      khoa: "zalo",
      nhan: "Số Zalo",
      giaTri: banDau.zalo,
      goiY: "0377497286",
      moTa: "Dùng cho nút Zalo nổi ở góc màn hình",
    },
    {
      khoa: "facebook",
      nhan: "Link Facebook",
      giaTri: banDau.facebook,
      goiY: "https://www.facebook.com/...",
      moTa: "Để trống thì website ẩn nút Facebook",
    },
    {
      khoa: "email",
      nhan: "Email",
      giaTri: banDau.email,
      goiY: "Không bắt buộc",
      moTa: "",
    },
    {
      khoa: "diaChi",
      nhan: "Khu vực bán hàng",
      giaTri: banDau.diaChi,
      goiY: "Bán hàng online, giao toàn quốc",
      moTa: "",
    },
    {
      khoa: "gioLamViec",
      nhan: "Thời gian nhận đơn",
      giaTri: banDau.gioLamViec,
      goiY: "Nhận đơn 24/7",
      moTa: "",
    },
  ];

  return (
    <form
      action={gui}
      className="space-y-5 rounded-lg border border-kem-300 bg-white p-6"
    >
      <h2 className="font-display text-lg text-muc-900">Thông tin liên hệ</h2>

      {cacO.map(({ khoa, nhan, giaTri, goiY, moTa }) => (
        <div key={khoa}>
          <label htmlFor={khoa} className="nhan-o-nhap">
            {nhan}
          </label>
          <input
            id={khoa}
            name={khoa}
            defaultValue={giaTri}
            placeholder={goiY}
            className="o-nhap"
          />
          {moTa && <p className="mt-1 text-[11px] text-muc-500">{moTa}</p>}
        </div>
      ))}

      <label className="flex cursor-pointer gap-3 border-t border-kem-300 pt-5">
        <input
          type="checkbox"
          name="hienGiaGach"
          defaultChecked={banDau.hienGiaGach}
          className="mt-0.5 h-4 w-4 accent-son-700"
        />
        <span>
          <span className="block text-sm font-medium text-muc-800">
            Hiện giá gạch ngang
          </span>
          <span className="block text-[11px] text-muc-500">
            Tắt đi thì website chỉ hiện giá bán, không hiện giá gốc và phần trăm
            giảm
          </span>
        </span>
      </label>

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
        Lưu cài đặt
      </button>
    </form>
  );
}
