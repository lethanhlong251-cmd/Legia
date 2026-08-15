"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { taoSlug } from "@/lib/dinh-dang";
import { batBuocDangNhap, taoPhienDangNhap, xoaPhienDangNhap } from "@/lib/xac-thuc";
import { taoAnhMo } from "@/lib/anh-mo";
import type { OrderStatus } from "@/generated/prisma/enums";

/**
 * CÁC HÀNH ĐỘNG CỦA TRANG QUẢN TRỊ
 * --------------------------------
 * Mỗi hàm đều gọi batBuocDangNhap() ở dòng đầu tiên. Bắt buộc phải vậy:
 * các hàm này có thể bị gọi thẳng từ bên ngoài, không chỉ từ giao diện.
 */

export type KetQua = { ok: boolean; loi?: string; thongBao?: string };

// =====================================================================
// ĐĂNG NHẬP
// =====================================================================

export async function dangNhap(
  _truocDo: KetQua | null,
  formData: FormData,
): Promise<KetQua> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { ok: false, loi: "Vui lòng nhập tài khoản và mật khẩu." };
  }

  const nguoiDung = await prisma.adminUser.findUnique({ where: { username } });

  // So sánh mật khẩu kể cả khi không tìm thấy tài khoản, để kẻ xấu không
  // đoán được tài khoản nào có thật qua thời gian phản hồi
  const hashGia = "$2a$12$" + "0".repeat(53);
  const dung = await bcrypt.compare(
    password,
    nguoiDung?.passwordHash ?? hashGia,
  );

  if (!nguoiDung || !dung) {
    return { ok: false, loi: "Tài khoản hoặc mật khẩu không đúng." };
  }

  await taoPhienDangNhap(nguoiDung.id, nguoiDung.name);
  redirect("/admin");
}

export async function dangXuat() {
  await xoaPhienDangNhap();
  redirect("/admin/dang-nhap");
}

export async function doiMatKhau(
  _truocDo: KetQua | null,
  formData: FormData,
): Promise<KetQua> {
  const nguoiDung = await batBuocDangNhap();

  const matKhauCu = String(formData.get("matKhauCu") ?? "");
  const matKhauMoi = String(formData.get("matKhauMoi") ?? "");
  const nhapLai = String(formData.get("nhapLai") ?? "");

  if (matKhauMoi.length < 8) {
    return { ok: false, loi: "Mật khẩu mới phải dài ít nhất 8 ký tự." };
  }
  if (matKhauMoi !== nhapLai) {
    return { ok: false, loi: "Hai lần nhập mật khẩu mới không khớp nhau." };
  }

  const taiKhoan = await prisma.adminUser.findUnique({
    where: { id: nguoiDung.id },
  });
  if (!taiKhoan || !(await bcrypt.compare(matKhauCu, taiKhoan.passwordHash))) {
    return { ok: false, loi: "Mật khẩu hiện tại không đúng." };
  }

  await prisma.adminUser.update({
    where: { id: nguoiDung.id },
    data: { passwordHash: await bcrypt.hash(matKhauMoi, 12) },
  });

  return { ok: true, thongBao: "Đã đổi mật khẩu." };
}

// =====================================================================
// ĐƠN HÀNG
// =====================================================================

const TRANG_THAI_HOP_LE = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
] as const;

export async function doiTrangThaiDon(
  idDon: string,
  trangThai: string,
): Promise<KetQua> {
  await batBuocDangNhap();

  if (!(TRANG_THAI_HOP_LE as readonly string[]).includes(trangThai)) {
    return { ok: false, loi: "Trạng thái không hợp lệ." };
  }

  await prisma.order.update({
    where: { id: idDon },
    data: { status: trangThai as OrderStatus },
  });

  revalidatePath("/admin/don-hang");
  revalidatePath(`/admin/don-hang/${idDon}`);
  revalidatePath("/admin");
  return { ok: true, thongBao: "Đã cập nhật trạng thái đơn." };
}

export async function luuGhiChuDon(
  idDon: string,
  ghiChu: string,
): Promise<KetQua> {
  await batBuocDangNhap();
  await prisma.order.update({
    where: { id: idDon },
    data: { adminNote: ghiChu.slice(0, 2000) || null },
  });
  revalidatePath(`/admin/don-hang/${idDon}`);
  return { ok: true, thongBao: "Đã lưu ghi chú." };
}

// =====================================================================
// SẢN PHẨM
// =====================================================================

const BienTheGui = z.object({
  id: z.string().optional(),
  labelVi: z.string().trim().min(1),
  labelEn: z.string().trim().optional(),
  price: z.number().int().min(0),
  comparePrice: z.number().int().min(0).nullable().optional(),
  noteVi: z.string().trim().optional(),
  noteEn: z.string().trim().optional(),
  inStock: z.boolean().default(true),
  isAccessory: z.boolean().default(false),
});

const SanPhamGui = z.object({
  id: z.string().optional(),
  sku: z.string().trim().min(1).max(60),
  slug: z.string().trim().max(120).optional(),
  nameVi: z.string().trim().min(1).max(200),
  nameEn: z.string().trim().max(200).optional(),
  shortDescVi: z.string().trim().max(400).optional(),
  shortDescEn: z.string().trim().max(400).optional(),
  descVi: z.string().trim().max(8000).optional(),
  descEn: z.string().trim().max(8000).optional(),
  categoryId: z.string().min(1),
  faceCount: z.number().int().min(0).max(50).nullable().optional(),
  diameter: z.string().trim().max(120).optional(),
  material: z.string().trim().max(200).optional(),
  patterns: z.string().trim().max(2000).optional(),
  noteVi: z.string().trim().max(2000).optional(),
  noteEn: z.string().trim().max(2000).optional(),
  isExclusive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
  inStock: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  variants: z.array(BienTheGui).min(1),
});

export async function luuSanPham(duLieuTho: unknown): Promise<KetQua> {
  await batBuocDangNhap();

  const phanTich = SanPhamGui.safeParse(duLieuTho);
  if (!phanTich.success) {
    const dauTien = phanTich.error.issues[0];
    return {
      ok: false,
      loi: `Dữ liệu chưa hợp lệ ở mục "${dauTien.path.join(".")}": ${dauTien.message}`,
    };
  }

  const d = phanTich.data;
  const slug = (d.slug?.trim() || taoSlug(d.nameVi)) || taoSlug(d.sku);

  // Kiểm tra trùng mã và đường dẫn với sản phẩm KHÁC
  const trung = await prisma.product.findFirst({
    where: {
      OR: [{ sku: d.sku }, { slug }],
      ...(d.id ? { NOT: { id: d.id } } : {}),
    },
    select: { sku: true, slug: true },
  });
  if (trung) {
    return {
      ok: false,
      loi:
        trung.sku === d.sku
          ? `Mã sản phẩm "${d.sku}" đã được dùng cho sản phẩm khác.`
          : `Đường dẫn "${slug}" đã được dùng. Hãy đổi tên hoặc nhập đường dẫn khác.`,
    };
  }

  const truong = {
    sku: d.sku,
    slug,
    nameVi: d.nameVi,
    nameEn: d.nameEn?.trim() || d.nameVi,
    shortDescVi: d.shortDescVi || null,
    shortDescEn: d.shortDescEn || null,
    descVi: d.descVi || null,
    descEn: d.descEn || null,
    categoryId: d.categoryId,
    faceCount: d.faceCount ?? null,
    diameter: d.diameter || null,
    material: d.material || null,
    patterns: d.patterns || null,
    noteVi: d.noteVi || null,
    noteEn: d.noteEn || null,
    isExclusive: d.isExclusive,
    isFeatured: d.isFeatured,
    isNew: d.isNew,
    isActive: d.isActive,
    inStock: d.inStock,
    sortOrder: d.sortOrder,
  };

  const sanPham = d.id
    ? await prisma.product.update({ where: { id: d.id }, data: truong })
    : await prisma.product.create({ data: truong });

  // Đồng bộ biến thể: xoá những cái đã bị bỏ, cập nhật/ thêm phần còn lại
  const idGiuLai = d.variants.map((b) => b.id).filter(Boolean) as string[];
  await prisma.productVariant.deleteMany({
    where: { productId: sanPham.id, id: { notIn: idGiuLai } },
  });

  for (let i = 0; i < d.variants.length; i++) {
    const b = d.variants[i];
    const duLieuBienThe = {
      productId: sanPham.id,
      labelVi: b.labelVi,
      labelEn: b.labelEn?.trim() || b.labelVi,
      price: b.price,
      comparePrice: b.comparePrice ?? null,
      noteVi: b.noteVi || null,
      noteEn: b.noteEn || null,
      inStock: b.inStock,
      isAccessory: b.isAccessory,
      sortOrder: i + 1,
    };
    if (b.id) {
      await prisma.productVariant.update({
        where: { id: b.id },
        data: duLieuBienThe,
      });
    } else {
      await prisma.productVariant.create({ data: duLieuBienThe });
    }
  }

  revalidatePath("/", "layout");
  return { ok: true, thongBao: "Đã lưu sản phẩm." };
}

export async function batTatSanPham(id: string, hien: boolean): Promise<KetQua> {
  await batBuocDangNhap();
  await prisma.product.update({ where: { id }, data: { isActive: hien } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function batTatConHang(id: string, con: boolean): Promise<KetQua> {
  await batBuocDangNhap();
  await prisma.product.update({ where: { id }, data: { inStock: con } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function batTatNoiBat(id: string, noiBat: boolean): Promise<KetQua> {
  await batBuocDangNhap();
  await prisma.product.update({ where: { id }, data: { isFeatured: noiBat } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function xoaSanPham(id: string): Promise<KetQua> {
  await batBuocDangNhap();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true, thongBao: "Đã xoá sản phẩm." };
}

// =====================================================================
// ẢNH SẢN PHẨM
// =====================================================================

const DINH_DANG_CHO_PHEP = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const DUNG_LUONG_TOI_DA = 12 * 1024 * 1024; // 12 MB

export async function taiAnhLen(formData: FormData): Promise<KetQua> {
  await batBuocDangNhap();

  const idSanPham = String(formData.get("productId") ?? "");
  const cacFile = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (!idSanPham) return { ok: false, loi: "Thiếu sản phẩm." };
  if (cacFile.length === 0) return { ok: false, loi: "Bạn chưa chọn ảnh nào." };

  const sanPham = await prisma.product.findUnique({
    where: { id: idSanPham },
    include: { images: true },
  });
  if (!sanPham) return { ok: false, loi: "Không tìm thấy sản phẩm." };

  const thuMuc = path.join(process.cwd(), "public", "uploads");
  await mkdir(thuMuc, { recursive: true });

  let soThuTu = sanPham.images.length;

  for (const file of cacFile) {
    if (!DINH_DANG_CHO_PHEP.includes(file.type)) {
      return {
        ok: false,
        loi: `File "${file.name}" không phải ảnh JPG, PNG, WebP hoặc AVIF.`,
      };
    }
    if (file.size > DUNG_LUONG_TOI_DA) {
      return { ok: false, loi: `Ảnh "${file.name}" nặng quá 12MB.` };
    }

    const goc = Buffer.from(await file.arrayBuffer());

    // Chuẩn hoá giống hệt script xử lý ảnh: vuông 1400px, nền mờ, WebP
    const KICH_THUOC = 1400;
    const nen = await sharp(goc, { failOn: "none" })
      .resize(KICH_THUOC, KICH_THUOC, { fit: "cover" })
      .blur(45)
      .modulate({ brightness: 1.06, saturation: 0.55 })
      .toBuffer();
    const anhChinh = await sharp(goc, { failOn: "none" })
      .resize(KICH_THUOC, KICH_THUOC, { fit: "inside" })
      .toBuffer();
    const ketQua = await sharp(nen)
      .composite([{ input: anhChinh, gravity: "center" }])
      .webp({ quality: 82 })
      .toBuffer();

    const tenFile = `${sanPham.slug}-${randomUUID().slice(0, 8)}.webp`;
    await writeFile(path.join(thuMuc, tenFile), ketQua);

    // Bản xem trước tí hon để khách không phải nhìn ô trống lúc ảnh đang tải
    const anhMo = await taoAnhMo(ketQua);

    soThuTu++;
    await prisma.productImage.create({
      data: {
        productId: sanPham.id,
        url: `/uploads/${tenFile}`,
        blurData: anhMo,
        altVi: `${sanPham.nameVi} — ảnh ${soThuTu}`,
        altEn: `${sanPham.nameEn} — photo ${soThuTu}`,
        isMain: sanPham.images.length === 0 && soThuTu === 1,
        sortOrder: soThuTu,
      },
    });
  }

  revalidatePath("/", "layout");
  return { ok: true, thongBao: `Đã tải lên ${cacFile.length} ảnh.` };
}

export async function xoaAnh(idAnh: string): Promise<KetQua> {
  await batBuocDangNhap();
  const anh = await prisma.productImage.delete({ where: { id: idAnh } });

  // Ảnh đại diện vừa bị xoá thì cho ảnh còn lại đầu tiên lên thay
  if (anh.isMain) {
    const conLai = await prisma.productImage.findFirst({
      where: { productId: anh.productId },
      orderBy: { sortOrder: "asc" },
    });
    if (conLai) {
      await prisma.productImage.update({
        where: { id: conLai.id },
        data: { isMain: true },
      });
    }
  }

  revalidatePath("/", "layout");
  return { ok: true, thongBao: "Đã xoá ảnh." };
}

export async function datAnhDaiDien(idAnh: string): Promise<KetQua> {
  await batBuocDangNhap();
  const anh = await prisma.productImage.findUnique({ where: { id: idAnh } });
  if (!anh) return { ok: false, loi: "Không tìm thấy ảnh." };

  await prisma.productImage.updateMany({
    where: { productId: anh.productId },
    data: { isMain: false },
  });
  await prisma.productImage.update({
    where: { id: idAnh },
    data: { isMain: true },
  });

  revalidatePath("/", "layout");
  return { ok: true, thongBao: "Đã đặt làm ảnh đại diện." };
}

// =====================================================================
// DANH MỤC
// =====================================================================

export async function luuDanhMuc(formData: FormData): Promise<KetQua> {
  await batBuocDangNhap();

  const id = String(formData.get("id") ?? "");
  const nameVi = String(formData.get("nameVi") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const parentId = String(formData.get("parentId") ?? "").trim();
  const isActive = formData.get("isActive") === "on";
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  if (!nameVi) return { ok: false, loi: "Chưa nhập tên danh mục." };

  const slug = String(formData.get("slug") ?? "").trim() || taoSlug(nameVi);
  const truong = {
    nameVi,
    nameEn: nameEn || nameVi,
    slug,
    parentId: parentId || null,
    isActive,
    sortOrder,
  };

  const trung = await prisma.category.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
  });
  if (trung) {
    return { ok: false, loi: `Đường dẫn "${slug}" đã được dùng.` };
  }

  if (id) {
    if (parentId === id) {
      return { ok: false, loi: "Danh mục không thể là cha của chính nó." };
    }
    await prisma.category.update({ where: { id }, data: truong });
  } else {
    await prisma.category.create({ data: truong });
  }

  revalidatePath("/", "layout");
  return { ok: true, thongBao: "Đã lưu danh mục." };
}

export async function xoaDanhMuc(id: string): Promise<KetQua> {
  await batBuocDangNhap();

  const soSanPham = await prisma.product.count({ where: { categoryId: id } });
  if (soSanPham > 0) {
    return {
      ok: false,
      loi: `Danh mục này còn ${soSanPham} sản phẩm. Hãy chuyển chúng sang danh mục khác trước khi xoá.`,
    };
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true, thongBao: "Đã xoá danh mục." };
}

// =====================================================================
// CÀI ĐẶT WEBSITE
// =====================================================================

export async function luuCaiDat(formData: FormData): Promise<KetQua> {
  await batBuocDangNhap();

  const cacKhoa = [
    "hotline",
    "zalo",
    "facebook",
    "email",
    "diaChi",
    "gioLamViec",
    "hienGiaGach",
  ];

  for (const khoa of cacKhoa) {
    const giaTri =
      khoa === "hienGiaGach"
        ? formData.get(khoa) === "on"
          ? "true"
          : "false"
        : String(formData.get(khoa) ?? "").trim();

    await prisma.siteSetting.upsert({
      where: { key: khoa },
      update: { value: giaTri },
      create: { key: khoa, value: giaTri },
    });
  }

  revalidatePath("/", "layout");
  return { ok: true, thongBao: "Đã lưu cài đặt." };
}
