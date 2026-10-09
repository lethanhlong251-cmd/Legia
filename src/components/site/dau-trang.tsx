"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";

import { Logo } from "@/components/logo";
import { useGioHang } from "@/lib/gio-hang";
import type { BanDich, NgonNgu } from "@/i18n";
import type { CaiDat } from "@/lib/du-lieu";

export function DauTrang({
  ngonNgu,
  t,
  caiDat,
}: {
  ngonNgu: NgonNgu;
  t: BanDich;
  caiDat: CaiDat;
}) {
  const [moMenu, setMoMenu] = useState(false);
  const { soMon, daNapXong } = useGioHang();
  const duongDan = usePathname();

  const g = (dich: string) => `/${ngonNgu}${dich}`;

  const menu = [
    { nhan: t.dieuHuong.trangChu, dich: g("") },
    { nhan: t.dieuHuong.sanPham, dich: g("/san-pham") },
    { nhan: t.dieuHuong.huongDan, dich: g("/huong-dan") },
    { nhan: t.dieuHuong.gioiThieu, dich: g("/gioi-thieu") },
    { nhan: t.dieuHuong.lienHe, dich: g("/lien-he") },
  ];

  // Đường dẫn tương ứng ở ngôn ngữ kia, để nút đổi ngôn ngữ giữ nguyên trang
  const duongDanNgonNguKhac = (() => {
    const khac: NgonNgu = ngonNgu === "vi" ? "en" : "vi";
    const conLai = duongDan.replace(/^\/(vi|en)/, "") || "";
    return `/${khac}${conLai}`;
  })();

  return (
    <>
      {/* Dải thông báo trên cùng */}
      <div className="bg-muc-900 text-kem-200">
        <div className="khung flex min-h-9 items-center justify-center py-2 text-center text-[11.5px] tracking-[0.04em] sm:text-[12.5px]">
          {t.chung.doiTac}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-kem-300 bg-kem-100/95 backdrop-blur supports-[backdrop-filter]:bg-kem-100/85">
        <div className="khung flex h-[72px] items-center justify-between gap-4">
          <Link href={g("")} aria-label={t.chung.tenDayDu}>
            <Logo />
          </Link>

          {/* Menu máy tính */}
          <nav className="hidden items-center gap-8 lg:flex">
            {menu.map((m) => {
              const dangO =
                m.dich === g("")
                  ? duongDan === g("") || duongDan === `${g("")}/`
                  : duongDan.startsWith(m.dich);
              return (
                <Link
                  key={m.dich}
                  href={m.dich}
                  className={`border-b py-1 text-sm tracking-[0.02em] transition-colors ${
                    dangO
                      ? "border-son-700 text-son-700"
                      : "border-transparent text-muc-700 hover:text-son-700"
                  }`}
                >
                  {m.nhan}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            {/* Hotline — chỉ hiện trên máy tính */}
            <a
              href={`tel:${caiDat.hotline}`}
              className="hidden items-center gap-2 px-2 py-2 text-sm text-muc-700 transition-colors hover:text-son-700 xl:flex"
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} />
              {caiDat.hotline}
            </a>

            {/* Đổi ngôn ngữ */}
            <Link
              href={duongDanNgonNguKhac}
              className="flex h-11 items-center px-2 text-xs font-medium tracking-[0.12em] text-muc-500 transition-colors hover:text-son-700"
              aria-label={ngonNgu === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"}
            >
              {ngonNgu === "vi" ? "EN" : "VI"}
            </Link>

            {/* Gọi điện — chỉ hiện trên điện thoại */}
            <a
              href={`tel:${caiDat.hotline}`}
              className="flex h-11 w-11 items-center justify-center text-muc-700 transition-colors hover:text-son-700 sm:hidden"
              aria-label={t.chanTrang.hotline}
            >
              <Phone className="h-5 w-5" strokeWidth={1.5} />
            </a>

            {/* Giỏ hàng */}
            <Link
              href={g("/gio-hang")}
              className="relative flex h-11 w-11 items-center justify-center text-muc-800 transition-colors hover:text-son-700"
              aria-label={`${t.dieuHuong.gioHang}${daNapXong && soMon > 0 ? `, ${soMon}` : ""}`}
            >
              <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.4} />
              {daNapXong && soMon > 0 && (
                <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-son-700 px-1 text-[10px] font-semibold text-kem-50">
                  {soMon > 99 ? "99+" : soMon}
                </span>
              )}
            </Link>

            {/* Nút menu điện thoại */}
            <button
              type="button"
              onClick={() => setMoMenu((v) => !v)}
              className="flex h-11 w-11 items-center justify-center text-muc-800 lg:hidden"
              aria-label="Menu"
              aria-expanded={moMenu}
            >
              {moMenu ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Menu điện thoại */}
        {moMenu && (
          <nav className="border-t border-kem-300 bg-kem-100 lg:hidden">
            <div className="khung flex flex-col py-3">
              {menu.map((m) => (
                <Link
                  key={m.dich}
                  href={m.dich}
                  onClick={() => setMoMenu(false)}
                  className="border-b border-kem-300 py-3.5 font-display text-xl text-muc-900 transition-colors last:border-b-0 hover:text-son-700"
                >
                  {m.nhan}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
