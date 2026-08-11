import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { layBanDich, laNgonNguHopLe } from "@/i18n";
import { laySanPham } from "@/lib/du-lieu";
import { TheSanPham } from "@/components/site/the-san-pham";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/san-pham">): Promise<Metadata> {
  const { lang } = await params;
  const t = layBanDich(lang);
  return {
    title: t.sanPham.tieuDeTrang,
    description: t.sanPham.moTaTrang,
    alternates: { canonical: `/${lang}/san-pham` },
  };
}

export default async function TrangDanhSachSanPham({
  params,
}: PageProps<"/[lang]/san-pham">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const t = layBanDich(lang);
  const danhSach = await laySanPham();

  return (
    <>
      {/* Tiêu đề trang */}
      <div className="border-b border-kem-300 bg-kem-200">
        <div className="khung py-12 sm:py-16">
          <h1 className="font-display text-3xl text-muc-900 sm:text-4xl">
            {t.sanPham.tieuDeTrang}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muc-600">
            {t.sanPham.moTaTrang}
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-dong-500/40 bg-dong-50 px-3.5 py-1.5 text-xs font-medium text-dong-800">
            {lang === "vi"
              ? `${danhSach.length} mẫu khuôn · Tất cả đều độc quyền · Miễn phí vận chuyển`
              : `${danhSach.length} molds · All exclusive · Free shipping`}
          </p>
        </div>
      </div>

      <div className="khung py-10 sm:py-14">
        {danhSach.length === 0 ? (
          <p className="py-20 text-center text-muc-500">
            {t.sanPham.khongCoSanPham}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {danhSach.map((sp, i) => (
              <TheSanPham
                key={sp.id}
                sanPham={sp}
                ngonNgu={lang}
                t={t}
                uuTienTaiAnh={i < 4}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
