/**
 * NẠP DỮ LIỆU BAN ĐẦU
 * -------------------
 * Chạy:  npm run nap-du-lieu
 *
 * Lệnh này an toàn khi chạy lại nhiều lần: sản phẩm đã có sẽ được cập nhật
 * chứ không bị nhân đôi. Tuy nhiên nó GHI ĐÈ những gì bạn đã sửa trong admin,
 * nên chỉ chạy khi thật sự cần khôi phục dữ liệu gốc.
 */

import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { SAN_PHAM } from "./du-lieu-san-pham.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./data/chourmas.db",
  }),
});

/** Danh mục — dựng sẵn cây đa ngành để sau này bán thêm mặt hàng khác */
const DANH_MUC = [
  {
    slug: "khuon-banh",
    nameVi: "Khuôn bánh",
    nameEn: "Cake molds",
    sortOrder: 1,
    isActive: true,
    con: [
      {
        slug: "khuon-banh-trung-thu",
        nameVi: "Khuôn bánh trung thu",
        nameEn: "Mooncake molds",
        descVi:
          "Khuôn lò xo nhấn tay, hoa văn độc quyền do Thạch Lan thiết kế, Chourmas phân phối chính thức.",
        descEn:
          "Hand-press spring molds carrying exclusive patterns designed by Thach Lan and distributed officially by Chourmas.",
        sortOrder: 1,
        isActive: true,
      },
      {
        slug: "khuon-banh-in",
        nameVi: "Khuôn bánh in",
        nameEn: "Pressed cake molds",
        sortOrder: 2,
        isActive: false,
      },
    ],
  },
  {
    slug: "nguyen-lieu",
    nameVi: "Nguyên liệu làm bánh",
    nameEn: "Baking ingredients",
    sortOrder: 2,
    isActive: false, // Bật lên trong admin khi đã có sản phẩm
    con: [],
  },
  {
    slug: "dung-cu",
    nameVi: "Dụng cụ làm bánh",
    nameEn: "Baking tools",
    sortOrder: 3,
    isActive: false,
    con: [],
  },
];

/** Cài đặt website — sửa được trong /admin → Cài đặt */
const CAI_DAT: Record<string, string> = {
  hotline: "0377497286",
  zalo: "0377497286",
  facebook: "https://www.facebook.com/Khuonbanhredep",
  email: "",
  diaChi: "Bán hàng online, giao toàn quốc",
  gioLamViec: "Nhận đơn 24/7",
  mienPhiVanChuyen: "true",
  hienGiaGach: "true",
};

async function main() {
  console.log("Bắt đầu nạp dữ liệu…\n");

  // ---------- 1. Danh mục ----------
  const banDoDanhMuc = new Map<string, string>();

  for (const dm of DANH_MUC) {
    const cha = await prisma.category.upsert({
      where: { slug: dm.slug },
      update: {
        nameVi: dm.nameVi,
        nameEn: dm.nameEn,
        sortOrder: dm.sortOrder,
        isActive: dm.isActive,
      },
      create: {
        slug: dm.slug,
        nameVi: dm.nameVi,
        nameEn: dm.nameEn,
        sortOrder: dm.sortOrder,
        isActive: dm.isActive,
      },
    });
    banDoDanhMuc.set(dm.slug, cha.id);

    for (const c of dm.con) {
      const con = await prisma.category.upsert({
        where: { slug: c.slug },
        update: {
          nameVi: c.nameVi,
          nameEn: c.nameEn,
          descVi: "descVi" in c ? c.descVi : undefined,
          descEn: "descEn" in c ? c.descEn : undefined,
          parentId: cha.id,
          sortOrder: c.sortOrder,
          isActive: c.isActive,
        },
        create: {
          slug: c.slug,
          nameVi: c.nameVi,
          nameEn: c.nameEn,
          descVi: "descVi" in c ? c.descVi : undefined,
          descEn: "descEn" in c ? c.descEn : undefined,
          parentId: cha.id,
          sortOrder: c.sortOrder,
          isActive: c.isActive,
        },
      });
      banDoDanhMuc.set(c.slug, con.id);
    }
  }
  console.log(`  ✓ ${banDoDanhMuc.size} danh mục`);

  // ---------- 2. Ảnh đã xử lý ----------
  let banDoAnh: Record<
    string,
    { url: string; isMain: boolean; anhMo?: string }[]
  > = {};
  try {
    banDoAnh = JSON.parse(
      await readFile(path.join(__dirname, "../scripts/anh-da-xu-ly.json"), "utf8"),
    );
  } catch {
    console.warn(
      "  ⚠ Chưa có scripts/anh-da-xu-ly.json — hãy chạy `npm run anh` trước để có ảnh.",
    );
  }

  // ---------- 3. Sản phẩm ----------
  const idDanhMucTrungThu = banDoDanhMuc.get("khuon-banh-trung-thu")!;
  let soBienThe = 0;
  let soAnh = 0;

  for (let i = 0; i < SAN_PHAM.length; i++) {
    const sp = SAN_PHAM[i];

    const duLieu = {
      slug: sp.slug,
      nameVi: sp.nameVi,
      nameEn: sp.nameEn,
      shortDescVi: sp.shortDescVi,
      shortDescEn: sp.shortDescEn,
      descVi: sp.descVi,
      descEn: sp.descEn,
      categoryId: idDanhMucTrungThu,
      faceCount: sp.faceCount ?? null,
      diameter: sp.diameter ?? null,
      noteVi: sp.noteVi ?? null,
      noteEn: sp.noteEn ?? null,
      isExclusive: true,
      isFeatured: sp.isFeatured ?? false,
      isActive: true,
      inStock: sp.inStock ?? true,
      sortOrder: i + 1,
    };

    const sanPham = await prisma.product.upsert({
      where: { sku: sp.sku },
      update: duLieu,
      create: { sku: sp.sku, ...duLieu },
    });

    // Biến thể: xoá hết rồi tạo lại để khớp đúng file dữ liệu
    await prisma.productVariant.deleteMany({ where: { productId: sanPham.id } });
    for (let v = 0; v < sp.variants.length; v++) {
      const bt = sp.variants[v];
      await prisma.productVariant.create({
        data: {
          productId: sanPham.id,
          labelVi: bt.labelVi,
          labelEn: bt.labelEn,
          price: bt.price,
          comparePrice: bt.comparePrice ?? null,
          noteVi: bt.noteVi ?? null,
          noteEn: bt.noteEn ?? null,
          isAccessory: bt.laMonMuaLe ?? false,
          sortOrder: v + 1,
        },
      });
      soBienThe++;
    }

    // Ảnh
    const anh = banDoAnh[sp.slug] ?? [];
    await prisma.productImage.deleteMany({ where: { productId: sanPham.id } });
    for (let a = 0; a < anh.length; a++) {
      await prisma.productImage.create({
        data: {
          productId: sanPham.id,
          url: anh[a].url,
          blurData: anh[a].anhMo ?? null,
          altVi: `${sp.nameVi} — ảnh ${a + 1}`,
          altEn: `${sp.nameEn} — photo ${a + 1}`,
          isMain: anh[a].isMain,
          sortOrder: a + 1,
        },
      });
      soAnh++;
    }
  }
  console.log(
    `  ✓ ${SAN_PHAM.length} sản phẩm, ${soBienThe} biến thể giá, ${soAnh} ảnh`,
  );

  // ---------- 4. Cài đặt website ----------
  for (const [key, value] of Object.entries(CAI_DAT)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {}, // không ghi đè nếu bạn đã sửa trong admin
      create: { key, value },
    });
  }
  console.log(`  ✓ ${Object.keys(CAI_DAT).length} mục cài đặt`);

  // ---------- 5. Tài khoản quản trị ----------
  const daCo = await prisma.adminUser.findUnique({ where: { username: "admin" } });
  if (daCo) {
    console.log("  ✓ Tài khoản quản trị đã có sẵn, giữ nguyên mật khẩu cũ");
  } else {
    const matKhau = randomBytes(9).toString("base64url");
    await prisma.adminUser.create({
      data: {
        username: "admin",
        passwordHash: await bcrypt.hash(matKhau, 12),
        name: "Quản trị Chourmas",
      },
    });
    console.log("\n  ╔══════════════════════════════════════════════╗");
    console.log("  ║  TÀI KHOẢN QUẢN TRỊ ĐÃ ĐƯỢC TẠO              ║");
    console.log("  ╠══════════════════════════════════════════════╣");
    console.log("  ║  Địa chỉ  : /admin                           ║");
    console.log("  ║  Tài khoản: admin                            ║");
    console.log(`  ║  Mật khẩu : ${matKhau.padEnd(33)}║`);
    console.log("  ╚══════════════════════════════════════════════╝");
    console.log("  ⚠ HÃY LƯU MẬT KHẨU NÀY LẠI NGAY. Nó chỉ hiện một lần.");
    console.log("    Quên mật khẩu thì chạy: npm run doi-mat-khau\n");
  }

  console.log("\nNạp dữ liệu xong.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
