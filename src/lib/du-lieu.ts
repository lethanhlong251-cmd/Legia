import "server-only";
import { prisma } from "./prisma";

/**
 * Các truy vấn dữ liệu dùng chung cho phần website khách xem.
 * Gom vào một chỗ để sau này muốn đổi cách lấy dữ liệu chỉ sửa ở đây.
 */

const KEM_ANH_VA_GIA = {
  images: { orderBy: { sortOrder: "asc" } },
  variants: { orderBy: { sortOrder: "asc" } },
  category: true,
} as const;

/** Danh sách sản phẩm đang bán, có thể lọc theo danh mục */
export async function laySanPham(slugDanhMuc?: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(slugDanhMuc ? { category: { slug: slugDanhMuc } } : {}),
    },
    include: KEM_ANH_VA_GIA,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

/** Sản phẩm nổi bật hiện ở trang chủ */
export async function laySanPhamNoiBat(soLuong = 6) {
  const noiBat = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: KEM_ANH_VA_GIA,
    orderBy: { sortOrder: "asc" },
    take: soLuong,
  });

  // Chưa đánh dấu đủ sản phẩm nổi bật thì lấy thêm cho đầy hàng
  if (noiBat.length >= soLuong) return noiBat;

  const themVao = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: false,
      id: { notIn: noiBat.map((s) => s.id) },
    },
    include: KEM_ANH_VA_GIA,
    orderBy: { sortOrder: "asc" },
    take: soLuong - noiBat.length,
  });

  return [...noiBat, ...themVao];
}

/** Một sản phẩm theo đường dẫn */
export async function laySanPhamTheoSlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: KEM_ANH_VA_GIA,
  });
}

/** Vài sản phẩm khác để gợi ý ở cuối trang chi tiết */
export async function laySanPhamLienQuan(idHienTai: string, soLuong = 4) {
  return prisma.product.findMany({
    where: { isActive: true, id: { not: idHienTai } },
    include: KEM_ANH_VA_GIA,
    orderBy: { sortOrder: "asc" },
    take: soLuong,
  });
}

/** Danh mục đang bật, kèm số sản phẩm để hiện trên thanh lọc */
export async function layDanhMuc() {
  return prisma.category.findMany({
    where: { isActive: true, products: { some: { isActive: true } } },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
    orderBy: { sortOrder: "asc" },
  });
}

/** Thông tin liên hệ và cấu hình chung, đọc từ bảng Cài đặt */
export async function layCaiDat() {
  const cacMuc = await prisma.siteSetting.findMany();
  const caiDat = Object.fromEntries(cacMuc.map((m) => [m.key, m.value]));

  return {
    hotline: caiDat.hotline || "0377497286",
    zalo: caiDat.zalo || caiDat.hotline || "0377497286",
    facebook: caiDat.facebook || "https://www.facebook.com/Khuonbanhredep",
    email: caiDat.email || "",
    diaChi: caiDat.diaChi || "Bán hàng online, giao toàn quốc",
    gioLamViec: caiDat.gioLamViec || "Nhận đơn 24/7",
    hienGiaGach: caiDat.hienGiaGach !== "false",
  };
}

export type CaiDat = Awaited<ReturnType<typeof layCaiDat>>;
export type SanPhamDayDu = Awaited<ReturnType<typeof laySanPhamTheoSlug>>;
export type SanPhamTrongDanhSach = Awaited<ReturnType<typeof laySanPham>>[number];
