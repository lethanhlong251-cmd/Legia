import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { layBanDich, laNgonNguHopLe } from "@/i18n";
import { MauThanhToan } from "@/components/site/mau-thanh-toan";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function TrangThanhToan({
  params,
}: PageProps<"/[lang]/thanh-toan">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const t = layBanDich(lang);

  return (
    <div className="khung py-10 sm:py-14">
      <h1 className="font-display text-3xl text-muc-900">
        {t.gioHang.datHang}
      </h1>
      <div className="duong-vien-dong mt-4 h-px w-full" />
      <MauThanhToan ngonNgu={lang} t={t} />
    </div>
  );
}
