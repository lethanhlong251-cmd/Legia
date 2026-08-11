"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";

import { dinhDangTien, phanTramGiam } from "@/lib/dinh-dang";
import { useGioHang } from "@/lib/gio-hang";
import { theoNgonNgu, type BanDich, type NgonNgu } from "@/i18n";

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
    them(mon, soLuong);
    router.push(`/${ngonNgu}/thanh-toan`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* ---------- Bộ xem ảnh ---------- */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-lg border border-kem-300 bg-kem-200">
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
              className="object-cover"
            />
          ) : null}

          {giamGia !== null && (
            <span className="huy-hieu absolute left-3 top-3 bg-son-700 text-kem-50 shadow-nhe">
              −{giamGia}%
            </span>
          )}
        </div>

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
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-kem-300 bg-white/95 px-4 py-3 backdrop-blur pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <button
          type="button"
          onClick={themVaoGio}
          disabled={!conBan}
          aria-label={t.sanPham.themVaoGio}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-son-700/30 text-son-700 transition-colors hover:bg-son-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {vuaThem ? (
            <Check className="h-5 w-5" />
          ) : (
            <ShoppingBag className="h-5 w-5" />
          )}
        </button>
        <button
          type="button"
          onClick={muaNgay}
          disabled={!conBan}
          className="nut-chinh h-12 flex-1"
        >
          {conBan
            ? `${t.sanPham.muaNgay} · ${dinhDangTien(dangChon?.price ?? 0, ngonNgu)}`
            : t.sanPham.hetHang}
        </button>
      </div>
    </div>
  );
}
