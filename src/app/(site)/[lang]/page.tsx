import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { layBanDich, laNgonNguHopLe, theoNgonNgu } from "@/i18n";
import { layCaiDat, laySanPhamNoiBat } from "@/lib/du-lieu";
import { TheSanPham } from "@/components/site/the-san-pham";
import { BieuTuongKhuon } from "@/components/logo";
import { HienDan } from "@/components/site/hien-dan";
import { notFound } from "next/navigation";

export default async function TrangChu({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const t = layBanDich(lang);
  const [sanPhamNoiBat, caiDat] = await Promise.all([
    laySanPhamNoiBat(8),
    layCaiDat(),
  ]);

  const zaloSach = caiDat.zalo.replace(/\D/g, "");

  // Ảnh giới thiệu ở phần mở đầu: ưu tiên mẫu 7 mặt vì khoe được nhiều hoa văn
  const sanPhamGioiThieu =
    sanPhamNoiBat.find((s) => s.slug === "lx-011-7") ?? sanPhamNoiBat[0];
  const anhGioiThieu =
    sanPhamGioiThieu?.images.find((a) => a.isMain) ??
    sanPhamGioiThieu?.images[0];

  const camKet = [
    { icon: ShieldCheck, ...t.camKet.khongChuyenKhoan },
    { icon: Truck, ...t.camKet.mienShip },
    { icon: PackageCheck, ...t.camKet.kiemTraHang },
    { icon: BadgeCheck, ...t.camKet.docQuyen },
  ];

  return (
    <>
      {/* ============ PHẦN MỞ ĐẦU ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-muc-900 via-muc-900 to-son-950">
        <div className="hoa-van-luoi absolute inset-0 opacity-50" />
        {/* Quầng sáng vàng đồng phía sau ảnh */}
        <div className="pointer-events-none absolute -right-40 top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-dong-500/10 blur-3xl" />

        <div className="khung relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-dong-500/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-dong-400">
              <BieuTuongKhuon className="h-3.5 w-3.5" mauChinh="#C8A24A" />
              {t.trangChu.heroNhan}
            </span>

            <h1 className="mt-6 whitespace-pre-line font-display text-[2.15rem] leading-[1.15] text-kem-50 sm:text-[3rem] lg:text-[3.35rem]">
              {t.trangChu.heroTieuDe}
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-kem-300 sm:text-base">
              {t.trangChu.heroMoTa}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/${lang}/san-pham`} className="nut-dong">
                {t.trangChu.heroNutChinh}
              </Link>
              <a
                href={`https://zalo.me/${zaloSach}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-kem-300/30 px-6 py-3 text-sm font-semibold tracking-wide text-kem-100 transition-colors hover:border-dong-500 hover:text-dong-400"
              >
                <MessageCircle className="h-4 w-4" />
                {t.trangChu.heroNutPhu}
              </a>
            </div>
          </div>

          {/* Ảnh giới thiệu, đóng khung viền vàng đồng */}
          {anhGioiThieu && sanPhamGioiThieu && (
            <Link
              href={`/${lang}/san-pham/${sanPhamGioiThieu.slug}`}
              className="group relative mx-auto w-full max-w-lg"
            >
              <div className="absolute -inset-2 rounded-xl border border-dong-500/25" />
              <div className="relative aspect-square overflow-hidden rounded-lg border border-dong-500/50 shadow-manh">
                <Image
                  src={anhGioiThieu.url}
                  alt={
                    theoNgonNgu(lang, sanPhamGioiThieu.nameVi, sanPhamGioiThieu.nameEn)
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 480px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-dong-500 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muc-900 shadow-vua">
                {sanPhamGioiThieu.faceCount
                  ? lang === "vi"
                    ? `${sanPhamGioiThieu.faceCount} mặt hoa văn trong 1 bộ`
                    : `${sanPhamGioiThieu.faceCount} patterns in one set`
                  : t.sanPham.docQuyen}
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* ============ CAM KẾT ============ */}
      <section className="border-b border-kem-300 bg-kem-50">
        <div className="khung grid grid-cols-2 gap-px py-0 lg:grid-cols-4">
          {camKet.map(({ icon: Icon, tieuDe, moTa }, i) => (
            <HienDan
              key={tieuDe}
              tre={i * 80}
              className="flex flex-col items-center gap-2.5 px-3 py-8 text-center sm:px-5"
            >
              <Icon className="h-6 w-6 text-son-700" strokeWidth={1.6} />
              <h3 className="font-display text-[15px] leading-tight text-muc-900">
                {tieuDe}
              </h3>
              <p className="text-xs leading-relaxed text-muc-500">{moTa}</p>
            </HienDan>
          ))}
        </div>
      </section>

      {/* ============ SẢN PHẨM NỔI BẬT ============ */}
      <section className="khung py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-muc-900 sm:text-3xl">
              {t.trangChu.noiBatTieuDe}
            </h2>
            <p className="mt-2 text-sm text-muc-500">
              {t.trangChu.noiBatMoTa}
            </p>
          </div>
          <Link
            href={`/${lang}/san-pham`}
            className="text-sm font-semibold text-son-700 underline-offset-4 hover:underline"
          >
            {t.trangChu.tatCaSanPham} →
          </Link>
        </div>

        <div className="duong-vien-dong mt-5 h-px w-full opacity-50" />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
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

      {/* ============ CÂU CHUYỆN ============ */}
      <section className="bg-kem-200">
        <div className="khung py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-dong-600">
                {t.trangChu.cauChuyenTieuDe}
              </span>
              <h2 className="mt-3 font-display text-2xl leading-snug text-muc-900 sm:text-[2rem]">
                {lang === "vi"
                  ? "Một chiếc bánh đẹp bắt đầu từ một chiếc khuôn đủ sắc nét"
                  : "A beautiful cake starts with a mold sharp enough to make it"}
              </h2>

              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muc-600">
                {lang === "vi" ? (
                  <>
                    <p>
                      Chourmas là đối tác phân phối chính thức các mẫu khuôn bánh
                      trung thu do <strong className="text-muc-800">Thạch Lan</strong>{" "}
                      thiết kế — những bộ hoa văn sen tứ quý, mẫu đơn, cúc, cá đôi,
                      thần tài đã đi cùng mâm cỗ Việt qua nhiều mùa trăng.
                    </p>
                    <p>
                      Mỗi mẫu hoa văn là thiết kế riêng, không bán đại trà. Bạn sẽ
                      không tìm thấy những bộ khuôn này ở nơi nào khác.
                    </p>
                    <p>
                      Và vì chúng tôi tin lòng tin phải đến trước đồng tiền,
                      Chourmas <strong className="text-muc-800">không bao giờ yêu
                      cầu bạn chuyển khoản trước</strong>. Bạn nhận hàng, mở hộp
                      kiểm tra, rồi mới thanh toán cho shipper.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Chourmas is the official distributor of the mooncake mold
                      designs created by{" "}
                      <strong className="text-muc-800">Thach Lan</strong> — lotus,
                      peony, chrysanthemum, twin fish and fortune patterns that have
                      graced Vietnamese tables through many Mid-Autumn seasons.
                    </p>
                    <p>
                      Every pattern is an exclusive design, never mass-distributed.
                      You will not find these molds anywhere else.
                    </p>
                    <p>
                      And because we believe trust comes before money, Chourmas{" "}
                      <strong className="text-muc-800">never asks for a bank
                      transfer up front</strong>. Your parcel arrives, you open it,
                      you check it, and only then do you pay the courier.
                    </p>
                  </>
                )}
              </div>

              <Link href={`/${lang}/gioi-thieu`} className="nut-phu mt-8">
                {t.chung.xemThem}
              </Link>
            </div>

            {/* Ảnh sản phẩm xếp lệch nhau */}
            <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
              {sanPhamNoiBat.slice(0, 4).map((sp, i) => {
                const anh = sp.images.find((a) => a.isMain) ?? sp.images[0];
                if (!anh) return null;
                return (
                  <div
                    key={sp.id}
                    className={`relative aspect-square overflow-hidden rounded-lg border border-kem-400 shadow-vua ${
                      i % 2 === 1 ? "translate-y-6" : ""
                    }`}
                  >
                    <Image
                      src={anh.url}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 45vw, 220px"
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ KÊU GỌI CUỐI TRANG ============ */}
      <section className="khung py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-xl bg-son-700 px-6 py-14 text-center sm:px-12">
          <div className="hoa-van-luoi absolute inset-0 opacity-20" />
          <div className="relative">
            <BieuTuongKhuon
              className="mx-auto h-12 w-12"
              mauChinh="#FAF6EF"
              mauNhan="#E3C87F"
            />
            <h2 className="mt-6 font-display text-2xl text-kem-50 sm:text-3xl">
              {lang === "vi"
                ? "Chưa biết chọn cỡ nào?"
                : "Not sure which size to pick?"}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-kem-200">
              {lang === "vi"
                ? "Nhắn Zalo cho shop, gửi ảnh khay bánh bạn đang dùng, shop tư vấn đúng cỡ khuôn trong vài phút."
                : "Message us on Zalo with a photo of the tray you use, and we will tell you the right mold size within minutes."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`https://zalo.me/${zaloSach}`}
                target="_blank"
                rel="noopener noreferrer"
                className="nut-dong"
              >
                <MessageCircle className="h-4 w-4" />
                {t.trangChu.heroNutPhu}
              </a>
              <a
                href={`tel:${caiDat.hotline}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-kem-100/40 px-6 py-3 text-sm font-semibold text-kem-50 transition-colors hover:bg-kem-50/10"
              >
                {caiDat.hotline}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
