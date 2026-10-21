import Image from "next/image";
import Link from "next/link";
import { History, Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { dinhDangNgay } from "@/lib/dinh-dang";
import { NGUONG_SAP_HET, TEN_LY_DO } from "@/lib/ton-kho";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { DongTonKho } from "@/components/admin/dong-ton-kho";

export const dynamic = "force-dynamic";

const CAC_BO_LOC = [
  { khoa: "tat-ca", nhan: "Tất cả" },
  { khoa: "sap-het", nhan: "Sắp hết" },
  { khoa: "het-hang", nhan: "Hết hàng" },
  { khoa: "chua-theo-doi", nhan: "Chưa theo dõi" },
] as const;

type KhoaLoc = (typeof CAC_BO_LOC)[number]["khoa"];

function phanLoai(ton: number | null): Exclude<KhoaLoc, "tat-ca"> | "con" {
  if (ton === null) return "chua-theo-doi";
  if (ton <= 0) return "het-hang";
  if (ton <= NGUONG_SAP_HET) return "sap-het";
  return "con";
}

export default async function TrangTonKho({
  searchParams,
}: PageProps<"/admin/ton-kho">) {
  const nguoiDung = await batBuocDangNhap();
  const thamSo = await searchParams;
  const locTho = String(thamSo.loc ?? "tat-ca");
  const loc: KhoaLoc = CAC_BO_LOC.some((b) => b.khoa === locTho)
    ? (locTho as KhoaLoc)
    : "tat-ca";
  const idSanPham = typeof thamSo.sp === "string" ? thamSo.sp : undefined;

  const [sanPham, lichSu] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        images: { where: { isMain: true }, take: 1 },
        variants: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.stockMovement.findMany({
      where: idSanPham ? { variant: { productId: idSanPham } } : undefined,
      orderBy: { createdAt: "desc" },
      take: 40,
      include: { variant: { include: { product: true } } },
    }),
  ]);

  // ----- Số liệu tổng -----
  const tatCaBienThe = sanPham.flatMap((sp) => sp.variants);
  const dem = { "sap-het": 0, "het-hang": 0, "chua-theo-doi": 0, con: 0 };
  let tongChiec = 0;
  for (const b of tatCaBienThe) {
    dem[phanLoai(b.stock)]++;
    if (b.stock !== null && b.stock > 0) tongChiec += b.stock;
  }
  const soDangTheoDoi = tatCaBienThe.length - dem["chua-theo-doi"];

  // ----- Lọc -----
  const hienThi = sanPham
    .filter((sp) => !idSanPham || sp.id === idSanPham)
    .map((sp) => ({
      ...sp,
      variants: sp.variants.filter(
        (b) => loc === "tat-ca" || phanLoai(b.stock) === loc,
      ),
    }))
    .filter((sp) => sp.variants.length > 0);

  const spDangXem = idSanPham
    ? sanPham.find((sp) => sp.id === idSanPham)
    : undefined;

  const duongDan = (khoa: KhoaLoc) => {
    const q = new URLSearchParams();
    if (khoa !== "tat-ca") q.set("loc", khoa);
    if (idSanPham) q.set("sp", idSanPham);
    const chuoi = q.toString();
    return `/admin/ton-kho${chuoi ? `?${chuoi}` : ""}`;
  };

  const oThongKe = [
    { nhan: "Tổng số khuôn trong kho", giaTri: tongChiec, mau: "text-muc-900" },
    {
      nhan: "Cỡ đang theo dõi",
      giaTri: `${soDangTheoDoi}/${tatCaBienThe.length}`,
      mau: "text-muc-900",
    },
    {
      nhan: `Sắp hết (còn ≤ ${NGUONG_SAP_HET})`,
      giaTri: dem["sap-het"],
      mau: dem["sap-het"] > 0 ? "text-amber-700" : "text-muc-900",
    },
    {
      nhan: "Hết hàng",
      giaTri: dem["het-hang"],
      mau: dem["het-hang"] > 0 ? "text-son-700" : "text-muc-900",
    },
  ];

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe="Tồn kho"
      moTa="Nhập số lượng hàng về. Khách đặt thì tự trừ, huỷ đơn thì tự cộng lại, về 0 thì website tự hiện “Tạm hết hàng”."
    >
      {/* Ô thống kê */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {oThongKe.map((o) => (
          <div
            key={o.nhan}
            className="rounded-lg border border-kem-300 bg-white p-5"
          >
            <p className="text-[13px] font-medium text-muc-500">{o.nhan}</p>
            <p
              className={`mt-2 font-display text-2xl font-semibold tabular-nums ${o.mau}`}
            >
              {o.giaTri}
            </p>
          </div>
        ))}
      </div>

      {/* Bộ lọc */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {CAC_BO_LOC.map((b) => {
          const so =
            b.khoa === "tat-ca" ? tatCaBienThe.length : dem[b.khoa];
          const dangChon = b.khoa === loc;
          return (
            <Link
              key={b.khoa}
              href={duongDan(b.khoa)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                dangChon
                  ? "border-son-700 bg-son-700 text-kem-50"
                  : "border-kem-400 bg-white text-muc-700 hover:border-son-700"
              }`}
            >
              {b.nhan}
              <span
                className={`ml-1.5 tabular-nums ${dangChon ? "text-kem-200" : "text-muc-400"}`}
              >
                {so}
              </span>
            </Link>
          );
        })}

        {spDangXem && (
          <span className="ml-1 inline-flex items-center gap-2 rounded-full bg-dong-50 px-3.5 py-1.5 text-[13px] text-muc-700">
            Chỉ xem: <strong>{spDangXem.nameVi}</strong>
            <Link
              href={loc === "tat-ca" ? "/admin/ton-kho" : `/admin/ton-kho?loc=${loc}`}
              className="text-son-700 hover:underline"
            >
              Xem tất cả
            </Link>
          </span>
        )}
      </div>

      {/* Danh sách */}
      <div className="mt-5 space-y-4">
        {hienThi.length === 0 && (
          <div className="rounded-lg border border-dashed border-kem-400 bg-white px-6 py-12 text-center text-sm text-muc-500">
            Không có cỡ nào trong mục này.
          </div>
        )}

        {hienThi.map((sp) => {
          const anh = sp.images[0];
          return (
            <section
              key={sp.id}
              className="overflow-hidden rounded-lg border border-kem-300 bg-white"
            >
              <header className="flex items-center gap-3 border-b border-kem-200 bg-kem-50 px-5 py-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-kem-300 bg-kem-200">
                  {anh && (
                    <Image
                      src={anh.url}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-muc-900">
                    {sp.nameVi}
                    {!sp.isActive && (
                      <span className="ml-2 text-[11px] font-normal text-muc-500">
                        (đang ẩn khỏi web)
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-muc-500">{sp.sku}</p>
                </div>
                <Link
                  href={`/admin/san-pham/${sp.id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 text-[12px] text-muc-500 hover:text-son-700"
                >
                  <Pencil className="h-3 w-3" />
                  Sửa sản phẩm
                </Link>
              </header>

              <div className="divide-y divide-kem-200">
                {sp.variants.map((b) => (
                  <DongTonKho
                    key={b.id}
                    id={b.id}
                    nhan={b.labelVi}
                    ghiChu={b.noteVi}
                    ton={b.stock}
                    dangBat={b.inStock && sp.inStock}
                    laMonLe={b.isAccessory}
                    nguongSapHet={NGUONG_SAP_HET}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-muc-500">
        <strong className="text-muc-700">Nhập thêm</strong> cộng số mới vào kho
        (dùng khi hàng về). <strong className="text-muc-700">Đặt đúng số</strong>{" "}
        dùng sau khi đếm lại hàng thực tế, kho sẽ bằng đúng số bạn gõ. Cỡ{" "}
        <em>chưa theo dõi</em> thì khách đặt không giới hạn, như trước đây.
        Khách không bao giờ thấy con số tồn kho, chỉ thấy “Tạm hết hàng” khi về
        0.
      </p>

      {/* Lịch sử */}
      <section className="mt-8 overflow-hidden rounded-lg border border-kem-300 bg-white">
        <h2 className="flex items-center gap-2 border-b border-kem-300 px-5 py-4 font-display text-lg text-muc-900">
          <History className="h-4 w-4 text-dong-500" />
          Lịch sử kho gần đây
          {spDangXem && (
            <span className="font-sans text-sm font-normal text-muc-500">
              · {spDangXem.nameVi}
            </span>
          )}
        </h2>
        {lichSu.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muc-500">
            Chưa có thay đổi nào. Nhập số lượng ở trên để bắt đầu.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-kem-100 text-left text-xs uppercase tracking-wider text-muc-500">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">Thời gian</th>
                  <th className="px-5 py-2.5 font-semibold">Sản phẩm</th>
                  <th className="px-5 py-2.5 font-semibold">Lý do</th>
                  <th className="px-5 py-2.5 text-right font-semibold">Thay đổi</th>
                  <th className="px-5 py-2.5 text-right font-semibold">Còn lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kem-200">
                {lichSu.map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap px-5 py-2.5 text-muc-500">
                      {dinhDangNgay(m.createdAt)}
                    </td>
                    <td className="px-5 py-2.5 text-muc-800">
                      {m.variant.product.nameVi}
                      <span className="text-muc-500"> — {m.variant.labelVi}</span>
                    </td>
                    <td className="px-5 py-2.5 text-muc-600">
                      {TEN_LY_DO[m.reason] ?? m.reason}
                      {m.orderId && m.orderCode && (
                        <>
                          {" "}
                          <Link
                            href={`/admin/don-hang/${m.orderId}`}
                            className="font-medium text-son-700 hover:underline"
                          >
                            {m.orderCode}
                          </Link>
                        </>
                      )}
                      {m.note && (
                        <span className="text-muc-400"> · {m.note}</span>
                      )}
                    </td>
                    <td
                      className={`whitespace-nowrap px-5 py-2.5 text-right font-semibold tabular-nums ${
                        m.change > 0
                          ? "text-emerald-700"
                          : m.change < 0
                            ? "text-son-700"
                            : "text-muc-500"
                      }`}
                    >
                      {m.change > 0 ? `+${m.change}` : m.change}
                    </td>
                    <td className="whitespace-nowrap px-5 py-2.5 text-right tabular-nums text-muc-800">
                      {m.stockAfter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </KhungQuanTri>
  );
}
