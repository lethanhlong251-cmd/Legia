import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { batBuocDangNhap } from "@/lib/xac-thuc";
import { layDanhMucPhang } from "@/lib/danh-muc-phang";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { SoanSanPham } from "@/components/admin/soan-san-pham";

export const dynamic = "force-dynamic";

export default async function TrangThemSanPham() {
  const nguoiDung = await batBuocDangNhap();
  const danhMuc = await layDanhMucPhang();

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe="Thêm sản phẩm mới"
      moTa="Điền tên, mã và ít nhất một cỡ giá là lưu được. Ảnh thêm sau khi lưu."
      hanhDong={
        <Link href="/admin/san-pham" className="nut-phu !py-2 !text-[13px]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Danh sách
        </Link>
      }
    >
      <SoanSanPham
        danhMuc={danhMuc}
        banDau={{
          sku: "",
          slug: "",
          nameVi: "",
          nameEn: "",
          shortDescVi: "",
          shortDescEn: "",
          descVi: "",
          descEn: "",
          categoryId: danhMuc[0]?.id ?? "",
          faceCount: null,
          diameter: "",
          material: "",
          patterns: "",
          noteVi: "",
          noteEn: "",
          isExclusive: true,
          isFeatured: false,
          isNew: true,
          isActive: true,
          inStock: true,
          sortOrder: 0,
          variants: [
            {
              labelVi: "Cỡ 150g",
              labelEn: "150g",
              price: 0,
              comparePrice: null,
              noteVi: "",
              noteEn: "",
              inStock: true,
            },
          ],
          images: [],
        }}
      />
    </KhungQuanTri>
  );
}
