import Link from "next/link";
import { MapPin } from "lucide-react";

import { Logo } from "@/components/logo";
import type { BanDich, NgonNgu } from "@/i18n";
import type { CaiDat } from "@/lib/du-lieu";

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
    <footer className="mt-20 bg-muc-900 text-kem-400">
      <div className="khung pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Cột giới thiệu */}
          <div>
            <Logo bien="tren-nen-toi" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-kem-400">
              {t.chanTrang.gioiThieuNgan}
            </p>
          </div>

          {/* Các cột liên kết */}
          {cotLienKet.map((cot) => (
            <div key={cot.tieuDe}>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-kem-100">
                {cot.tieuDe}
              </h3>
              <ul className="mt-5 space-y-3">
                {cot.muc.map((m) => (
                  <li key={m.dich}>
                    <Link
                      href={m.dich}
                      className="text-sm text-kem-400 transition-colors hover:text-kem-50"
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
        <div className="mt-14 flex flex-col gap-4 border-t border-muc-700 pt-7 text-xs text-muc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.chanTrang.banQuyen}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
              {caiDat.diaChi}
            </span>
            <span>{caiDat.gioLamViec}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
