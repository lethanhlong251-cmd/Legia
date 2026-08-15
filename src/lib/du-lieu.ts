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

export type BoLoc = {
  /** Số mặt hoa văn: 2, 3, 4, 5, 7… */
  soMat?: number;
  /** Cỡ khuôn theo gam: "75g", "150g", "200g", "300g" */
  co?: string;
  /** Cách sắp xếp */
  sapXep?: "mac-dinh" | "gia-tang" | "gia-giam";
  slugDanhMuc?: string;
};

/** Danh sách sản phẩm đang bán, kèm lọc và sắp xếp */
export async function laySanPham(loc: BoLoc = {}) {
  const danhSach = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(loc.slugDanhMuc ? { category: { slug: loc.slugDanhMuc } } : {}),
      ...(loc.soMat ? { faceCount: loc.soMat } : {}),
      // Cỡ nằm trong tên biến thể, ví dụ "Cỡ 150g" hay "Bộ đầy đủ — cỡ 300g"
      ...(loc.co ? { variants: { some: { labelVi: { contains: loc.co } } } } : {}),
    },
    include: KEM_ANH_VA_GIA,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  if (loc.sapXep === "gia-tang" || loc.sapXep === "gia-giam") {
    // Sắp xếp theo đúng giá đang hiện trên thẻ sản phẩm, tức là bỏ qua
    // các món mua lẻ, để thứ tự khớp với con số khách nhìn thấy
    const giaThapNhat = (sp: (typeof danhSach)[number]) => {
      const chinh = sp.variants.filter((b) => !b.isAccessory);
      const dung = chinh.length > 0 ? chinh : sp.variants;
      return dung.length ? Math.min(...dung.map((b) => b.price)) : 0;
    };

    danhSach.sort((a, b) =>
      loc.sapXep === "gia-tang"
        ? giaThapNhat(a) - giaThapNhat(b)
        : giaThapNhat(b) - giaThapNhat(a),
    );
  }

  return danhSach;
}

/**
 * Đếm số sản phẩm cho từng lựa chọn lọc, để hiện số ngay trên nút.
 * Khách thấy trước là bấm vào có bao nhiêu mẫu, đỡ bấm vào chỗ trống.
 */
export async function demTheoBoLoc() {
  const tatCa = await prisma.product.findMany({
    where: { isActive: true },
    select: { faceCount: true, variants: { select: { labelVi: true } } },
  });

  const theoSoMat = new Map<number, number>();
  const theoCo = new Map<string, number>();
  const CAC_CO = ["75g", "150g", "200g", "300g"];

  for (const sp of tatCa) {
    if (sp.faceCount) {
      theoSoMat.set(sp.faceCount, (theoSoMat.get(sp.faceCount) ?? 0) + 1);
    }
    for (const co of CAC_CO) {
      if (sp.variants.some((b) => b.labelVi.includes(co))) {
        theoCo.set(co, (theoCo.get(co) ?? 0) + 1);
      }
    }
  }

  return {
    tong: tatCa.length,
    soMat: [...theoSoMat.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([giaTri, soLuong]) => ({ giaTri, soLuong })),
    co: CAC_CO.filter((c) => theoCo.has(c)).map((giaTri) => ({
      giaTri,
      soLuong: theoCo.get(giaTri)!,
    })),
  };
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
