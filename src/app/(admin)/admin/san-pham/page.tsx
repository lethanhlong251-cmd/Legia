import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { dinhDangTien } from "@/lib/dinh-dang";
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
      moTa="Bật tắt hiển thị và tồn kho ngay tại đây. Bấm tên sản phẩm để sửa giá và nội dung."
      hanhDong={
        <Link href="/admin/san-pham/moi" className="nut-chinh !py-2 !text-[13px]">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Link>
      }
    >
      <div className="overflow-hidden rounded-lg border border-kem-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="bg-kem-100 text-left text-xs uppercase tracking-wider text-muc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Sản phẩm</th>
                <th className="px-5 py-3 font-semibold">Danh mục</th>
                <th className="px-5 py-3 font-semibold">Giá</th>
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
        hẳn sản phẩm khỏi website. Tắt “Còn hàng” khi hết hàng tạm thời — sản
        phẩm vẫn hiện nhưng khách không đặt được, và có nhãn “Tạm hết hàng”.
      </p>
    </KhungQuanTri>
  );
}
