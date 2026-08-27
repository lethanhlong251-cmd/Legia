import { NextResponse, type NextRequest } from "next/server";
import { CAC_NGON_NGU, NGON_NGU_MAC_DINH } from "@/i18n";

/**
 * Tự động thêm mã ngôn ngữ vào đường dẫn.
 *   /               →  /vi
 *   /san-pham       →  /vi/san-pham
 *   /en/san-pham    →  giữ nguyên
 *
 * Đây là shop Việt Nam nên mặc định luôn là tiếng Việt, bất kể trình duyệt
 * của khách đang đặt ngôn ngữ gì — nhiều người Việt dùng điện thoại cài
 * tiếng Anh, trước đây họ vào web lại ra bản tiếng Anh.
 * Muốn xem bản tiếng Anh thì bấm nút EN ở đầu trang, hoặc vào thẳng /en.
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const daCoNgonNgu = CAC_NGON_NGU.some(
    (ng) => pathname === `/${ng}` || pathname.startsWith(`/${ng}/`),
  );
  if (daCoNgonNgu) return NextResponse.next();

  const urlMoi = request.nextUrl.clone();
  urlMoi.pathname = `/${NGON_NGU_MAC_DINH}${pathname === "/" ? "" : pathname}`;
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
