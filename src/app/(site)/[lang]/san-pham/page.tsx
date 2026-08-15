import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SearchX } from "lucide-react";

import { layBanDich, laNgonNguHopLe } from "@/i18n";
import { demTheoBoLoc, laySanPham, type BoLoc } from "@/lib/du-lieu";
import { TheSanPham } from "@/components/site/the-san-pham";
import { BoLocSanPham } from "@/components/site/bo-loc-san-pham";

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
  searchParams,
}: PageProps<"/[lang]/san-pham">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const thamSo = await searchParams;
  const layChuoi = (ten: string) => {
    const gt = thamSo[ten];
    return typeof gt === "string" ? gt : undefined;
  };

  const soMatChon = Number(layChuoi("mat"));
  const sapChon = layChuoi("sap");

  const boLoc: BoLoc = {
    soMat: Number.isFinite(soMatChon) && soMatChon > 0 ? soMatChon : undefined,
    co: layChuoi("co"),
    sapXep:
      sapChon === "gia-tang" || sapChon === "gia-giam" ? sapChon : "mac-dinh",
  };

  const t = layBanDich(lang);
  const [danhSach, dem] = await Promise.all([
    laySanPham(boLoc),
    demTheoBoLoc(),
  ]);

  const vi = lang === "vi";

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
            {vi
              ? `${dem.tong} mẫu khuôn · Tất cả đều độc quyền · Miễn phí vận chuyển`
              : `${dem.tong} molds · All exclusive · Free shipping`}
          </p>
        </div>
      </div>

      <div className="khung py-8 sm:py-10">
        {/* Bộ lọc — bọc Suspense vì có đọc tham số trên địa chỉ trang */}
        <Suspense fallback={<div className="h-40 rounded-lg bg-kem-200" />}>
          <BoLocSanPham
            ngonNgu={lang}
            soMat={dem.soMat}
            co={dem.co}
            tong={dem.tong}
            soKetQua={danhSach.length}
          />
        </Suspense>

        {danhSach.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <SearchX className="h-11 w-11 text-kem-500" strokeWidth={1.3} />
            <h2 className="mt-5 font-display text-xl text-muc-900">
              {vi
                ? "Không có mẫu nào khớp với lựa chọn này"
                : "No mold matches these filters"}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muc-500">
              {vi
                ? "Bạn thử bỏ bớt một điều kiện, hoặc nhắn Zalo để shop tư vấn mẫu phù hợp."
                : "Try removing a filter, or message us on Zalo and we will suggest one."}
            </p>
            <Link href={`/${lang}/san-pham`} className="nut-chinh mt-7">
              {vi ? "Xem tất cả mẫu khuôn" : "See every mold"}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
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
