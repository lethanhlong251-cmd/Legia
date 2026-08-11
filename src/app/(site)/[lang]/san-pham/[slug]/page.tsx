import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  Info,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { layBanDich, laNgonNguHopLe, theoNgonNgu } from "@/i18n";
import {
  layCaiDat,
  laySanPhamLienQuan,
  laySanPhamTheoSlug,
} from "@/lib/du-lieu";
import { prisma } from "@/lib/prisma";
import { ChonMua } from "@/components/site/chon-mua";
import { TheSanPham } from "@/components/site/the-san-pham";

/** Dựng sẵn trang cho mọi sản phẩm để mở nhanh và tốt cho Google */
export async function generateStaticParams() {
  const danhSach = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return danhSach.flatMap((sp) =>
    ["vi", "en"].map((lang) => ({ lang, slug: sp.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/san-pham/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const sanPham = await laySanPhamTheoSlug(slug);
  if (!sanPham) return { title: "404" };

  const ten = theoNgonNgu(lang as "vi" | "en", sanPham.nameVi, sanPham.nameEn);
  const moTa =
    theoNgonNgu(
      lang as "vi" | "en",
      sanPham.metaDescVi ?? sanPham.shortDescVi,
      sanPham.metaDescEn ?? sanPham.shortDescEn,
    ) || ten;

  const anh = sanPham.images.find((a) => a.isMain) ?? sanPham.images[0];

  return {
    title: ten,
    description: moTa,
    alternates: { canonical: `/${lang}/san-pham/${slug}` },
    openGraph: {
      title: ten,
      description: moTa,
      images: anh ? [{ url: anh.url, width: 1400, height: 1400 }] : undefined,
    },
  };
}

export default async function TrangChiTietSanPham({
  params,
}: PageProps<"/[lang]/san-pham/[slug]">) {
  const { lang, slug } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const sanPham = await laySanPhamTheoSlug(slug);
  if (!sanPham) notFound();

  const t = layBanDich(lang);
  const [lienQuan, caiDat] = await Promise.all([
    laySanPhamLienQuan(sanPham.id, 4),
    layCaiDat(),
  ]);

  const ten = theoNgonNgu(lang, sanPham.nameVi, sanPham.nameEn);
  const moTa = theoNgonNgu(lang, sanPham.descVi, sanPham.descEn);
  const ghiChu = theoNgonNgu(lang, sanPham.noteVi, sanPham.noteEn);
  const hoaVan = theoNgonNgu(lang, sanPham.patterns, sanPham.patterns);
  const tenDanhMuc = theoNgonNgu(
    lang,
    sanPham.category.nameVi,
    sanPham.category.nameEn,
  );

  const thongSo = [
    sanPham.sku && { nhan: t.sanPham.maSanPham, giaTri: sanPham.sku },
    sanPham.faceCount && {
      nhan: t.sanPham.soMat,
      giaTri: `${sanPham.faceCount} ${lang === "vi" ? "mặt" : "faces"}`,
    },
    sanPham.diameter && { nhan: t.sanPham.duongKinh, giaTri: sanPham.diameter },
    sanPham.material && { nhan: t.sanPham.chatLieu, giaTri: sanPham.material },
  ].filter(Boolean) as { nhan: string; giaTri: string }[];

  const camKet = [
    { icon: ShieldCheck, ...t.camKet.khongChuyenKhoan },
    { icon: Truck, ...t.camKet.mienShip },
    { icon: PackageCheck, ...t.camKet.kiemTraHang },
  ];

  // Dữ liệu có cấu trúc để Google hiện giá ngay trên kết quả tìm kiếm
  const giaThapNhat = Math.min(...sanPham.variants.map((b) => b.price));
  const giaCaoNhat = Math.max(...sanPham.variants.map((b) => b.price));
  const duLieuCoCauTruc = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ten,
    description: theoNgonNgu(lang, sanPham.shortDescVi, sanPham.shortDescEn),
    sku: sanPham.sku,
    brand: { "@type": "Brand", name: "Chourmas" },
    image: sanPham.images.map((a) => a.url),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: giaThapNhat,
      highPrice: giaCaoNhat,
      offerCount: sanPham.variants.length,
      availability: sanPham.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(duLieuCoCauTruc) }}
      />

      <div className="khung py-6 sm:py-10">
        {/* Đường dẫn phân cấp */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-[13px] text-muc-500"
        >
          <Link href={`/${lang}`} className="hover:text-son-700">
            {t.dieuHuong.trangChu}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/${lang}/san-pham`} className="hover:text-son-700">
            {tenDanhMuc}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-muc-700">{ten}</span>
        </nav>

        {/* Tên và nhãn */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {sanPham.isExclusive && (
            <span className="huy-hieu bg-dong-500 text-muc-900">
              <BadgeCheck className="h-3 w-3" />
              {t.sanPham.docQuyen}
            </span>
          )}
          <span
            className={`huy-hieu ${
              sanPham.inStock
                ? "bg-emerald-50 text-emerald-700"
                : "bg-kem-300 text-muc-600"
            }`}
          >
            {sanPham.inStock ? t.sanPham.conHang : t.sanPham.hetHang}
          </span>
        </div>

        <h1 className="mt-3 font-display text-3xl leading-tight text-muc-900 sm:text-4xl">
          {ten}
        </h1>
        <p className="mt-2 text-[15px] text-muc-600">
          {theoNgonNgu(lang, sanPham.shortDescVi, sanPham.shortDescEn)}
        </p>

        {/* Chọn cỡ và mua */}
        <div className="mt-9">
          <ChonMua
            ngonNgu={lang}
            t={t}
            sanPham={{
              slug: sanPham.slug,
              sku: sanPham.sku,
              nameVi: sanPham.nameVi,
              nameEn: sanPham.nameEn,
              inStock: sanPham.inStock,
            }}
            bienThe={sanPham.variants}
            anh={sanPham.images}
          />
        </div>

        {/* Cam kết */}
        <div className="mt-10 grid gap-3 rounded-lg border border-dong-200 bg-dong-50/60 p-5 sm:grid-cols-3">
          {camKet.map(({ icon: Icon, tieuDe, moTa }) => (
            <div key={tieuDe} className="flex gap-3">
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-son-700"
                strokeWidth={1.7}
              />
              <div>
                <p className="text-sm font-semibold text-muc-800">{tieuDe}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muc-600">
                  {moTa}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ghi chú quan trọng */}
        {ghiChu && (
          <div className="mt-6 flex gap-3 rounded-lg border-l-4 border-dong-500 bg-dong-50 p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-dong-700" />
            <div>
              <p className="text-sm font-semibold text-muc-800">
                {t.sanPham.luuY}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muc-700">
                {ghiChu}
              </p>
            </div>
          </div>
        )}

        {/* Mô tả và thông số */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-xl text-muc-900">
              {t.sanPham.moTaSanPham}
            </h2>
            <div className="duong-vien-dong mt-3 h-px w-full opacity-50" />
            <div className="mt-5 space-y-4 whitespace-pre-line text-[15px] leading-relaxed text-muc-600">
              {moTa}
            </div>

            {hoaVan && (
              <>
                <h3 className="mt-8 font-display text-lg text-muc-900">
                  {t.sanPham.hoaVan}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {hoaVan
                    .split("\n")
                    .filter(Boolean)
                    .map((dong, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-[15px] text-muc-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dong-500" />
                        {dong}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>

          <div>
            <h2 className="font-display text-xl text-muc-900">
              {t.sanPham.thongSo}
            </h2>
            <div className="duong-vien-dong mt-3 h-px w-full opacity-50" />
            <dl className="mt-5 divide-y divide-kem-300 overflow-hidden rounded-lg border border-kem-300 bg-white text-sm">
              {thongSo.map((ts) => (
                <div
                  key={ts.nhan}
                  className="flex items-baseline justify-between gap-4 px-4 py-3"
                >
                  <dt className="text-muc-500">{ts.nhan}</dt>
                  <dd className="text-right font-medium text-muc-800">
                    {ts.giaTri}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-muc-500">{t.gioHang.phiVanChuyen}</dt>
                <dd className="text-right font-medium text-emerald-700">
                  {t.gioHang.mienPhi}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-muc-500">
                  {lang === "vi" ? "Thanh toán" : "Payment"}
                </dt>
                <dd className="text-right font-medium text-muc-800">
                  {t.datHang.thanhToanKhiNhan}
                </dd>
              </div>
            </dl>

            {/* Hộp liên hệ tư vấn */}
            <div className="mt-5 rounded-lg border border-kem-300 bg-kem-50 p-5">
              <p className="text-sm font-semibold text-muc-800">
                {lang === "vi" ? "Cần tư vấn chọn cỡ?" : "Need help choosing?"}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muc-600">
                {lang === "vi"
                  ? "Gọi hoặc nhắn Zalo, shop tư vấn theo khay bánh bạn đang dùng."
                  : "Call or message us on Zalo and we will match the mold to your tray."}
              </p>
              <a
                href={`tel:${caiDat.hotline}`}
                className="mt-4 inline-flex font-display text-lg font-semibold text-son-700 hover:underline"
              >
                {caiDat.hotline}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sản phẩm khác */}
      {lienQuan.length > 0 && (
        <section className="mt-6 border-t border-kem-300 bg-kem-200">
          <div className="khung py-14">
            <h2 className="font-display text-2xl text-muc-900">
              {t.sanPham.sanPhamKhac}
            </h2>
            <div className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {lienQuan.map((sp) => (
                <TheSanPham key={sp.id} sanPham={sp} ngonNgu={lang} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
