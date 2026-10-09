/**
 * ĐỔI THƯƠNG HIỆU TRONG CƠ SỞ DỮ LIỆU: Chourmas / Thạch Lan → Thach Lan
 * ----------------------------------------------------------------------
 * Tên thương hiệu viết KHÔNG DẤU: "Thach Lan" (chữ hoa: "THACH LAN").
 * Mô tả sản phẩm, danh mục, chữ thay thế của ảnh... nằm trong cơ sở dữ liệu,
 * không nằm trong code, nên sửa code không đổi được chúng. Script này sửa
 * thẳng trong cơ sở dữ liệu.
 *
 * Chạy:  npm run doi-thuong-hieu
 *
 * An toàn để chạy nhiều lần: lần sau không còn gì để đổi thì không làm gì.
 * Chỉ sửa đúng những câu nhắc tới Chourmas / Thạch Lan / "phân phối", không đụng nội
 * dung khác bạn đã tự sửa trong trang quản trị.
 */

import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./data/chourmas.db",
  }),
});

// Những câu cũ nói "Chourmas phân phối" → viết lại theo câu chuyện mới
const CAU_THAY: [string, string][] = [
  [
    "Mẫu hoa văn do Thạch Lan thiết kế riêng và Chourmas là đơn vị phân phối chính thức — bạn sẽ không tìm thấy bộ hoa văn này ở nơi nào khác.",
    "Mẫu hoa văn do Thạch Lan tự thiết kế và bán trực tiếp — bạn sẽ không tìm thấy bộ hoa văn này ở nơi nào khác.",
  ],
  [
    "The patterns are designed by Thach Lan, and Chourmas is the official distributor — you will not find this set anywhere else.",
    "The patterns are designed and sold directly by Thach Lan — you will not find this set anywhere else.",
  ],
  [
    "Khuôn lò xo nhấn tay, hoa văn độc quyền do Thạch Lan thiết kế, Chourmas phân phối chính thức.",
    "Khuôn lò xo nhấn tay, hoa văn độc quyền do Thạch Lan tự thiết kế và bán trực tiếp.",
  ],
  [
    "Hand-press spring molds carrying exclusive patterns designed by Thach Lan and distributed officially by Chourmas.",
    "Hand-press spring molds carrying exclusive patterns designed and sold directly by Thach Lan.",
  ],
  [
    "mang chính tên nhà thiết kế Thạch Lan",
    "mang chính tên thương hiệu Thạch Lan",
  ],
  ["carrying the name of designer Thach Lan", "carrying the Thach Lan name itself"],
  ["Bộ 5 mặt mang tên nhà thiết kế", "Bộ 5 mặt mang tên thương hiệu"],
  [
    "The five-face set that carries the designer's name",
    "The five-face set that carries our name",
  ],
];

function doiChu(giaTri: string | null, tiengViet: boolean): string | null {
  if (!giaTri) return giaTri;
  let s = giaTri.normalize("NFC");
  for (const [cu, moi] of CAU_THAY) s = s.split(cu).join(moi);
  // Còn sót chữ Chourmas ở chỗ khác thì đổi tên đơn thuần
  s = s.replace(/CHOURMAS/g, "THACH LAN").replace(/Chourmas/g, "Thach Lan");
  // Tên thương hiệu viết không dấu: Thạch Lan → Thach Lan (cả kiểu gõ dấu
  // tổ hợp, nên chuẩn hoá trước khi so)
  s = s
    .replace(/THẠCH LAN/g, "THACH LAN")
    .replace(/Thạch [Ll]an/g, "Thach Lan");
  void tiengViet;
  return s;
}

async function main() {
  let soDoi = 0;

  const sanPham = await prisma.product.findMany();
  for (const sp of sanPham) {
    const moi = {
      nameVi: doiChu(sp.nameVi, true)!,
      nameEn: doiChu(sp.nameEn, false)!,
      shortDescVi: doiChu(sp.shortDescVi, true),
      shortDescEn: doiChu(sp.shortDescEn, false),
      descVi: doiChu(sp.descVi, true),
      descEn: doiChu(sp.descEn, false),
      noteVi: doiChu(sp.noteVi, true),
      noteEn: doiChu(sp.noteEn, false),
      metaTitleVi: doiChu(sp.metaTitleVi, true),
      metaTitleEn: doiChu(sp.metaTitleEn, false),
      metaDescVi: doiChu(sp.metaDescVi, true),
      metaDescEn: doiChu(sp.metaDescEn, false),
    };
    const khac = (Object.keys(moi) as (keyof typeof moi)[]).some(
      (k) => moi[k] !== sp[k],
    );
    if (khac) {
      await prisma.product.update({ where: { id: sp.id }, data: moi });
      console.log(`  ✓ Sản phẩm: ${sp.nameVi}`);
      soDoi++;
    }
  }

  const danhMuc = await prisma.category.findMany();
  for (const dm of danhMuc) {
    const moi = {
      nameVi: doiChu(dm.nameVi, true)!,
      nameEn: doiChu(dm.nameEn, false)!,
      descVi: doiChu(dm.descVi, true),
      descEn: doiChu(dm.descEn, false),
    };
    const khac = (Object.keys(moi) as (keyof typeof moi)[]).some(
      (k) => moi[k] !== dm[k],
    );
    if (khac) {
      await prisma.category.update({ where: { id: dm.id }, data: moi });
      console.log(`  ✓ Danh mục: ${dm.nameVi}`);
      soDoi++;
    }
  }

  const anh = await prisma.productImage.findMany();
  for (const a of anh) {
    const altVi = doiChu(a.altVi, true);
    const altEn = doiChu(a.altEn, false);
    if (altVi !== a.altVi || altEn !== a.altEn) {
      await prisma.productImage.update({
        where: { id: a.id },
        data: { altVi, altEn },
      });
      soDoi++;
    }
  }

  const caiDat = await prisma.siteSetting.findMany();
  for (const c of caiDat) {
    const value = doiChu(c.value, true)!;
    if (value !== c.value) {
      await prisma.siteSetting.update({ where: { key: c.key }, data: { value } });
      console.log(`  ✓ Cài đặt: ${c.key}`);
      soDoi++;
    }
  }

  await prisma.adminUser.updateMany({
    where: { name: { in: ["Quản trị Chourmas", "Quản trị Thạch Lan"] } },
    data: { name: "Quản trị Thach Lan" },
  });

  console.log(
    soDoi
      ? `\n  Xong: đã cập nhật ${soDoi} mục sang tên Thach Lan.\n`
      : "\n  Không còn gì cần đổi trong cơ sở dữ liệu.\n",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
