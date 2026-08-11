import type { MetadataRoute } from "next";

const GOC = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chourmasviet.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Không để Google lập chỉ mục trang quản trị, giỏ hàng và thanh toán
      disallow: ["/admin", "/*/gio-hang", "/*/thanh-toan", "/*/dat-hang-thanh-cong"],
    },
    sitemap: `${GOC}/sitemap.xml`,
  };
}
