import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import { Logo } from "@/components/logo";
import type { BanDich, NgonNgu } from "@/i18n";
import type { CaiDat } from "@/lib/du-lieu";

/** Bộ icon lucide-react không có logo thương hiệu, nên vẽ riêng */
function IconFacebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

export function ChanTrang({
  ngonNgu,
  t,
  caiDat,
}: {
  ngonNgu: NgonNgu;
  t: BanDich;
  caiDat: CaiDat;
}) {
  const g = (dich: string) => `/${ngonNgu}${dich}`;
  const zaloSach = caiDat.zalo.replace(/\D/g, "");

  const cotLienKet = [
    {
      tieuDe: t.chanTrang.lienKet,
      muc: [
        { nhan: t.dieuHuong.sanPham, dich: g("/san-pham") },
        { nhan: t.dieuHuong.gioiThieu, dich: g("/gioi-thieu") },
        { nhan: t.dieuHuong.huongDan, dich: g("/huong-dan") },
        { nhan: t.dieuHuong.lienHe, dich: g("/lien-he") },
      ],
    },
    {
      tieuDe: t.chanTrang.hoTro,
      muc: [
        {
          nhan: ngonNgu === "vi" ? "Chính sách vận chuyển" : "Shipping policy",
          dich: g("/chinh-sach/van-chuyen"),
        },
        {
          nhan: ngonNgu === "vi" ? "Chính sách đổi trả" : "Return policy",
          dich: g("/chinh-sach/doi-tra"),
        },
        {
          nhan: ngonNgu === "vi" ? "Chính sách bảo mật" : "Privacy policy",
          dich: g("/chinh-sach/bao-mat"),
        },
      ],
    },
  ];

  return (
    <footer className="mt-20 bg-muc-900 text-kem-300">
      {/* Đường viền vàng đồng trên cùng */}
      <div className="duong-vien-dong h-px w-full" />

      <div className="khung py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Cột giới thiệu */}
          <div className="lg:col-span-2">
            <Logo bien="tren-nen-toi" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-kem-400/90">
              {t.chanTrang.gioiThieuNgan}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${caiDat.hotline}`}
                className="inline-flex items-center gap-2 rounded-md bg-son-700 px-4 py-2.5 text-sm font-semibold text-kem-50 transition-colors hover:bg-son-600"
              >
                <Phone className="h-4 w-4" />
                {caiDat.hotline}
              </a>
              <a
                href={`https://zalo.me/${zaloSach}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-kem-500/30 px-4 py-2.5 text-sm font-semibold text-kem-200 transition-colors hover:border-dong-500 hover:text-dong-400"
              >
                <MessageCircle className="h-4 w-4" />
                Zalo
              </a>
              {caiDat.facebook && (
                <a
                  href={caiDat.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-kem-500/30 px-4 py-2.5 text-sm font-semibold text-kem-200 transition-colors hover:border-dong-500 hover:text-dong-400"
                >
                  <IconFacebook className="h-4 w-4" />
                  Facebook
                </a>
              )}
            </div>
          </div>

          {/* Các cột liên kết */}
          {cotLienKet.map((cot) => (
            <div key={cot.tieuDe}>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-dong-500">
                {cot.tieuDe}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {cot.muc.map((m) => (
                  <li key={m.dich}>
                    <Link
                      href={m.dich}
                      className="text-sm text-kem-400/90 transition-colors hover:text-dong-400"
                    >
                      {m.nhan}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dòng cuối */}
        <div className="mt-12 flex flex-col gap-4 border-t border-kem-500/15 pt-7 text-xs text-kem-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.chanTrang.banQuyen}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {caiDat.diaChi}
            </span>
            <span>{caiDat.gioLamViec}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
