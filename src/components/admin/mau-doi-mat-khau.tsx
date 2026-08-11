"use client";

import { useActionState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";

import { doiMatKhau, type KetQua } from "@/app/actions/quan-tri";

export function MauDoiMatKhau() {
  const [ketQua, gui, dangChay] = useActionState<KetQua | null, FormData>(
    doiMatKhau,
    null,
  );

  return (
    <form
      action={gui}
      className="space-y-5 rounded-lg border border-kem-300 bg-white p-6"
    >
      <h2 className="font-display text-lg text-muc-900">Đổi mật khẩu</h2>

      <div>
        <label htmlFor="matKhauCu" className="nhan-o-nhap">
          Mật khẩu hiện tại
        </label>
        <input
          id="matKhauCu"
          name="matKhauCu"
          type="password"
          autoComplete="current-password"
          required
          className="o-nhap"
        />
      </div>

      <div>
        <label htmlFor="matKhauMoi" className="nhan-o-nhap">
          Mật khẩu mới
        </label>
        <input
          id="matKhauMoi"
          name="matKhauMoi"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="o-nhap"
        />
        <p className="mt-1 text-[11px] text-muc-500">Ít nhất 8 ký tự</p>
      </div>

      <div>
        <label htmlFor="nhapLai" className="nhan-o-nhap">
          Nhập lại mật khẩu mới
        </label>
        <input
          id="nhapLai"
          name="nhapLai"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="o-nhap"
        />
      </div>

      {ketQua && (
        <div
          className={`flex gap-2.5 rounded-md p-3 ${
            ketQua.ok
              ? "bg-emerald-50 text-emerald-800"
              : "bg-son-50 text-son-800"
          }`}
        >
          {ketQua.ok ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p className="text-[13px]">{ketQua.thongBao ?? ketQua.loi}</p>
        </div>
      )}

      <button type="submit" disabled={dangChay} className="nut-phu w-full">
        {dangChay && <Loader2 className="h-4 w-4 animate-spin" />}
        Đổi mật khẩu
      </button>
    </form>
  );
}
