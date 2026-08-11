import { NextResponse, type NextRequest } from "next/server";
import { CAC_NGON_NGU, NGON_NGU_MAC_DINH } from "@/i18n";

/**
 * Tự động thêm mã ngôn ngữ vào đường dẫn.
 *   /               →  /vi
 *   /san-pham       →  /vi/san-pham
 *   /en/san-pham    →  giữ nguyên
 *
 * Khách lần đầu vào web sẽ được đưa tới ngôn ngữ trình duyệt của họ
 * (tiếng Việt nếu trình duyệt là tiếng Việt, ngược lại vẫn ưu tiên tiếng Việt
 * vì đây là shop Việt Nam).
 */

function chonNgonNgu(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  // Chỉ chuyển sang tiếng Anh khi trình duyệt KHÔNG ưu tiên tiếng Việt
  const uuTien = acceptLanguage.split(",")[0]?.toLowerCase() ?? "";
  if (uuTien.startsWith("en")) return "en";
  return NGON_NGU_MAC_DINH;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const daCoNgonNgu = CAC_NGON_NGU.some(
    (ng) => pathname === `/${ng}` || pathname.startsWith(`/${ng}/`),
  );
  if (daCoNgonNgu) return NextResponse.next();

  const ngonNgu = chonNgonNgu(request);
  const urlMoi = request.nextUrl.clone();
  urlMoi.pathname = `/${ngonNgu}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(urlMoi);
}

export const config = {
  matcher: [
    /*
     * Bỏ qua:
     *  - /admin      (trang quản trị, chỉ tiếng Việt)
     *  - /api        (đường dẫn kỹ thuật)
     *  - /_next      (file nội bộ của Next.js)
     *  - /images     (ảnh sản phẩm)
     *  - các file tĩnh có phần mở rộng (.svg, .png, .xml, .txt…)
     */
    "/((?!admin|api|_next|images|uploads|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
