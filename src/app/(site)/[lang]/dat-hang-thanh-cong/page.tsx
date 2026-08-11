import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Phone } from "lucide-react";

import { layBanDich, laNgonNguHopLe } from "@/i18n";
import { layCaiDat } from "@/lib/du-lieu";
import { BieuTuongKhuon } from "@/components/logo";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function TrangDatHangThanhCong({
  params,
  searchParams,
}: PageProps<"/[lang]/dat-hang-thanh-cong">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const { ma } = await searchParams;
  const maDon = typeof ma === "string" ? ma : null;

  const t = layBanDich(lang);
  const caiDat = await layCaiDat();

  return (
    <div className="khung flex flex-col items-center py-16 text-center sm:py-24">
      <div className="relative">
        <BieuTuongKhuon className="h-20 w-20" mauChinh="#9E2B25" />
        <CheckCircle2 className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-kem-100 text-emerald-600" />
      </div>

      <h1 className="mt-7 font-display text-3xl text-muc-900 sm:text-4xl">
        {t.thanhCong.tieuDe}
      </h1>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muc-600">
        {t.thanhCong.moTa}
      </p>

      {maDon && (
        <div className="mt-8 rounded-lg border border-dong-300 bg-dong-50 px-8 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dong-700">
            {t.thanhCong.maDon}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-wide text-son-700">
            {maDon}
          </p>
          <p className="mt-2 text-xs text-muc-600">{t.thanhCong.luuMa}</p>
        </div>
      )}

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href={`/${lang}/san-pham`} className="nut-chinh">
          {t.thanhCong.xemThemSanPham}
        </Link>
        <Link href={`/${lang}`} className="nut-phu">
          {t.thanhCong.veTrangChu}
        </Link>
      </div>

      <p className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm text-muc-500">
        <Phone className="h-4 w-4" />
        {lang === "vi"
          ? "Cần thay đổi đơn hàng? Gọi ngay"
          : "Need to change your order? Call us"}
        <a
          href={`tel:${caiDat.hotline}`}
          className="font-semibold text-son-700 hover:underline"
        >
          {caiDat.hotline}
        </a>
      </p>
    </div>
  );
}
