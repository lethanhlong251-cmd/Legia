import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

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
  const zaloSach = caiDat.zalo.replace(/\D/g, "");

  const cachLienHe = [
    {
      icon: Phone,
      nhan: t.chanTrang.hotline,
      giaTri: caiDat.hotline,
      dich: `tel:${caiDat.hotline}`,
      moTa: vi
        ? "Gọi trực tiếp, shop nghe máy cả ngoài giờ hành chính"
        : "Call us directly, we answer outside office hours too",
    },
    {
      icon: MessageCircle,
      nhan: "Zalo",
      giaTri: caiDat.zalo,
      dich: `https://zalo.me/${zaloSach}`,
      moTa: vi
        ? "Nhắn tin, gửi ảnh khay bánh để được tư vấn đúng cỡ khuôn"
        : "Message us a photo of your tray and we will match the mold size",
    },
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
          ? "Có câu hỏi về khuôn, về cỡ bánh hay về đơn hàng? Gọi hoặc nhắn Zalo, shop trả lời nhanh nhất qua Zalo."
          : "Questions about a mold, a size, or an order? Call or message us — Zalo gets the fastest reply."}
      </p>

      <div className="duong-vien-dong mt-6 h-px w-full opacity-50" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cachLienHe.map(({ icon: Icon, nhan, giaTri, dich, moTa }) => {
          const noiDung = (
            <>
              <Icon
                className="h-5 w-5 shrink-0 text-son-700"
                strokeWidth={1.7}
              />
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
            </>
          );

          return dich ? (
            <a
              key={nhan}
              href={dich}
              target={dich.startsWith("http") ? "_blank" : undefined}
              rel={dich.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex gap-4 rounded-lg border border-kem-300 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-dong-400 hover:shadow-vua"
            >
              {noiDung}
            </a>
          ) : (
            <div
              key={nhan}
              className="flex gap-4 rounded-lg border border-kem-300 bg-white p-5"
            >
              {noiDung}
            </div>
          );
        })}
      </div>

      {caiDat.facebook && (
        <div className="mt-8 rounded-lg border border-kem-300 bg-kem-50 p-6">
          <p className="font-display text-lg text-muc-900">
            {vi ? "Xem thêm mẫu mới trên Facebook" : "See new designs on Facebook"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muc-600">
            {vi
              ? "Shop đăng mẫu mới, ảnh bánh khách gửi về và video hướng dẫn đóng bánh trên trang Facebook."
              : "We post new designs, customer photos and pressing tutorials on our Facebook page."}
          </p>
          <a
            href={caiDat.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="nut-phu mt-5"
          >
            {vi ? "Mở trang Facebook" : "Open our Facebook page"}
          </a>
        </div>
      )}
    </div>
  );
}
