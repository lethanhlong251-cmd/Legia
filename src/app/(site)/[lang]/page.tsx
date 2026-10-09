import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import { layBanDich, laNgonNguHopLe, theoNgonNgu } from "@/i18n";
import { layCaiDat, laySanPhamNoiBat } from "@/lib/du-lieu";
import { TheSanPham } from "@/components/site/the-san-pham";
import { HienDan } from "@/components/site/hien-dan";

/**
 * TRANG CHỦ — phong cách tối giản, sang trọng.
 * Thứ tự: mở đầu → 4 cam kết → sản phẩm nổi bật → về Thạch Lan →
 * danh mục → lời mời tư vấn.
 */
export default async function TrangChu({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const t = layBanDich(lang);
  const vi = lang === "vi";
  const [sanPhamNoiBat, caiDat] = await Promise.all([
    laySanPhamNoiBat(8),
    layCaiDat(),
  ]);
  const zaloSach = caiDat.zalo.replace(/\D/g, "");

  const anhCua = (slug: string) => {
    const sp = sanPhamNoiBat.find((s) => s.slug === slug);
    const anh = sp?.images.find((a) => a.isMain) ?? sp?.images[0];
    return sp && anh ? { sp, anh } : null;
  };
  const dauTien = () => {
    const sp = sanPhamNoiBat[0];
    const anh = sp?.images.find((a) => a.isMain) ?? sp?.images[0];
    return sp && anh ? { sp, anh } : null;
  };

  // Ảnh mở đầu: ưu tiên ảnh hộp bánh Vuông Sen vì nhìn ra ngay thành phẩm
  const moDau = anhCua("vuong-sen") ?? anhCua("lx-011-7") ?? dauTien();
  // Ảnh phần câu chuyện
  const cauChuyen =
    anhCua("mau-don-sen-cuc") ?? anhCua("sen-tu-quy") ?? dauTien();

  const [dongDau, dongSau] = t.trangChu.heroTieuDe.split("\n");
  const camKet = [
    t.camKet.khongChuyenKhoan,
    t.camKet.mienShip,
    t.camKet.kiemTraHang,
    t.camKet.docQuyen,
  ];

  return (
    <>
      {/* ============ MỞ ĐẦU ============ */}
      <section className="khung grid items-center gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <div className="hien-len">
          <span className="nhan-muc">{t.trangChu.heroNhan}</span>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.04] sm:text-[3.4rem] lg:text-[4rem]">
            {dongDau}
            <br />
            <em className="italic text-son-700">
              {dongSau?.split(" ").slice(0, 2).join(" ")}
            </em>{" "}
            {dongSau?.split(" ").slice(2).join(" ")}
          </h1>
          <p className="mt-7 max-w-[30rem] text-base leading-[1.75] text-muc-500 sm:text-[16.5px]">
            {t.trangChu.heroMoTa}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/${lang}/san-pham`} className="nut-chinh">
              {t.trangChu.heroNutChinh}
            </Link>
            <a
              href={`https://zalo.me/${zaloSach}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nut-phu"
            >
              {t.trangChu.heroNutPhu}
            </a>
          </div>
        </div>

        {moDau && (
          <Link
            href={`/${lang}/san-pham/${moDau.sp.slug}`}
            className="group relative block"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-kem-200">
              <Image
                src={moDau.anh.url}
                alt={theoNgonNgu(lang, moDau.sp.nameVi, moDau.sp.nameEn)}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 600px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <span className="absolute bottom-0 left-0 bg-kem-100 pr-5 pt-3.5 text-[13px] tracking-[0.02em] text-muc-500">
              {theoNgonNgu(lang, moDau.sp.nameVi, moDau.sp.nameEn)}
              {moDau.sp.faceCount
                ? vi
                  ? ` — ${moDau.sp.faceCount} mặt hoa văn`
                  : ` — ${moDau.sp.faceCount} pattern faces`
                : ""}
            </span>
          </Link>
        )}
      </section>

      {/* ============ CAM KẾT ============ */}
      <section className="border-y border-kem-300">
        <div className="khung grid grid-cols-2 lg:grid-cols-4">
          {camKet.map(({ tieuDe, moTa }, i) => (
            <HienDan
              key={tieuDe}
              tre={i * 80}
              className="flex flex-col gap-2 py-8 pr-4 sm:pr-6"
            >
              <span className="font-display text-[15px] text-dong-700">
                0{i + 1}
              </span>
              <h3 className="font-sans text-[15px] font-semibold tracking-normal text-muc-900 [font-size-adjust:none]">
                {tieuDe}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-muc-500">
                {moTa}
              </p>
            </HienDan>
          ))}
        </div>
      </section>

      {/* ============ SẢN PHẨM NỔI BẬT ============ */}
      <section className="khung py-20 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="nhan-muc">{vi ? "Bộ sưu tập" : "Collection"}</span>
            <h2 className="mt-3 font-display text-[2rem] leading-tight sm:text-[2.6rem]">
              {t.trangChu.noiBatTieuDe}
            </h2>
          </div>
          <Link href={`/${lang}/san-pham`} className="lien-ket-gach">
            {t.trangChu.tatCaSanPham}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
          {sanPhamNoiBat.map((sp, i) => (
            <HienDan key={sp.id} tre={(i % 4) * 70} className="flex">
              <TheSanPham
                sanPham={sp}
                ngonNgu={lang}
                t={t}
                uuTienTaiAnh={i < 4}
              />
            </HienDan>
          ))}
        </div>
      </section>

      {/* ============ VỀ THẠCH LAN ============ */}
      <section className="bg-kem-200">
        <div className="khung grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
          {cauChuyen && (
            <div className="relative aspect-square overflow-hidden bg-kem-300">
              <Image
                src={cauChuyen.anh.url}
                alt={theoNgonNgu(lang, cauChuyen.sp.nameVi, cauChuyen.sp.nameEn)}
                fill
                sizes="(max-width: 1024px) 92vw, 600px"
                className="object-cover"
              />
            </div>
          )}

          <div className="max-w-[33rem]">
            <span className="nhan-muc">{t.trangChu.cauChuyenTieuDe}</span>
            <h2 className="mt-4 font-display text-[2rem] leading-[1.12] sm:text-[2.6rem]">
              {vi
                ? "Một chiếc bánh đẹp bắt đầu từ một chiếc khuôn đủ sắc nét"
                : "A beautiful cake starts with a mold sharp enough to make it"}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-[1.8] text-muc-600">
              {vi ? (
                <>
                  <p>
                    Thạch Lan tự tay thiết kế từng bộ hoa văn — sen tứ quý, mẫu
                    đơn, cúc, cá đôi, thần tài — để mâm cỗ trung thu của gia
                    đình Việt có những chiếc bánh không lẫn với ai.
                  </p>
                  <p>
                    Không qua trung gian: bạn mua khuôn trực tiếp từ người làm
                    ra hoa văn. Và vì lòng tin phải đến trước đồng tiền, Thạch
                    Lan{" "}
                    <strong className="font-semibold text-muc-800">
                      không bao giờ yêu cầu chuyển khoản trước
                    </strong>
                    .
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Thach Lan designs every pattern set by hand — four-season
                    lotus, peony, chrysanthemum, twin fish, the god of fortune —
                    so a Vietnamese family&apos;s Mid-Autumn table has cakes
                    that look like no one else&apos;s.
                  </p>
                  <p>
                    No middlemen: you buy straight from the people who draw the
                    patterns. And because trust comes before money, Thach Lan{" "}
                    <strong className="font-semibold text-muc-800">
                      never asks for a bank transfer up front
                    </strong>
                    .
                  </p>
                </>
              )}
            </div>
            <Link href={`/${lang}/gioi-thieu`} className="lien-ket-gach mt-8">
              {vi ? "Đọc câu chuyện của chúng tôi" : "Read our story"}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ DANH MỤC ============ */}
      <section className="khung py-20 sm:py-24">
        <h2 className="mb-10 font-display text-[1.9rem] sm:text-[2.2rem]">
          {vi ? "Danh mục" : "Categories"}
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href={`/${lang}/san-pham`}
            className="group flex min-h-44 items-end justify-between gap-4 border border-muc-800 p-7 transition-colors hover:border-son-700 sm:p-8"
          >
            <div>
              <span className="block font-display text-[1.75rem] font-semibold text-muc-900 transition-colors group-hover:text-son-700">
                {vi ? "Khuôn trung thu" : "Mooncake molds"}
              </span>
              <span className="mt-2 block text-sm text-muc-500">
                {vi
                  ? "Khuôn lò xo 2 – 7 mặt hoa văn, cỡ 75g đến 200g"
                  : "Spring molds with 2 – 7 pattern faces, 75g to 200g"}
              </span>
            </div>
            <ArrowRight
              className="h-6 w-6 shrink-0 text-muc-800 transition-transform group-hover:translate-x-1 group-hover:text-son-700"
              strokeWidth={1.3}
            />
          </Link>
          <div className="flex min-h-44 items-end border border-dashed border-kem-500 p-7 text-muc-500 sm:p-8">
            <div>
              <span className="block font-display text-[1.75rem] font-semibold">
                {vi ? "Dụng cụ làm bánh" : "Baking tools"}
              </span>
              <span className="mt-2 block text-sm">
                {vi ? "Sắp ra mắt" : "Coming soon"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LỜI MỜI TƯ VẤN ============ */}
      {/* -mb-20 để dải đỏ nằm sát chân trang (chân trang có mt-20) */}
      <section className="-mb-20 bg-son-700 text-kem-50">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:py-24">
          <h2 className="font-display text-[2rem] leading-tight text-kem-50 sm:text-[2.6rem]">
            {vi ? "Chưa biết chọn cỡ khuôn nào?" : "Not sure which size to pick?"}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-[1.75] text-dong-200">
            {vi
              ? "Gửi ảnh khay bánh bạn đang dùng qua Zalo, Thạch Lan tư vấn đúng cỡ trong vài phút."
              : "Send us a photo of the tray you use on Zalo and we will tell you the right mold size within minutes."}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={`https://zalo.me/${zaloSach}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nut-dong"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              {vi ? "Nhắn Zalo" : "Message on Zalo"}
            </a>
            <a
              href={`tel:${caiDat.hotline}`}
              className="inline-flex min-h-12 items-center justify-center border border-kem-50/70 px-7 py-3 text-sm font-medium tracking-[0.06em] text-kem-50 transition-colors hover:bg-kem-50/10"
            >
              {vi ? "Gọi" : "Call"} {caiDat.hotline}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
