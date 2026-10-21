import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { dinhDangTien } from "@/lib/dinh-dang";
import { NGUONG_SAP_HET } from "@/lib/ton-kho";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { CongTacNhanh } from "@/components/admin/cong-tac-nhanh";

export const dynamic = "force-dynamic";

export default async function TrangDanhSachSanPhamQuanTri() {
  const nguoiDung = await batBuocDangNhap();

  const danhSach = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      images: { where: { isMain: true }, take: 1 },
      variants: { orderBy: { price: "asc" } },
      category: true,
    },
  });

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe="Sản phẩm"
      moTa="Bật tắt hiển thị ngay tại đây. Bấm tên sản phẩm để sửa giá và nội dung, bấm số tồn kho để nhập hàng."
      hanhDong={
        <Link href="/admin/san-pham/moi" className="nut-chinh !py-2 !text-[13px]">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Link>
      }
    >
      <div className="overflow-hidden rounded-lg border border-kem-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-kem-100 text-left text-xs uppercase tracking-wider text-muc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Sản phẩm</th>
                <th className="px-5 py-3 font-semibold">Danh mục</th>
                <th className="px-5 py-3 font-semibold">Giá</th>
                <th className="px-5 py-3 font-semibold">Tồn kho</th>
                <th className="px-5 py-3 text-center font-semibold">Hiện trên web</th>
                <th className="px-5 py-3 text-center font-semibold">Còn hàng</th>
                <th className="px-5 py-3 text-center font-semibold">Nổi bật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kem-200">
              {danhSach.map((sp) => {
                const anh = sp.images[0];
                const giaThap = sp.variants[0]?.price ?? 0;
                const giaCao = sp.variants[sp.variants.length - 1]?.price ?? 0;
                const coTheoDoi = sp.variants.filter((b) => b.stock !== null);
                const tongKho = coTheoDoi.reduce(
                  (t, b) => t + Math.max(0, b.stock ?? 0),
                  0,
                );
                const soCoHet = coTheoDoi.filter((b) => (b.stock ?? 0) <= 0).length;
                const soCoSapHet = coTheoDoi.filter(
                  (b) => (b.stock ?? 0) > 0 && (b.stock ?? 0) <= NGUONG_SAP_HET,
                ).length;

                return (
                  <tr key={sp.id} className="hover:bg-kem-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-kem-300 bg-kem-200">
                          {anh && (
                            <Image
                              src={anh.url}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/san-pham/${sp.id}`}
                            className="font-medium text-son-700 hover:underline"
                          >
                            {sp.nameVi}
                          </Link>
                          <p className="text-[11px] text-muc-500">
                            {sp.sku} · {sp.variants.length} cỡ
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muc-600">
                      {sp.category.nameVi}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-muc-800">
                      {giaThap === giaCao
                        ? dinhDangTien(giaThap)
                        : `${dinhDangTien(giaThap)} – ${dinhDangTien(giaCao)}`}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/ton-kho?sp=${sp.id}`}
                        className="group block"
                        title="Nhập hàng / kiểm kho"
                      >
                        {coTheoDoi.length === 0 ? (
                          <span className="text-[13px] text-muc-400 group-hover:text-son-700">
                            Chưa theo dõi
                          </span>
                        ) : (
                          <>
                            <span className="font-medium tabular-nums text-muc-800 group-hover:text-son-700">
                              {tongKho} chiếc
                            </span>
                            {(soCoHet > 0 || soCoSapHet > 0) && (
                              <span className="block text-[11px]">
                                {soCoHet > 0 && (
                                  <span className="text-son-700">
                                    {soCoHet} cỡ hết
                                  </span>
                                )}
                                {soCoHet > 0 && soCoSapHet > 0 && " · "}
                                {soCoSapHet > 0 && (
                                  <span className="text-amber-700">
                                    {soCoSapHet} cỡ sắp hết
                                  </span>
                                )}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <CongTacNhanh
                        id={sp.id}
                        loai="hien"
                        batDau={sp.isActive}
                      />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <CongTacNhanh
                        id={sp.id}
                        loai="conHang"
                        batDau={sp.inStock}
                      />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <CongTacNhanh
                        id={sp.id}
                        loai="noiBat"
                        batDau={sp.isFeatured}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-muc-500">
        <strong className="text-muc-700">Mẹo:</strong> Tắt “Hiện trên web” để ẩn
        hẳn sản phẩm khỏi website. Cỡ nào có theo dõi tồn kho thì về 0 là tự
        hiện “Tạm hết hàng”, không cần tắt tay. Công tắc “Còn hàng” vẫn dùng
        được khi muốn tạm ngưng bán dù kho còn.
      </p>
    </KhungQuanTri>
  );
}
