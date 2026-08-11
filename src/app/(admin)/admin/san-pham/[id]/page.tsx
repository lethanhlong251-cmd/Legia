import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { batBuocDangNhap } from "@/lib/xac-thuc";
import { layDanhMucPhang } from "@/lib/danh-muc-phang";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { SoanSanPham } from "@/components/admin/soan-san-pham";

export const dynamic = "force-dynamic";

export default async function TrangSuaSanPham({
  params,
}: PageProps<"/admin/san-pham/[id]">) {
  const nguoiDung = await batBuocDangNhap();
  const { id } = await params;

  const [sanPham, danhMuc] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    layDanhMucPhang(),
  ]);

  if (!sanPham) notFound();

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe={sanPham.nameVi}
      moTa={`Mã ${sanPham.sku}`}
      hanhDong={
        <>
          <Link
            href={`/vi/san-pham/${sanPham.slug}`}
            target="_blank"
            className="nut-phu !py-2 !text-[13px]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Xem trên web
          </Link>
          <Link href="/admin/san-pham" className="nut-phu !py-2 !text-[13px]">
            <ArrowLeft className="h-3.5 w-3.5" />
            Danh sách
          </Link>
        </>
      }
    >
      <SoanSanPham
        danhMuc={danhMuc}
        banDau={{
          id: sanPham.id,
          sku: sanPham.sku,
          slug: sanPham.slug,
          nameVi: sanPham.nameVi,
          nameEn: sanPham.nameEn,
          shortDescVi: sanPham.shortDescVi ?? "",
          shortDescEn: sanPham.shortDescEn ?? "",
          descVi: sanPham.descVi ?? "",
          descEn: sanPham.descEn ?? "",
          categoryId: sanPham.categoryId,
          faceCount: sanPham.faceCount,
          diameter: sanPham.diameter ?? "",
          material: sanPham.material ?? "",
          patterns: sanPham.patterns ?? "",
          noteVi: sanPham.noteVi ?? "",
          noteEn: sanPham.noteEn ?? "",
          isExclusive: sanPham.isExclusive,
          isFeatured: sanPham.isFeatured,
          isNew: sanPham.isNew,
          isActive: sanPham.isActive,
          inStock: sanPham.inStock,
          sortOrder: sanPham.sortOrder,
          variants: sanPham.variants.map((b) => ({
            id: b.id,
            labelVi: b.labelVi,
            labelEn: b.labelEn,
            price: b.price,
            comparePrice: b.comparePrice,
            noteVi: b.noteVi ?? "",
            noteEn: b.noteEn ?? "",
            inStock: b.inStock,
          })),
          images: sanPham.images.map((a) => ({
            id: a.id,
            url: a.url,
            isMain: a.isMain,
          })),
        }}
      />
    </KhungQuanTri>
  );
}
