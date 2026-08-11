"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";

import { datHang } from "@/app/actions/dat-hang";
import { dinhDangTien, laSoDienThoaiVN } from "@/lib/dinh-dang";
import { useGioHang } from "@/lib/gio-hang";
import type { BanDich, NgonNgu } from "@/i18n";

export function MauThanhToan({
  ngonNgu,
  t,
  hotline,
}: {
  ngonNgu: NgonNgu;
  t: BanDich;
  hotline: string;
}) {
  const router = useRouter();
  const { danhSach, tongTien, daNapXong, xoaHet } = useGioHang();
  const [dangGui, batDauGui] = useTransition();
  const [loi, setLoi] = useState<string | null>(null);
  const [loiTung0, setLoiTung0] = useState<Record<string, string>>({});

  if (!daNapXong) return <div className="h-96" aria-hidden />;

  if (danhSach.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <h2 className="font-display text-xl text-muc-900">{t.gioHang.trong}</h2>
        <p className="mt-2 text-sm text-muc-500">{t.gioHang.trongMoTa}</p>
        <Link href={`/${ngonNgu}/san-pham`} className="nut-chinh mt-7">
          {t.gioHang.tiepTucMua}
        </Link>
      </div>
    );
  }

  function guiDon(formData: FormData) {
    setLoi(null);

    const hoTen = String(formData.get("customerName") ?? "").trim();
    const sdt = String(formData.get("phone") ?? "").trim();
    const diaChi = String(formData.get("address") ?? "").trim();

    // Kiểm tra ngay trong trình duyệt để báo lỗi nhanh cho khách
    const loiMoi: Record<string, string> = {};
    if (hoTen.length < 2) loiMoi.customerName = t.datHang.loiThieuTen;
    if (!laSoDienThoaiVN(sdt)) loiMoi.phone = t.datHang.loiSaiSdt;
    if (diaChi.length < 5) loiMoi.address = t.datHang.loiThieuDiaChi;

    setLoiTung0(loiMoi);
    if (Object.keys(loiMoi).length > 0) return;

    batDauGui(async () => {
      const ketQua = await datHang({
        customerName: hoTen,
        phone: sdt,
        address: diaChi,
        province: String(formData.get("province") ?? "").trim() || undefined,
        note: String(formData.get("note") ?? "").trim() || undefined,
        items: danhSach.map((m) => ({
          variantId: m.variantId,
          quantity: m.quantity,
        })),
        lang: ngonNgu,
      });

      if (ketQua.thanhCong) {
        xoaHet();
        router.push(`/${ngonNgu}/dat-hang-thanh-cong?ma=${ketQua.maDon}`);
      } else {
        setLoi(ketQua.loi);
      }
    });
  }

  return (
    <form
      action={guiDon}
      className="mt-8 grid gap-8 pb-24 lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:pb-0"
    >
      {/* ---------- Thông tin nhận hàng ---------- */}
      <div>
        <div className="rounded-lg border border-kem-300 bg-white p-6">
          <h2 className="font-display text-xl text-muc-900">
            {t.datHang.tieuDe}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muc-500">
            {t.datHang.moTa}
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="customerName" className="nhan-o-nhap">
                {t.datHang.hoTen} <span className="text-son-700">*</span>
              </label>
              <input
                id="customerName"
                name="customerName"
                autoComplete="name"
                required
                placeholder={t.datHang.hoTenGoiY}
                aria-invalid={!!loiTung0.customerName}
                className="o-nhap"
              />
              {loiTung0.customerName && (
                <p className="mt-1.5 text-xs text-son-700">
                  {loiTung0.customerName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="nhan-o-nhap">
                {t.datHang.soDienThoai} <span className="text-son-700">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder={t.datHang.soDienThoaiGoiY}
                aria-invalid={!!loiTung0.phone}
                className="o-nhap"
              />
              {loiTung0.phone && (
                <p className="mt-1.5 text-xs text-son-700">{loiTung0.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="nhan-o-nhap">
                {t.datHang.diaChi} <span className="text-son-700">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                autoComplete="street-address"
                required
                placeholder={t.datHang.diaChiGoiY}
                aria-invalid={!!loiTung0.address}
                className="o-nhap resize-y"
              />
              {loiTung0.address && (
                <p className="mt-1.5 text-xs text-son-700">
                  {loiTung0.address}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="province" className="nhan-o-nhap">
                {t.datHang.tinhThanh}
              </label>
              <input
                id="province"
                name="province"
                autoComplete="address-level1"
                className="o-nhap"
              />
            </div>

            <div>
              <label htmlFor="note" className="nhan-o-nhap">
                {t.datHang.ghiChu}
              </label>
              <textarea
                id="note"
                name="note"
                rows={2}
                placeholder={t.datHang.ghiChuGoiY}
                className="o-nhap resize-y"
              />
            </div>
          </div>
        </div>

        {/* Hình thức thanh toán */}
        <div className="mt-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              {t.datHang.thanhToanKhiNhan}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-emerald-800">
              {t.datHang.thanhToanMoTa}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Tóm tắt đơn ---------- */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-lg border border-kem-300 bg-white p-6">
          <h2 className="font-display text-lg text-muc-900">
            {t.datHang.donHangCuaBan}
          </h2>

          <ul className="mt-4 space-y-3.5">
            {danhSach.map((mon) => (
              <li key={mon.variantId} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-kem-300 bg-kem-200">
                  {mon.imageUrl && (
                    <Image
                      src={mon.imageUrl}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-muc-800 px-1 text-[10px] font-bold text-kem-50">
                    {mon.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-muc-800">
                    {mon.productName}
                  </p>
                  <p className="text-xs text-muc-500">{mon.variantLabel}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-muc-800">
                  {dinhDangTien(mon.unitPrice * mon.quantity, ngonNgu)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-t border-kem-300 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muc-600">{t.gioHang.tamTinh}</dt>
              <dd className="font-medium">{dinhDangTien(tongTien, ngonNgu)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muc-600">{t.gioHang.phiVanChuyen}</dt>
              <dd className="font-medium text-emerald-700">
                {t.gioHang.mienPhi}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-kem-300 pt-3">
              <dt className="font-semibold text-muc-800">
                {t.gioHang.tongCong}
              </dt>
              <dd className="font-display text-xl font-semibold text-son-700">
                {dinhDangTien(tongTien, ngonNgu)}
              </dd>
            </div>
          </dl>

          {loi && (
            <div className="mt-5 flex gap-2.5 rounded-md border border-son-200 bg-son-50 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-son-700" />
              <p className="text-[13px] leading-relaxed text-son-800">{loi}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={dangGui}
            className="nut-chinh mt-5 hidden w-full lg:inline-flex"
          >
            {dangGui ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.datHang.dangGui}
              </>
            ) : (
              t.datHang.xacNhanDatHang
            )}
          </button>

          <p className="mt-4 text-center text-xs text-muc-500">
            {ngonNgu === "vi" ? "Cần hỗ trợ? Gọi " : "Need help? Call "}
            <a
              href={`tel:${hotline}`}
              className="font-semibold text-son-700 hover:underline"
            >
              {hotline}
            </a>
          </p>
        </div>
      </div>

      {/* Thanh xác nhận đặt hàng cố định dưới cùng — chỉ hiện trên điện thoại */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-kem-300 bg-white/95 px-4 py-3 backdrop-blur pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muc-500">{t.gioHang.tongCong}</p>
          <p className="truncate font-display text-lg font-semibold text-son-700">
            {dinhDangTien(tongTien, ngonNgu)}
          </p>
        </div>
        <button
          type="submit"
          disabled={dangGui}
          className="nut-chinh h-12 shrink-0 px-6"
        >
          {dangGui ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t.datHang.xacNhanDatHang
          )}
        </button>
      </div>
    </form>
  );
}
