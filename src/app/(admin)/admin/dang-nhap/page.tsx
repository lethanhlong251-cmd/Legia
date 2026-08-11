import { redirect } from "next/navigation";

import { layNguoiDangNhap } from "@/lib/xac-thuc";
import { BieuTuongKhuon } from "@/components/logo";
import { MauDangNhap } from "@/components/admin/mau-dang-nhap";

export default async function TrangDangNhap() {
  // Đã đăng nhập rồi thì vào thẳng trang quản trị
  if (await layNguoiDangNhap()) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muc-900 px-4">
      <div className="hoa-van-luoi fixed inset-0 opacity-40" />

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center">
          <BieuTuongKhuon
            className="h-14 w-14"
            mauChinh="#FAF6EF"
            mauNhan="#C8A24A"
          />
          <h1 className="mt-5 font-display text-2xl tracking-[0.12em] text-kem-50">
            CHOURMAS
          </h1>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-dong-500">
            TRANG QUẢN TRỊ
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-kem-100 p-7 shadow-manh">
          <MauDangNhap />
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-kem-500">
          Quên mật khẩu? Chạy lệnh{" "}
          <code className="rounded bg-muc-800 px-1.5 py-0.5 text-dong-400">
            npm run doi-mat-khau
          </code>{" "}
          trên máy chủ.
        </p>
      </div>
    </div>
  );
}
