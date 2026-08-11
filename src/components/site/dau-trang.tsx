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
      <div className="bg-son-700 text-kem-50">
        <div className="khung flex h-9 items-center justify-center gap-2 text-center text-[11px] font-medium tracking-wide sm:text-xs">
          <span className="hidden sm:inline">✦</span>
          <span>{t.chung.doiTac}</span>
          <span className="hidden sm:inline">✦</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-kem-300 bg-kem-100/95 backdrop-blur supports-[backdrop-filter]:bg-kem-100/80">
        <div className="khung flex h-[68px] items-center justify-between gap-4">
          <Link href={g("")} aria-label={t.chung.tenDayDu}>
            <Logo />
          </Link>

          {/* Menu máy tính */}
          <nav className="hidden items-center gap-1 lg:flex">
            {menu.map((m) => {
              const dangO =
                m.dich === g("")
                  ? duongDan === g("") || duongDan === `${g("")}/`
                  : duongDan.startsWith(m.dich);
              return (
                <Link
                  key={m.dich}
                  href={m.dich}
                  className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                    dangO
                      ? "text-son-700"
                      : "text-muc-600 hover:bg-kem-200 hover:text-son-700"
                  }`}
                >
                  {m.nhan}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Đổi ngôn ngữ */}
            <Link
              href={duongDanNgonNguKhac}
              className="rounded-md border border-kem-400 px-2.5 py-1.5 text-xs font-semibold tracking-wide text-muc-600 transition-colors hover:border-son-700 hover:text-son-700"
              aria-label={ngonNgu === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"}
            >
              {ngonNgu === "vi" ? "EN" : "VI"}
            </Link>

            {/* Gọi điện — chỉ hiện trên điện thoại */}
            <a
              href={`tel:${caiDat.hotline}`}
              className="rounded-md p-2.5 text-muc-600 transition-colors hover:bg-kem-200 hover:text-son-700 sm:hidden"
              aria-label={t.chanTrang.hotline}
            >
              <Phone className="h-5 w-5" />
            </a>

            {/* Hotline — chỉ hiện trên máy tính */}
            <a
              href={`tel:${caiDat.hotline}`}
              className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-son-700 transition-colors hover:bg-kem-200 sm:flex"
            >
              <Phone className="h-4 w-4" />
              {caiDat.hotline}
            </a>

            {/* Giỏ hàng */}
            <Link
              href={g("/gio-hang")}
              className="relative rounded-md p-2.5 text-muc-700 transition-colors hover:bg-kem-200 hover:text-son-700"
              aria-label={`${t.dieuHuong.gioHang}${daNapXong && soMon > 0 ? `, ${soMon}` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {daNapXong && soMon > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-son-700 px-1 text-[10px] font-bold text-kem-50">
                  {soMon > 99 ? "99+" : soMon}
                </span>
              )}
            </Link>

            {/* Nút menu điện thoại */}
            <button
              type="button"
              onClick={() => setMoMenu((v) => !v)}
              className="rounded-md p-2.5 text-muc-700 transition-colors hover:bg-kem-200 lg:hidden"
              aria-label="Menu"
              aria-expanded={moMenu}
            >
              {moMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu điện thoại */}
        {moMenu && (
          <nav className="border-t border-kem-300 bg-kem-100 lg:hidden">
            <div className="khung flex flex-col py-2">
              {menu.map((m) => (
                <Link
                  key={m.dich}
                  href={m.dich}
                  onClick={() => setMoMenu(false)}
                  className="rounded-md px-2 py-3 text-[15px] font-medium text-muc-700 transition-colors hover:bg-kem-200 hover:text-son-700"
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
