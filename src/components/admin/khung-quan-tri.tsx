import Link from "next/link";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  ScrollText,
  Settings,
  Store,
} from "lucide-react";

import { dangXuat } from "@/app/actions/quan-tri";
import { BieuTuongKhuon } from "@/components/logo";

const MENU = [
  { nhan: "Tổng quan", dich: "/admin", icon: LayoutDashboard },
  { nhan: "Đơn hàng", dich: "/admin/don-hang", icon: ScrollText },
  { nhan: "Sản phẩm", dich: "/admin/san-pham", icon: Package },
  { nhan: "Danh mục", dich: "/admin/danh-muc", icon: FolderTree },
  { nhan: "Cài đặt", dich: "/admin/cai-dat", icon: Settings },
];

export function KhungQuanTri({
  tenNguoiDung,
  tieuDe,
  moTa,
  hanhDong,
  children,
}: {
  tenNguoiDung: string;
  tieuDe: string;
  moTa?: string;
  hanhDong?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* ---------- Thanh bên ---------- */}
      <aside className="shrink-0 bg-muc-900 lg:w-60">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <BieuTuongKhuon
            className="h-8 w-8"
            mauChinh="#FAF6EF"
            mauNhan="#C8A24A"
          />
          <div>
            <p className="font-display text-sm tracking-[0.12em] text-kem-50">
              CHOURMAS
            </p>
            <p className="text-[9px] font-semibold tracking-[0.18em] text-dong-500">
              QUẢN TRỊ
            </p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {MENU.map(({ nhan, dich, icon: Icon }) => (
            <Link
              key={dich}
              href={dich}
              className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-kem-400 transition-colors hover:bg-muc-800 hover:text-kem-100"
            >
              <Icon className="h-4 w-4" />
              {nhan}
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-kem-500/15 p-3 lg:block">
          <Link
            href="/vi"
            target="_blank"
            className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-kem-400 transition-colors hover:bg-muc-800 hover:text-kem-100"
          >
            <Store className="h-4 w-4" />
            Xem website
          </Link>
          <form action={dangXuat}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-kem-400 transition-colors hover:bg-muc-800 hover:text-kem-100"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </form>
          <p className="mt-3 px-3 text-[11px] text-kem-500">{tenNguoiDung}</p>
        </div>
      </aside>

      {/* ---------- Nội dung ---------- */}
      <div className="flex-1 bg-kem-200">
        <header className="border-b border-kem-300 bg-kem-100">
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
            <div>
              <h1 className="font-display text-2xl text-muc-900">{tieuDe}</h1>
              {moTa && <p className="mt-1 text-sm text-muc-500">{moTa}</p>}
            </div>
            <div className="flex items-center gap-2">
              {hanhDong}
              <form action={dangXuat} className="lg:hidden">
                <button
                  type="submit"
                  className="rounded-md border border-kem-400 px-3 py-2 text-sm text-muc-600"
                >
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
