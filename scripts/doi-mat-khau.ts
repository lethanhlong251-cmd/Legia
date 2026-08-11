/**
 * ĐỔI MẬT KHẨU QUẢN TRỊ
 * ---------------------
 * Dùng khi quên mật khẩu vào trang /admin.
 *
 * Chạy:  npm run doi-mat-khau
 *   hoặc: npm run doi-mat-khau -- "MatKhauMoiCuaBan"
 *
 * Không truyền mật khẩu thì hệ thống tự sinh một mật khẩu mạnh và in ra.
 */

import "dotenv/config";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./data/chourmas.db",
  }),
});

async function main() {
  const matKhauNhap = process.argv[2];

  if (matKhauNhap && matKhauNhap.length < 8) {
    console.error("Mật khẩu phải dài ít nhất 8 ký tự.");
    process.exit(1);
  }

  const matKhau = matKhauNhap || randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(matKhau, 12);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: { passwordHash },
    create: { username: "admin", passwordHash, name: "Quản trị Chourmas" },
  });

  console.log("\n  Đã đổi mật khẩu quản trị.");
  console.log("  Tài khoản: admin");
  console.log(`  Mật khẩu : ${matKhau}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
