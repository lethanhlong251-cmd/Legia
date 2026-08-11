import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CAC_NGON_NGU } from "@/i18n";

const GOC = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chourmasviet.com";

/** Sơ đồ website gửi cho Google, tự cập nhật theo sản phẩm đang bán */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sanPham = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const trangTinh = [
    { duong: "", uuTien: 1 },
    { duong: "/san-pham", uuTien: 0.9 },
    { duong: "/huong-dan", uuTien: 0.7 },
    { duong: "/gioi-thieu", uuTien: 0.6 },
    { duong: "/lien-he", uuTien: 0.6 },
    { duong: "/chinh-sach/van-chuyen", uuTien: 0.3 },
    { duong: "/chinh-sach/doi-tra", uuTien: 0.3 },
    { duong: "/chinh-sach/bao-mat", uuTien: 0.3 },
  ];

  const muc: MetadataRoute.Sitemap = [];

  for (const ngonNgu of CAC_NGON_NGU) {
    for (const trang of trangTinh) {
      muc.push({
        url: `${GOC}/${ngonNgu}${trang.duong}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: trang.uuTien,
        alternates: {
          languages: Object.fromEntries(
            CAC_NGON_NGU.map((ng) => [ng, `${GOC}/${ng}${trang.duong}`]),
          ),
        },
      });
    }

    for (const sp of sanPham) {
      muc.push({
        url: `${GOC}/${ngonNgu}/san-pham/${sp.slug}`,
        lastModified: sp.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            CAC_NGON_NGU.map((ng) => [ng, `${GOC}/${ng}/san-pham/${sp.slug}`]),
          ),
        },
      });
    }
  }

  return muc;
}
