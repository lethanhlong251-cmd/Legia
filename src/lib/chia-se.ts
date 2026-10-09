import type { Metadata } from "next";

/**
 * THÔNG TIN KHI CHIA SẺ LINK (Facebook, Zalo, Messenger)
 * ------------------------------------------------------
 * Next.js không gộp `openGraph` của trang con với bố cục chung: trang nào tự
 * khai báo thì thay hẳn phần của bố cục. Vì vậy mỗi trang gọi hàm này để có
 * đủ og:url, tiêu đề, mô tả và ảnh của CHÍNH trang đó — thiếu og:url thì
 * Facebook báo lỗi, còn dùng chung của trang chủ thì link nào chia sẻ cũng
 * hiện tiêu đề trang chủ.
 */

export const ANH_CHIA_SE = "/anh-chia-se-thachlan.jpg";

export const TIEU_DE_CHUNG = {
  vi: "Khuôn bánh trung thu Thach Lan — Độc quyền hoa văn Việt",
  en: "Thach Lan Mooncake Molds — Exclusive Vietnamese patterns",
} as const;

export const MO_TA_CHUNG = {
  vi: "Khuôn bánh trung thu lò xo hoa văn độc quyền. Miễn phí vận chuyển toàn quốc, nhận hàng kiểm tra rồi mới thanh toán. Thach Lan tự thiết kế hoa văn và bán trực tiếp.",
  en: "Spring-loaded mooncake molds with exclusive Vietnamese patterns. Free nationwide delivery, inspect before you pay. Designed and sold directly by Thach Lan.",
} as const;

export function thongTinChiaSe({
  lang,
  duongDan,
  tieuDe,
  moTa,
  anh,
}: {
  lang: string;
  /** Phần sau /vi hoặc /en, ví dụ "/gioi-thieu". Trang chủ để "". */
  duongDan: string;
  /** Tiêu đề riêng của trang. Bỏ trống = tiêu đề chung của shop. */
  tieuDe?: string;
  moTa?: string | null;
  /** Ảnh riêng (vd ảnh sản phẩm). Bỏ trống = ảnh chia sẻ chung. */
  anh?: { url: string; width: number; height: number; alt?: string };
}): Pick<Metadata, "openGraph" | "twitter"> {
  const ngonNgu = lang === "en" ? "en" : "vi";
  const tieuDeDayDu = tieuDe ? `${tieuDe} — Thach Lan` : TIEU_DE_CHUNG[ngonNgu];
  const moTaDayDu = moTa || MO_TA_CHUNG[ngonNgu];
  const anhDung = anh ?? {
    url: ANH_CHIA_SE,
    width: 1200,
    height: 630,
    alt: TIEU_DE_CHUNG[ngonNgu],
  };

  return {
    openGraph: {
      type: "website",
      url: `/${ngonNgu}${duongDan}`,
      locale: ngonNgu === "vi" ? "vi_VN" : "en_US",
      siteName: "Thach Lan",
      title: tieuDeDayDu,
      description: moTaDayDu,
      images: [{ ...anhDung, alt: anhDung.alt ?? tieuDeDayDu }],
    },
    twitter: {
      card: "summary_large_image",
      title: tieuDeDayDu,
      description: moTaDayDu,
      images: [anhDung.url],
    },
  };
}
