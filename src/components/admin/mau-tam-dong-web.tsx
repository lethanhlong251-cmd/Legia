"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Check, Loader2, Lock, LockOpen } from "lucide-react";

import { datTamDongWeb } from "@/app/actions/quan-tri";

/**
 * Công tắc tạm đóng / mở lại website cho khách.
 * Xem src/lib/tam-dong.ts để biết khi đóng thì chuyện gì xảy ra.
 */
export function MauTamDongWeb({ dangDong }: { dangDong: boolean }) {
  const [dangChay, batDau] = useTransition();
  const [thongBao, setThongBao] = useState<{ ok: boolean; chu: string } | null>(
    null,
  );

  function doiTrangThai() {
    const dong = !dangDong;
    if (
      dong &&
      !window.confirm(
        "Tạm đóng website?\n\nKhách sẽ không xem sản phẩm và không đặt hàng được cho tới khi bạn mở lại.",
      )
    ) {
      return;
    }

    batDau(async () => {
      const kq = await datTamDongWeb(dong);
      setThongBao(
        kq.ok
          ? { ok: true, chu: kq.thongBao ?? "Đã lưu." }
          : { ok: false, chu: kq.loi ?? "Có lỗi." },
      );
      setTimeout(() => setThongBao(null), 4000);
    });
  }

  return (
    <section
      className={`rounded-lg border p-6 ${
        dangDong ? "border-son-700/40 bg-son-50" : "border-kem-300 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h2 className="flex items-center gap-2 font-display text-lg text-muc-900">
            {dangDong ? (
              <Lock className="h-4.5 w-4.5 text-son-700" />
            ) : (
              <LockOpen className="h-4.5 w-4.5 text-dong-600" />
            )}
            {dangDong ? "Website đang TẠM ĐÓNG" : "Website đang mở bình thường"}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muc-600">
            {dangDong ? (
              <>
                Khách vào web chỉ thấy trang <strong>Tạm nghỉ</strong> và không
                đặt hàng được. Bạn đang đăng nhập quản trị nên vẫn xem được
                web như thường — muốn xem đúng như khách thấy, mở web trong cửa
                sổ ẩn danh.
              </>
            ) : (
              <>
                Bấm <strong>Tạm đóng website</strong> khi muốn nghỉ bán. Khách
                sẽ chỉ thấy trang Tạm nghỉ; trang quản trị vẫn vào được để mở
                lại bất cứ lúc nào. Đơn hàng, sản phẩm không bị mất gì.
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={doiTrangThai}
          disabled={dangChay}
          className={dangDong ? "nut-chinh" : "nut-phu"}
        >
          {dangChay ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : dangDong ? (
            <LockOpen className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          {dangDong ? "Mở lại website" : "Tạm đóng website"}
        </button>
      </div>

      {thongBao && (
        <div
          className={`mt-4 flex gap-2.5 rounded-md p-3 ${
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
    </section>
  );
}
