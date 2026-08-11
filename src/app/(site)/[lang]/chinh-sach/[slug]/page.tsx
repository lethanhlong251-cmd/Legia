import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { laNgonNguHopLe, type NgonNgu } from "@/i18n";
import { layCaiDat } from "@/lib/du-lieu";
import { CHINH_SACH, type MaChinhSach } from "@/noi-dung/chinh-sach";

export async function generateStaticParams() {
  return Object.keys(CHINH_SACH).flatMap((slug) =>
    ["vi", "en"].map((lang) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/chinh-sach/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const trang = CHINH_SACH[slug as MaChinhSach];
  if (!trang) return { title: "404" };
  return {
    title: trang[lang as NgonNgu].tieuDe,
    alternates: { canonical: `/${lang}/chinh-sach/${slug}` },
  };
}

export default async function TrangChinhSach({
  params,
}: PageProps<"/[lang]/chinh-sach/[slug]">) {
  const { lang, slug } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const trang = CHINH_SACH[slug as MaChinhSach];
  if (!trang) notFound();

  const noiDung = trang[lang];
  const caiDat = await layCaiDat();

  return (
    <div className="khung max-w-3xl py-12 sm:py-16">
      <h1 className="font-display text-3xl text-muc-900 sm:text-4xl">
        {noiDung.tieuDe}
      </h1>
      <div className="duong-vien-dong mt-5 h-px w-full opacity-50" />

      <div className="mt-9 space-y-9">
        {noiDung.cacPhan.map((phan) => (
          <section key={phan.tieuDe}>
            <h2 className="font-display text-lg text-muc-900">{phan.tieuDe}</h2>
            <ul className="mt-3 space-y-2.5">
              {phan.cacY.map((y) => (
                <li
                  key={y}
                  className="flex gap-3 text-[15px] leading-relaxed text-muc-600"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dong-500" />
                  {y}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Liên hệ khi cần hỗ trợ */}
      <div className="mt-12 rounded-lg border border-kem-300 bg-kem-50 p-6">
        <p className="text-sm leading-relaxed text-muc-600">
          {lang === "vi"
            ? "Mọi thắc mắc liên quan đến chính sách này, vui lòng liên hệ Chourmas qua số"
            : "For any question about this policy, please contact Chourmas at"}{" "}
          <a
            href={`tel:${caiDat.hotline}`}
            className="font-semibold text-son-700 hover:underline"
          >
            {caiDat.hotline}
          </a>{" "}
          {lang === "vi" ? "(gọi hoặc Zalo)." : "(call or Zalo)."}
        </p>
      </div>

      {/* Nhắc chủ shop duyệt nội dung — chỉ hiện khi chạy trên máy tính lập trình */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-[13px] leading-relaxed text-amber-900">
            <strong>Ghi chú cho chủ shop (chỉ bạn thấy, khách không thấy):</strong>{" "}
            Nội dung chính sách này được soạn theo thông lệ thương mại điện tử
            Việt Nam. Hãy đọc lại và sửa cho khớp với cách bạn thực sự vận hành,
            trong file{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">
              src/noi-dung/chinh-sach.ts
            </code>
          </p>
        </div>
      )}
    </div>
  );
}
