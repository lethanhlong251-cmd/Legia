import { jwtVerify } from "jose";

import { prisma } from "@/lib/prisma";

/**
 * TẠM ĐÓNG WEBSITE
 * ----------------
 * Bật/tắt ở trang quản trị → Cài đặt → "Tạm đóng website".
 *
 * Khi đang tạm đóng:
 *  - Khách vào bất kỳ trang nào cũng chỉ thấy trang "Tạm nghỉ" (mã 503,
 *    để Google hiểu là nghỉ tạm thời, không xoá web khỏi kết quả tìm kiếm)
 *  - Không đặt hàng được
 *  - Trang /admin vẫn vào bình thường để mở lại
 *  - Người đã đăng nhập quản trị vẫn xem được website như thường
 *
 * Giá trị lưu trong bảng SiteSetting, khoá "tamDongWeb" = "true" / "false".
 */

export const KHOA_TAM_DONG = "tamDongWeb";

// Trùng với TEN_COOKIE trong src/lib/xac-thuc.ts. Không import thẳng từ đó
// được vì file kia dùng next/headers, không chạy được trong proxy.ts.
const TEN_COOKIE_QUAN_TRI = "chourmas-admin";

export async function webDangTamDong(): Promise<boolean> {
  try {
    const muc = await prisma.siteSetting.findUnique({
      where: { key: KHOA_TAM_DONG },
    });
    return muc?.value === "true";
  } catch {
    // Đọc cơ sở dữ liệu lỗi thì coi như đang mở, không tự khoá nhầm web
    return false;
  }
}

/** Trình duyệt này có đang đăng nhập quản trị không (đọc từ cookie) */
export async function laQuanTriVien(
  layCookie: (ten: string) => string | undefined,
): Promise<boolean> {
  const ve = layCookie(TEN_COOKIE_QUAN_TRI);
  const chuoiBiMat = process.env.ADMIN_SESSION_SECRET;
  if (!ve || !chuoiBiMat) return false;

  try {
    await jwtVerify(ve, new TextEncoder().encode(chuoiBiMat));
    return true;
  } catch {
    return false;
  }
}

/** Trang "Tạm nghỉ" khách nhìn thấy. Viết tay HTML để chạy được ngay trong proxy. */
export function trangTamDong(tiengAnh: boolean): Response {
  const chu = tiengAnh
    ? {
        lang: "en",
        tieuDe: "Chourmas is taking a short break",
        moTa: "Our website is temporarily closed. We will be back soon — thank you for your patience.",
        nhan: "Temporarily closed",
      }
    : {
        lang: "vi",
        tieuDe: "Chourmas đang tạm nghỉ",
        moTa: "Website tạm đóng trong ít ngày. Chúng tôi sẽ sớm mở lại, cảm ơn bạn đã ghé thăm.",
        nhan: "Tạm đóng cửa",
      };

  const html = `<!doctype html>
<html lang="${chu.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${chu.tieuDe}</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
@font-face{font-family:"Cormorant";font-weight:500;font-display:swap;src:url(/fonts/cormorant-garamond-vietnamese-500-normal.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}
@font-face{font-family:"Cormorant";font-weight:500;font-display:swap;src:url(/fonts/cormorant-garamond-latin-500-normal.woff2) format("woff2")}
@font-face{font-family:"BeVN";font-weight:400;font-display:swap;src:url(/fonts/be-vietnam-pro-vietnamese-400-normal.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}
@font-face{font-family:"BeVN";font-weight:400;font-display:swap;src:url(/fonts/be-vietnam-pro-latin-400-normal.woff2) format("woff2")}
*{box-sizing:border-box;margin:0}
body{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:#faf6ef;color:#1a1310;font-family:"BeVN",system-ui,sans-serif;text-align:center}
main{max-width:440px}
img{width:72px;height:72px}
.nhan{margin-top:28px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#ad8438;font-weight:600}
h1{margin-top:10px;font-family:"Cormorant","Times New Roman",serif;font-weight:500;font-size:clamp(30px,7vw,40px);line-height:1.15}
.gach{width:48px;height:1px;background:#ad8438;margin:22px auto}
p.mo-ta{font-size:15px;line-height:1.7;color:#5b4d45}
</style>
</head>
<body>
<main>
<img src="/icon.svg" alt="Chourmas">
<div class="nhan">${chu.nhan}</div>
<h1>${chu.tieuDe}</h1>
<div class="gach"></div>
<p class="mo-ta">${chu.moTa}</p>
</main>
</body>
</html>`;

  return new Response(html, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
