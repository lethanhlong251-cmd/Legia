import type { Metadata } from "next";
import { thongTinChiaSe } from "@/lib/chia-se";
import { notFound } from "next/navigation";
import { Clock, MapPin } from "lucide-react";

import { layBanDich, laNgonNguHopLe } from "@/i18n";
import { layCaiDat } from "@/lib/du-lieu";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/lien-he">): Promise<Metadata> {
  const { lang } = await params;
  const t = layBanDich(lang);
  return {
    title: t.dieuHuong.lienHe,
    alternates: { canonical: `/${lang}/lien-he` },
    ...thongTinChiaSe({
      lang,
      duongDan: "/lien-he",
      tieuDe: t.dieuHuong.lienHe,
    }),
  };
}

export default async function TrangLienHe({
  params,
}: PageProps<"/[lang]/lien-he">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const t = layBanDich(lang);
  const caiDat = await layCaiDat();
  const vi = lang === "vi";

  const cachLienHe = [
    {
      icon: Clock,
      nhan: vi ? "Thời gian nhận đơn" : "Order hours",
      giaTri: caiDat.gioLamViec,
      moTa: vi
        ? "Đơn đặt buổi tối sẽ được xác nhận vào sáng hôm sau"
        : "Orders placed at night are confirmed the next morning",
    },
    {
      icon: MapPin,
      nhan: vi ? "Khu vực bán hàng" : "Where we sell",
      giaTri: caiDat.diaChi,
      moTa: vi
        ? "Giao hàng tận nơi trên toàn quốc, miễn phí vận chuyển"
        : "Delivered to your door anywhere in Vietnam, shipping free",
    },
  ];

  return (
    <div className="khung max-w-4xl py-12 sm:py-16">
      <h1 className="font-display text-3xl text-muc-900 sm:text-4xl">
        {t.dieuHuong.lienHe}
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muc-600">
        {vi
          ? "Thời gian nhận đơn và khu vực giao hàng của Chourmas."
          : "When we take orders and where we deliver."}
      </p>

      <div className="duong-vien-dong mt-6 h-px w-full" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cachLienHe.map(({ icon: Icon, nhan, giaTri, moTa }) => (
          <div
            key={nhan}
            className="flex gap-4 rounded-lg border border-kem-300 bg-white p-5"
          >
            <Icon className="h-5 w-5 shrink-0 text-son-700" strokeWidth={1.7} />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dong-700">
                {nhan}
              </p>
              <p className="mt-1.5 font-display text-lg text-muc-900">
                {giaTri}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muc-600">
                {moTa}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
