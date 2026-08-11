import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { layDanhMucPhang } from "@/lib/danh-muc-phang";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { QuanLyDanhMuc } from "@/components/admin/quan-ly-danh-muc";

export const dynamic = "force-dynamic";

export default async function TrangDanhMuc() {
  const nguoiDung = await batBuocDangNhap();

  const [tatCa, phang] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameVi: "asc" }],
      include: { _count: { select: { products: true } } },
    }),
    layDanhMucPhang(),
  ]);

  const capDo = new Map(phang.map((d) => [d.id, d.capDo]));

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe="Danh mục"
      moTa="Dựng sẵn cây danh mục cho các mặt hàng bạn sẽ bán thêm sau này"
    >
      <QuanLyDanhMuc
        danhSach={tatCa.map((d) => ({
          id: d.id,
          slug: d.slug,
          nameVi: d.nameVi,
          nameEn: d.nameEn,
          parentId: d.parentId,
          isActive: d.isActive,
          sortOrder: d.sortOrder,
          soSanPham: d._count.products,
          capDo: capDo.get(d.id) ?? 0,
        }))}
      />
    </KhungQuanTri>
  );
}
