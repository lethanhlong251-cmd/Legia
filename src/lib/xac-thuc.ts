import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

/**
 * ĐĂNG NHẬP TRANG QUẢN TRỊ
 * ------------------------
 * Sau khi đăng nhập đúng, hệ thống đặt một "vé" đã ký vào trình duyệt.
 * Vé này có hạn 7 ngày và không thể tự chế ra được nếu không biết
 * ADMIN_SESSION_SECRET trong file .env.
 */

const TEN_COOKIE = "chourmas-admin";
const HAN_DUNG_GIAY = 60 * 60 * 24 * 7; // 7 ngày

function layKhoaKy() {
  const chuoiBiMat = process.env.ADMIN_SESSION_SECRET;

  if (!chuoiBiMat || chuoiBiMat.length < 24) {
    throw new Error(
      "Thiếu ADMIN_SESSION_SECRET trong file .env, hoặc chuỗi quá ngắn. " +
        "Hãy đặt một chuỗi ngẫu nhiên dài ít nhất 24 ký tự.",
    );
  }
  return new TextEncoder().encode(chuoiBiMat);
}

export async function taoPhienDangNhap(idNguoiDung: string, ten: string) {
  const ve = await new SignJWT({ ten })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(idNguoiDung)
    .setIssuedAt()
    .setExpirationTime(`${HAN_DUNG_GIAY}s`)
    .sign(layKhoaKy());

  const kho = await cookies();
  kho.set(TEN_COOKIE, ve, {
    httpOnly: true, // JavaScript trong trang không đọc được
    secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS khi chạy thật
    sameSite: "lax",
    path: "/",
    maxAge: HAN_DUNG_GIAY,
  });
}

export async function xoaPhienDangNhap() {
  const kho = await cookies();
  kho.delete(TEN_COOKIE);
}

/** Trả về thông tin người đang đăng nhập, hoặc null nếu chưa đăng nhập */
export async function layNguoiDangNhap() {
  const kho = await cookies();
  const ve = kho.get(TEN_COOKIE)?.value;
  if (!ve) return null;

  try {
    const { payload } = await jwtVerify(ve, layKhoaKy());
    return { id: payload.sub as string, ten: payload.ten as string };
  } catch {
    // Vé hết hạn hoặc bị sửa
    return null;
  }
}

/**
 * Dùng ở đầu MỌI trang và MỌI hành động trong khu quản trị.
 * Chưa đăng nhập thì đá về trang đăng nhập ngay.
 */
export async function batBuocDangNhap() {
  const nguoiDung = await layNguoiDangNhap();
  if (!nguoiDung) redirect("/admin/dang-nhap");
  return nguoiDung;
}
