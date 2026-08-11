"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { dinhDangTien } from "@/lib/dinh-dang";
import { useGioHang } from "@/lib/gio-hang";
import type { BanDich, NgonNgu } from "@/i18n";

export function NoiDungGioHang({
  ngonNgu,
  t,
}: {
  ngonNgu: NgonNgu;
  t: BanDich;
}) {
  const { danhSach, tongTien, doiSoLuong, xoa, daNapXong } = useGioHang();

  // Chưa đọc xong localStorage thì để chỗ trống, tránh nội dung nhảy
  if (!daNapXong) {
    return <div className="h-72" aria-hidden />;
  }

  if (danhSach.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-kem-500" strokeWidth={1.3} />
        <h2 className="mt-5 font-display text-xl text-muc-900">
          {t.gioHang.trong}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muc-500">
          {t.gioHang.trongMoTa}
        </p>
        <Link href={`/${ngonNgu}/san-pham`} className="nut-chinh mt-7">
          {t.gioHang.tiepTucMua}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
      {/* Danh sách món hàng */}
      <ul className="divide-y divide-kem-300 overflow-hidden rounded-lg border border-kem-300 bg-white">
        {danhSach.map((mon) => (
          <li key={mon.variantId} className="flex gap-4 p-4">
            <Link
              href={`/${ngonNgu}/san-pham/${mon.productSlug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-kem-300 bg-kem-200"
            >
              {mon.imageUrl && (
                <Image
                  src={mon.imageUrl}
                  alt={mon.productName}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/${ngonNgu}/san-pham/${mon.productSlug}`}
                className="font-display text-[17px] leading-snug text-muc-900 hover:text-son-700"
              >
                {mon.productName}
              </Link>
              <p className="mt-0.5 text-[13px] text-muc-500">
                {mon.variantLabel} · {mon.sku}
              </p>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                <div className="flex items-center rounded-md border border-kem-400">
                  <button
                    type="button"
                    onClick={() => doiSoLuong(mon.variantId, mon.quantity - 1)}
                    className="p-2 text-muc-600 transition-colors hover:text-son-700"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold tabular-nums">
                    {mon.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => doiSoLuong(mon.variantId, mon.quantity + 1)}
                    className="p-2 text-muc-600 transition-colors hover:text-son-700"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold text-son-700">
                    {dinhDangTien(mon.unitPrice * mon.quantity, ngonNgu)}
                  </span>
                  <button
                    type="button"
                    onClick={() => xoa(mon.variantId)}
                    className="rounded p-1.5 text-muc-400 transition-colors hover:bg-son-50 hover:text-son-700"
                    aria-label={`${t.gioHang.xoa} ${mon.productName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Tổng tiền */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-lg border border-kem-300 bg-white p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muc-600">{t.gioHang.tamTinh}</dt>
              <dd className="font-medium text-muc-800">
                {dinhDangTien(tongTien, ngonNgu)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muc-600">{t.gioHang.phiVanChuyen}</dt>
              <dd className="font-medium text-emerald-700">
                {t.gioHang.mienPhi}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-kem-300 pt-3.5">
              <dt className="font-semibold text-muc-800">
                {t.gioHang.tongCong}
              </dt>
              <dd className="font-display text-xl font-semibold text-son-700">
                {dinhDangTien(tongTien, ngonNgu)}
              </dd>
            </div>
          </dl>

          <Link
            href={`/${ngonNgu}/thanh-toan`}
            className="nut-chinh mt-6 w-full"
          >
            {t.gioHang.datHang}
          </Link>

          <p className="mt-3 text-center text-xs leading-relaxed text-muc-500">
            {t.datHang.thanhToanMoTa}
          </p>
        </div>

        <Link
          href={`/${ngonNgu}/san-pham`}
          className="mt-4 block text-center text-sm font-medium text-son-700 underline-offset-4 hover:underline"
        >
          ← {t.gioHang.tiepTucMua}
        </Link>
      </div>
    </div>
  );
}
