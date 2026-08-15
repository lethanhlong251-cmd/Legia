import Image from "next/image";
import Link from "next/link";

import { dinhDangTien, phanTramGiam } from "@/lib/dinh-dang";
import { theoNgonNgu, type BanDich, type NgonNgu } from "@/i18n";
import type { SanPhamTrongDanhSach } from "@/lib/du-lieu";

export function TheSanPham({
  sanPham,
  ngonNgu,
  t,
  uuTienTaiAnh = false,
}: {
  sanPham: SanPhamTrongDanhSach;
  ngonNgu: NgonNgu;
  t: BanDich;
  /** Bật cho vài sản phẩm đầu tiên để ảnh hiện ngay, không phải chờ cuộn */
  uuTienTaiAnh?: boolean;
}) {
  const ten = theoNgonNgu(ngonNgu, sanPham.nameVi, sanPham.nameEn);
  const moTaNgan = theoNgonNgu(
    ngonNgu,
    sanPham.shortDescVi,
    sanPham.shortDescEn,
  );

  const anhChinh =
    sanPham.images.find((a) => a.isMain) ?? sanPham.images[0] ?? null;

  // Giá thấp nhất để hiện "Từ 159.000₫".
  // Bỏ qua các món mua lẻ như "mặt cúc lẻ", vì lấy giá đó làm giá hiển thị
  // sẽ khiến khách tưởng cả bộ khuôn chỉ có ngần ấy tiền.
  const cacCoBanChinh = sanPham.variants.filter((b) => !b.isAccessory);
  const cacCo = cacCoBanChinh.length > 0 ? cacCoBanChinh : sanPham.variants;

  const giaCacCo = cacCo.map((b) => b.price);
  const giaThapNhat = giaCacCo.length ? Math.min(...giaCacCo) : 0;
  const bienTheReNhat = cacCo.find((b) => b.price === giaThapNhat);
  const giamGia = phanTramGiam(giaThapNhat, bienTheReNhat?.comparePrice);
  const nhieuCo = new Set(giaCacCo).size > 1;

  return (
    <Link
      href={`/${ngonNgu}/san-pham/${sanPham.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-kem-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-dong-300 hover:shadow-vua"
    >
      <div className="relative aspect-square overflow-hidden bg-kem-200">
        {anhChinh ? (
          <Image
            src={anhChinh.url}
            alt={theoNgonNgu(ngonNgu, anhChinh.altVi, anhChinh.altEn) || ten}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={uuTienTaiAnh}
            {...(anhChinh.blurData
              ? { placeholder: "blur" as const, blurDataURL: anhChinh.blurData }
              : {})}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muc-400">
            {t.chung.dangTai}
          </div>
        )}

        {/* Huy hiệu góc trên trái */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {sanPham.isExclusive && (
            <span className="huy-hieu bg-dong-500 text-muc-900 shadow-nhe">
              {t.sanPham.docQuyen}
            </span>
          )}
          {giamGia !== null && (
            <span className="huy-hieu bg-son-700 text-kem-50 shadow-nhe">
              −{giamGia}%
            </span>
          )}
        </div>

        {/* Hết hàng thì phủ lớp mờ lên ảnh */}
        {!sanPham.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-kem-100/75">
            <span className="rounded-md bg-muc-800 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-kem-100">
              {t.sanPham.hetHang}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {sanPham.faceCount && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dong-600">
            {sanPham.faceCount} {ngonNgu === "vi" ? "mặt hoa văn" : "faces"}
          </span>
        )}

        <h3 className="mt-1.5 font-display text-[17px] leading-snug text-muc-900 transition-colors group-hover:text-son-700">
          {ten}
        </h3>

        {moTaNgan && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muc-500">
            {moTaNgan}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-3.5">
          {nhieuCo && (
            <span className="text-xs text-muc-500">{t.sanPham.tuGia}</span>
          )}
          <span className="font-display text-lg font-semibold text-son-700">
            {dinhDangTien(giaThapNhat, ngonNgu)}
          </span>
          {bienTheReNhat?.comparePrice ? (
            <span className="text-[13px] text-muc-400 line-through">
              {dinhDangTien(bienTheReNhat.comparePrice, ngonNgu)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
