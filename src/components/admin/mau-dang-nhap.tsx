"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { dangNhap, type KetQua } from "@/app/actions/quan-tri";

export function MauDangNhap() {
  const [ketQua, guiForm, dangChay] = useActionState<KetQua | null, FormData>(
    dangNhap,
    null,
  );

  return (
    <form action={guiForm} className="space-y-5">
      <div>
        <label htmlFor="username" className="nhan-o-nhap">
          Tài khoản
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          required
          className="o-nhap"
        />
      </div>

      <div>
        <label htmlFor="password" className="nhan-o-nhap">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="o-nhap"
        />
      </div>

      {ketQua?.loi && (
        <div className="flex gap-2.5 rounded-md border border-son-200 bg-son-50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-son-700" />
          <p className="text-[13px] text-son-800">{ketQua.loi}</p>
        </div>
      )}

      <button type="submit" disabled={dangChay} className="nut-chinh w-full">
        {dangChay ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang kiểm tra…
          </>
        ) : (
          "Đăng nhập"
        )}
      </button>
    </form>
  );
}
