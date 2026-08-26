"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag, ZoomIn } from "lucide-react";

import { dinhDangTien, phanTramGiam } from "@/lib/dinh-dang";
import { useGioHang } from "@/lib/gio-hang";
import { theoNgonNgu, type BanDich, type NgonNgu } from "@/i18n";
import { XemAnhLon } from "./xem-anh-lon";

type BienThe = {
  id: string;
  labelVi: string;
  labelEn: string;
  price: number;
  comparePrice: number | null;
  inStock: boolean;
  noteVi: string | null;
  noteEn: string | null;
};

type Anh = {
  id: string;
  url: string;
  altVi: string | null;
  altEn: string | null;
  isMain: boolean;
  blurData: string | null;
};

/**
 * Phần chọn cỡ khuôn và thêm vào giỏ ở trang chi tiết sản phẩm,
 * kèm bộ xem ảnh. Chạy trong trình duyệt vì cần bấm chọn.
 */
export function ChonMua({
  ngonNgu,
  t,
  sanPham,
  bienThe,
  anh,
}: {
  ngonNgu: NgonNgu;
  t: BanDich;
  sanPham: {
    slug: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    inStock: boolean;
  };
  bienThe: BienThe[];
  anh: Anh[];
}) {
  const router = useRouter();
  const { them } = useGioHang();

  const bienTheDauTien = bienThe.find((b) => b.inStock) ?? bienThe[0];
  const [idDangChon, setIdDangChon] = useState(bienTheDauTien?.id ?? "");
  const [soLuong, setSoLuong] = useState(1);
  const [anhDangXem, setAnhDangXem] = useState(0);
  const [vuaThem, setVuaThem] = useState(false);
  const [moKhungXemAnh, setMoKhungXemAnh] = useState(false);

  const dangChon = bienThe.find((b) => b.id === idDangChon) ?? bienTheDauTien;
  const tenSanPham = theoNgonNgu(ngonNgu, sanPham.nameVi, sanPham.nameEn);
  const conBan = sanPham.inStock && (dangChon?.inStock ?? false);
  const giamGia = phanTramGiam(dangChon?.price ?? 0, dangChon?.comparePrice);

  function taoMonHang() {
    if (!dangChon) return null;
    return {
      variantId: dangChon.id,
      productSlug: sanPham.slug,
      productName: tenSanPham,
      variantLabel: theoNgonNgu(ngonNgu, dangChon.labelVi, dangChon.labelEn),
      sku: sanPham.sku,
      imageUrl: anh[0]?.url ?? "",
      unitPrice: dangChon.price,
    };
  }

  function themVaoGio() {
    const mon = taoMonHang();
    if (!mon) return;
    them(mon, soLuong);
    setVuaThem(true);
    setTimeout(() => setVuaThem(false), 2200);
  }

  function muaNgay() {
    const mon = taoMonHang();
    if (!mon) return;
    // Không bật ngăn giỏ hàng vì đang chuyển thẳng sang trang thanh toán
    them(mon, soLuong, false);
    router.push(`/${ngonNgu}/thanh-toan`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* ---------- Bộ xem ảnh ---------- */}
      <div>
        <button
          type="button"
          onClick={() => anh.length > 0 && setMoKhungXemAnh(true)}
          aria-label={
            ngonNgu === "vi"
              ? "Phóng to ảnh để xem rõ hoa văn"
              : "Enlarge the photo to see the pattern"
          }
          className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg border border-kem-300 bg-kem-200"
        >
          {anh[anhDangXem] ? (
            <Image
              src={anh[anhDangXem].url}
              alt={
                theoNgonNgu(
                  ngonNgu,
                  anh[anhDangXem].altVi,
                  anh[anhDangXem].altEn,
                ) || tenSanPham
              }
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              {...(anh[anhDangXem].blurData
                ? {
                    placeholder: "blur" as const,
                    blurDataURL: anh[anhDangXem].blurData,
                  }
                : {})}
              className="object-cover"
            />
          ) : null}

          {giamGia !== null && (
            <span className="huy-hieu absolute left-3 top-3 bg-son-700 text-kem-50 shadow-nhe">
              −{giamGia}%
            </span>
          )}

          {/* Gợi ý bấm để xem rõ hoa văn */}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-muc-900/70 px-3 py-1.5 text-[11px] font-medium text-kem-100 backdrop-blur-sm transition-opacity group-hover:bg-muc-900/85">
            <ZoomIn className="h-3.5 w-3.5" />
            {ngonNgu === "vi" ? "Xem rõ hoa văn" : "See the detail"}
          </span>
        </button>

        {anh.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2.5">
            {anh.map((a, i) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAnhDangXem(i)}
                aria-label={`${t.chung.xemThem} ${i + 1}`}
                aria-current={i === anhDangXem}
                className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                  i === anhDangXem
                    ? "border-son-700"
                    : "border-kem-300 hover:border-dong-400"
                }`}
              >
                <Image
                  src={a.url}
                  alt=""
                  fill
                  sizes="110px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Chọn cỡ và mua ---------- */}
      <div>
        {/* Giá */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-[2rem] font-semibold leading-none text-son-700">
            {dinhDangTien(dangChon?.price ?? 0, ngonNgu)}
          </span>
          {dangChon?.comparePrice ? (
            <span className="text-lg text-muc-400 line-through">
              {dinhDangTien(dangChon.comparePrice, ngonNgu)}
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-[13px] text-muc-500">
          {ngonNgu === "vi"
            ? "Giá đã bao gồm phí vận chuyển toàn quốc"
            : "Price includes nationwide delivery"}
        </p>

        {/* Chọn cỡ */}
        <div className="mt-7">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muc-600">
            {t.sanPham.chonPhienBan}
          </h2>
          <div className="mt-3 space-y-2.5">
            {bienThe.map((b) => {
              const dangChonCai = b.id === idDangChon;
              const ghiChu = theoNgonNgu(ngonNgu, b.noteVi, b.noteEn);
              return (
                <button
                  key={b.id}
                  type="button"
                  disabled={!b.inStock}
                  onClick={() => setIdDangChon(b.id)}
                  className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3.5 text-left transition-all ${
                    dangChonCai
                      ? "border-son-700 bg-son-50 ring-1 ring-son-700"
                      : "border-kem-400 bg-white hover:border-dong-400"
                  } ${!b.inStock ? "cursor-not-allowed opacity-45" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-muc-800">
                      {theoNgonNgu(ngonNgu, b.labelVi, b.labelEn)}
                    </span>
                    {ghiChu && (
                      <span className="mt-0.5 block text-xs text-muc-500">
                        {ghiChu}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-semibold text-son-700">
                      {dinhDangTien(b.price, ngonNgu)}
                    </span>
                    {b.comparePrice ? (
                      <span className="block text-xs text-muc-400 line-through">
                        {dinhDangTien(b.comparePrice, ngonNgu)}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Số lượng */}
        <div className="mt-7 flex items-center gap-4">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muc-600">
            {t.sanPham.soLuong}
          </span>
          <div className="flex items-center rounded-md border border-kem-400 bg-white">
            <button
              type="button"
              onClick={() => setSoLuong((n) => Math.max(1, n - 1))}
              disabled={soLuong <= 1}
              className="p-2.5 text-muc-600 transition-colors hover:text-son-700 disabled:opacity-30"
              aria-label="Giảm số lượng"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-11 text-center text-[15px] font-semibold tabular-nums">
              {soLuong}
            </span>
            <button
              type="button"
              onClick={() => setSoLuong((n) => Math.min(99, n + 1))}
              disabled={soLuong >= 99}
              className="p-2.5 text-muc-600 transition-colors hover:text-son-700 disabled:opacity-30"
              aria-label="Tăng số lượng"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nút mua — chỉ hiện trên máy tính, điện thoại dùng thanh cố định dưới cùng */}
        <div className="mt-7 hidden gap-3 lg:flex">
          <button
            type="button"
            onClick={themVaoGio}
            disabled={!conBan}
            className="nut-phu flex-1"
          >
            {vuaThem ? (
              <>
                <Check className="h-4 w-4" />
                {t.sanPham.daThemVaoGio}
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                {t.sanPham.themVaoGio}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={muaNgay}
            disabled={!conBan}
            className="nut-chinh flex-1"
          >
            {conBan ? t.sanPham.muaNgay : t.sanPham.hetHang}
          </button>
        </div>

        {!conBan && (
          <p className="mt-3 text-center text-sm text-muc-500">
            {ngonNgu === "vi"
              ? "Mẫu này đang tạm hết. Nhắn Zalo để shop báo khi có hàng lại."
              : "This design is out of stock. Message us on Zalo and we will let you know when it returns."}
          </p>
        )}
      </div>

      {/* Thanh mua cố định dưới cùng — chỉ hiện trên điện thoại, luôn trong tầm tay dù cuộn tới đâu */}
      {/*
        Hai nút chia đôi đều nhau. Trước đây nút giỏ hàng chỉ là ô vuông nhỏ có
        mỗi biểu tượng, khách khó nhận ra là bấm được. Nay cả hai cùng chiều
        cao, cùng chiều rộng và đều có chữ.
      */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-stretch gap-2.5 border-t border-kem-300 bg-white/95 px-4 py-3 backdrop-blur pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <button
          type="button"
          onClick={themVaoGio}
          disabled={!conBan}
          className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-md border-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            vuaThem
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-son-700 bg-white text-son-700 active:bg-son-50"
          }`}
        >
          {vuaThem ? (
            <>
              <Check className="h-[18px] w-[18px] shrink-0" />
              {t.sanPham.daThemVaoGio}
            </>
          ) : (
            <>
              <ShoppingBag className="h-[18px] w-[18px] shrink-0" />
              {t.sanPham.themVaoGio}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={muaNgay}
          disabled={!conBan}
          className="flex h-14 flex-1 flex-col items-center justify-center rounded-md border-2 border-son-700 bg-son-700 leading-tight text-kem-50 transition-colors active:bg-son-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {conBan ? (
            <>
              <span className="text-[13px] font-semibold">
                {t.sanPham.muaNgay}
              </span>
              <span className="mt-0.5 text-[15px] font-bold">
                {dinhDangTien(dangChon?.price ?? 0, ngonNgu)}
              </span>
            </>
          ) : (
            <span className="text-[13px] font-semibold">
              {t.sanPham.hetHang}
            </span>
          )}
        </button>
      </div>

      {/* Khung xem ảnh phóng to */}
      {moKhungXemAnh && anh.length > 0 && (
        <XemAnhLon
          viTriBanDau={anhDangXem}
          khiDong={() => setMoKhungXemAnh(false)}
          danhSachAnh={anh.map((a) => ({
            id: a.id,
            url: a.url,
            alt: theoNgonNgu(ngonNgu, a.altVi, a.altEn) || tenSanPham,
          }))}
        />
      )}
    </div>
  );
}
