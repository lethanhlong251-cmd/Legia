import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Kết nối tới cơ sở dữ liệu.
 *
 * Next.js khi chạy ở chế độ phát triển sẽ nạp lại code liên tục. Nếu mỗi lần
 * nạp lại đều tạo một kết nối mới thì sẽ cạn kết nối, nên ta lưu lại vào
 * globalThis để dùng lại.
 */

const taoClient = () =>
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? "file:./data/chourmas.db",
    }),
  });

const bienToanCuc = globalThis as unknown as {
  prisma?: ReturnType<typeof taoClient>;
};

export const prisma = bienToanCuc.prisma ?? taoClient();

if (process.env.NODE_ENV !== "production") bienToanCuc.prisma = prisma;
