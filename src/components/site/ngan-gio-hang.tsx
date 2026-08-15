"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { dinhDangTien } from "@/lib/dinh-dang";
import { dongNganGio, useGioHang, useNganGioDangMo } from "@/lib/gio-hang";
import type { BanDich, NgonNgu } from "@/i18n";

/**
 * NGĂN GIỎ HÀNG TRƯỢT TỪ BÊN PHẢI
 * -------------------------------
 * Tự mở ra mỗi khi khách thêm một món vào giỏ. Khách thấy ngay vừa thêm
 * được gì, tổng bao nhiêu tiền, và có nút đặt hàng luôn — không phải rời
 * khỏi trang đang xem.
 */
export function NganGioHang({
  ngonNgu,
  t,
}: {
  ngonNgu: NgonNgu;
  t: BanDich;
}) {
  const dangMo = useNganGioDangMo();
  const { danhSach, tongTien, soMon, doiSoLuong, xoa } = useGioHang();
  const vi = ngonNgu === "vi";

  // Bấm Esc để đóng
  useEffect(() => {
    if (!dangMo) return;
    const xuLy = (su: KeyboardEvent) => {
      if (su.key === "Escape") dongNganGio();
    };
    window.addEventListener("keydown", xuLy);
    return () => window.removeEventListener("keydown", xuLy);
  }, [dangMo]);

  // Khoá cuộn trang phía sau khi ngăn đang mở
  useEffect(() => {
    if (!dangMo) return;
    const cuonCu = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = cuonCu;
    };
  }, [dangMo]);

  return (
    <>
      {/* Lớp phủ mờ phía sau */}
      <div
        onClick={dongNganGio}
        aria-hidden
        className={`fixed inset-0 z-[55] bg-muc-900/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          dangMo ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.dieuHuong.gioHang}
        aria-hidden={!dangMo}
        className={`fixed inset-y-0 right-0 z-[56] flex w-full max-w-[26rem] flex-col bg-kem-100 shadow-manh transition-transform duration-300 ${
          dangMo ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Đầu ngăn */}
        <header className="flex items-center justify-between border-b border-kem-300 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Check className="h-5 w-5 text-emerald-600" />
            <h2 className="font-display text-lg text-muc-900">
              {vi ? "Đã thêm vào giỏ" : "Added to cart"}
            </h2>
          </div>
          <button
            type="button"
            onClick={dongNganGio}
            aria-label={t.chung.dong}
            className="rounded-full p-2 text-muc-500 transition-colors hover:bg-kem-200 hover:text-muc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Danh sách món */}
        {danhSach.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-11 w-11 text-kem-500" strokeWidth={1.3} />
            <p className="mt-4 font-display text-lg text-muc-900">
              {t.gioHang.trong}
            </p>
            <button
              type="button"
              onClick={dongNganGio}
              className="nut-phu mt-6"
            >
              {t.gioHang.tiepTucMua}
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-kem-300 overflow-y-auto px-5">
              {danhSach.map((mon) => (
                <li key={mon.variantId} className="flex gap-3.5 py-4">
                  <Link
                    href={`/${ngonNgu}/san-pham/${mon.productSlug}`}
                    onClick={dongNganGio}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-kem-300 bg-kem-200"
                  >
                    {mon.imageUrl && (
                      <Image
                        src={mon.imageUrl}
                        alt={mon.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/${ngonNgu}/san-pham/${mon.productSlug}`}
                      onClick={dongNganGio}
                      className="font-display text-[15px] leading-snug text-muc-900 hover:text-son-700"
                    >
                      {mon.productName}
                    </Link>
                    <p className="mt-0.5 text-xs text-muc-500">
                      {mon.variantLabel}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center rounded-md border border-kem-400 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            doiSoLuong(mon.variantId, mon.quantity - 1)
                          }
                          aria-label={vi ? "Giảm số lượng" : "Decrease"}
                          className="p-1.5 text-muc-600 hover:text-son-700"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-[13px] font-semibold tabular-nums">
                          {mon.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            doiSoLuong(mon.variantId, mon.quantity + 1)
                          }
                          aria-label={vi ? "Tăng số lượng" : "Increase"}
                          className="p-1.5 text-muc-600 hover:text-son-700"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-son-700">
                          {dinhDangTien(mon.unitPrice * mon.quantity, ngonNgu)}
                        </span>
                        <button
                          type="button"
                          onClick={() => xoa(mon.variantId)}
                          aria-label={`${t.gioHang.xoa} ${mon.productName}`}
                          className="rounded p-1 text-muc-400 transition-colors hover:bg-son-50 hover:text-son-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Chân ngăn */}
            <footer className="border-t border-kem-300 bg-kem-50 px-5 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muc-600">{t.gioHang.phiVanChuyen}</dt>
                  <dd className="font-medium text-emerald-700">
                    {t.gioHang.mienPhi}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="font-semibold text-muc-800">
                    {t.gioHang.tongCong}
                    <span className="ml-1.5 font-normal text-muc-500">
                      ({soMon})
                    </span>
                  </dt>
                  <dd className="font-display text-xl font-semibold text-son-700">
                    {dinhDangTien(tongTien, ngonNgu)}
                  </dd>
                </div>
              </dl>

              <Link
                href={`/${ngonNgu}/thanh-toan`}
                onClick={dongNganGio}
                className="nut-chinh mt-4 w-full"
              >
                {t.gioHang.datHang}
              </Link>

              <div className="mt-2.5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={dongNganGio}
                  className="text-[13px] font-medium text-muc-600 underline-offset-4 hover:text-son-700 hover:underline"
                >
                  ← {t.gioHang.tiepTucMua}
                </button>
                <Link
                  href={`/${ngonNgu}/gio-hang`}
                  onClick={dongNganGio}
                  className="text-[13px] font-medium text-son-700 underline-offset-4 hover:underline"
                >
                  {t.gioHang.tieuDe}
                </Link>
              </div>

              <p className="mt-3 text-center text-[11px] leading-relaxed text-muc-500">
                {t.datHang.thanhToanKhiNhan}
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
