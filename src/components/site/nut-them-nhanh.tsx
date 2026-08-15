"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Plus, ShoppingBag } from "lucide-react";

import { dinhDangTien } from "@/lib/dinh-dang";
import { useGioHang } from "@/lib/gio-hang";
import { theoNgonNgu, type BanDich, type NgonNgu } from "@/i18n";

/**
 * NÚT THÊM NHANH TRÊN THẺ SẢN PHẨM
 * --------------------------------
 * Khuôn có nhiều cỡ, mà cỡ 150g vừa khay 9 còn 200g vừa khay 10. Nếu tự
 * chọn giùm khách thì rất dễ giao nhầm cỡ, vừa tốn phí đổi trả vừa mất
 * thiện cảm. Nên ở đây:
 *
 *  - Mẫu chỉ có MỘT cỡ  → bấm phát vào giỏ luôn
 *  - Mẫu có NHIỀU cỡ    → hiện bảng chọn cỡ ngay trên thẻ, chọn xong mới thêm
 */

type BienThe = {
  id: string;
  labelVi: string;
  labelEn: string;
  price: number;
  inStock: boolean;
  isAccessory: boolean;
};

export function NutThemNhanh({
  ngonNgu,
  t,
  sanPham,
  bienThe,
}: {
  ngonNgu: NgonNgu;
  t: BanDich;
  sanPham: {
    slug: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    inStock: boolean;
    anhChinh: string;
  };
  bienThe: BienThe[];
}) {
  const { them } = useGioHang();
  const [moBangChon, setMoBangChon] = useState(false);
  const [vuaThem, setVuaThem] = useState(false);
  const [dangThem, setDangThem] = useState<string | null>(null);
  const boc = useRef<HTMLDivElement>(null);

  const vi = ngonNgu === "vi";
  const tenSanPham = theoNgonNgu(ngonNgu, sanPham.nameVi, sanPham.nameEn);

  // Món mua lẻ không hiện ở đây, khách muốn mua thì vào trang chi tiết
  const cacCoBan = bienThe.filter((b) => !b.isAccessory && b.inStock);
  const conBan = sanPham.inStock && cacCoBan.length > 0;

  // Bấm ra ngoài thì đóng bảng chọn
  useEffect(() => {
    if (!moBangChon) return;
    const xuLy = (su: MouseEvent) => {
      if (boc.current && !boc.current.contains(su.target as Node)) {
        setMoBangChon(false);
      }
    };
    const xuLyPhim = (su: KeyboardEvent) => {
      if (su.key === "Escape") setMoBangChon(false);
    };
    document.addEventListener("mousedown", xuLy);
    window.addEventListener("keydown", xuLyPhim);
    return () => {
      document.removeEventListener("mousedown", xuLy);
      window.removeEventListener("keydown", xuLyPhim);
    };
  }, [moBangChon]);

  function themVaoGio(b: BienThe) {
    setDangThem(b.id);
    them({
      variantId: b.id,
      productSlug: sanPham.slug,
      productName: tenSanPham,
      variantLabel: theoNgonNgu(ngonNgu, b.labelVi, b.labelEn),
      sku: sanPham.sku,
      imageUrl: sanPham.anhChinh,
      unitPrice: b.price,
    });
    setMoBangChon(false);
    setDangThem(null);
    setVuaThem(true);
    setTimeout(() => setVuaThem(false), 2000);
  }

  function bamNut() {
    if (cacCoBan.length === 1) themVaoGio(cacCoBan[0]);
    else setMoBangChon((v) => !v);
  }

  if (!conBan) {
    return (
      <span className="block w-full rounded-md border border-kem-400 bg-kem-200 px-4 py-2.5 text-center text-[13px] font-semibold text-muc-500">
        {t.sanPham.hetHang}
      </span>
    );
  }

  return (
    <div ref={boc} className="relative">
      {/* Bảng chọn cỡ, hiện đè lên phía trên nút */}
      {moBangChon && (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-lg border border-kem-400 bg-white shadow-manh">
          <p className="border-b border-kem-300 bg-kem-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muc-500">
            {t.sanPham.chonPhienBan}
          </p>
          <ul className="max-h-56 overflow-y-auto">
            {cacCoBan.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => themVaoGio(b)}
                  disabled={dangThem === b.id}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-son-50"
                >
                  <span className="truncate text-[13px] font-medium text-muc-800">
                    {theoNgonNgu(ngonNgu, b.labelVi, b.labelEn)}
                  </span>
                  <span className="shrink-0 text-[13px] font-semibold text-son-700">
                    {dangThem === b.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      dinhDangTien(b.price, ngonNgu)
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={bamNut}
        aria-expanded={cacCoBan.length > 1 ? moBangChon : undefined}
        aria-label={`${t.sanPham.themVaoGio} — ${tenSanPham}`}
        className={`flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-semibold transition-all ${
          vuaThem
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-son-700/30 bg-white text-son-700 hover:border-son-700 hover:bg-son-700 hover:text-kem-50"
        }`}
      >
        {vuaThem ? (
          <>
            <Check className="h-4 w-4" />
            {t.sanPham.daThemVaoGio}
          </>
        ) : (
          <>
            {cacCoBan.length > 1 ? (
              <Plus className="h-4 w-4" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
            {cacCoBan.length > 1
              ? vi
                ? "Chọn cỡ"
                : "Choose size"
              : t.sanPham.themVaoGio}
          </>
        )}
      </button>
    </div>
  );
}
