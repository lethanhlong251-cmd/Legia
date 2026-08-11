import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone, StickyNote } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { dinhDangNgay, dinhDangTien } from "@/lib/dinh-dang";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { NHAN_TRANG_THAI } from "@/components/admin/nhan-trang-thai";
import { DieuKhienDon } from "@/components/admin/dieu-khien-don";

export const dynamic = "force-dynamic";

export default async function TrangChiTietDon({
  params,
}: PageProps<"/admin/don-hang/[id]">) {
  const nguoiDung = await batBuocDangNhap();
  const { id } = await params;

  const don = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!don) notFound();

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe={`Đơn ${don.code}`}
      moTa={dinhDangNgay(don.createdAt)}
      hanhDong={
        <Link href="/admin/don-hang" className="nut-phu !py-2 !text-[13px]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Danh sách đơn
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          {/* Thông tin khách */}
          <section className="rounded-lg border border-kem-300 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg text-muc-900">
                Thông tin nhận hàng
              </h2>
              <NHAN_TRANG_THAI trangThai={don.status} />
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muc-500">
                  Người nhận
                </dt>
                <dd className="mt-1 font-medium text-muc-900">
                  {don.customerName}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muc-500">
                  Điện thoại
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${don.phone}`}
                    className="inline-flex items-center gap-1.5 font-medium text-son-700 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {don.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muc-500">
                  Địa chỉ
                </dt>
                <dd className="mt-1 flex gap-1.5 text-muc-800">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muc-400" />
                  <span>
                    {don.address}
                    {don.province ? `, ${don.province}` : ""}
                  </span>
                </dd>
              </div>
              {don.note && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muc-500">
                    Ghi chú của khách
                  </dt>
                  <dd className="mt-1 flex gap-1.5 rounded-md bg-dong-50 p-3 text-muc-800">
                    <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dong-600" />
                    {don.note}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Sản phẩm trong đơn */}
          <section className="overflow-hidden rounded-lg border border-kem-300 bg-white">
            <h2 className="border-b border-kem-300 px-6 py-4 font-display text-lg text-muc-900">
              Sản phẩm ({don.items.length})
            </h2>
            <ul className="divide-y divide-kem-200">
              {don.items.map((mon) => (
                <li key={mon.id} className="flex gap-4 px-6 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-kem-300 bg-kem-200">
                    {mon.imageUrl && (
                      <Image
                        src={mon.imageUrl}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-muc-900">
                      {mon.productName}
                    </p>
                    <p className="text-[13px] text-muc-500">
                      {mon.variantLabel}
                      {mon.sku ? ` · ${mon.sku}` : ""}
                    </p>
                    <p className="mt-1 text-[13px] text-muc-600">
                      {dinhDangTien(mon.unitPrice)} × {mon.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-muc-900">
                    {dinhDangTien(mon.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-2.5 border-t border-kem-300 bg-kem-50 px-6 py-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muc-600">Tiền hàng</dt>
                <dd className="font-medium">{dinhDangTien(don.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muc-600">Phí vận chuyển</dt>
                <dd className="font-medium text-emerald-700">
                  {don.shippingFee === 0 ? "Miễn phí" : dinhDangTien(don.shippingFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-kem-300 pt-2.5">
                <dt className="font-semibold text-muc-800">
                  Khách phải trả (COD)
                </dt>
                <dd className="font-display text-xl font-semibold text-son-700">
                  {dinhDangTien(don.total)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Cột điều khiển */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-lg border border-kem-300 bg-white p-6">
            <DieuKhienDon
              idDon={don.id}
              trangThaiHienTai={don.status}
              ghiChuHienTai={don.adminNote ?? ""}
            />
          </div>
        </div>
      </div>
    </KhungQuanTri>
  );
}
