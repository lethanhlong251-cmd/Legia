import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { laySanPhamTheoSlug } from "@/lib/du-lieu";
import { ANH_CHIA_SE } from "@/lib/chia-se";

/**
 * ẢNH CHIA SẺ CỦA TỪNG SẢN PHẨM, DẠNG JPG
 * ---------------------------------------
 * Đường dẫn: /anh-chia-se/san-pham/<slug>.jpg
 *
 * Ảnh sản phẩm trên web lưu dạng .webp cho nhẹ, nhưng Zalo đôi khi không
 * hiện ảnh xem trước nếu ảnh là .webp. Đường dẫn này lấy ảnh chính của sản
 * phẩm, đổi sang .jpg 1200×1200 rồi trả về. Ảnh mới tải lên từ trang quản trị
 * cũng tự có bản .jpg, không cần làm gì thêm.
 *
 * Kết quả được giữ trong bộ nhớ, nên mỗi ảnh chỉ phải chuyển đổi một lần.
 */

const THU_MUC_PUBLIC = path.join(process.cwd(), "public");
const boNho = new Map<string, Buffer>();
const TOI_DA_TRONG_BO_NHO = 200;

export async function GET(
  _request: Request,
  ctx: RouteContext<"/anh-chia-se/san-pham/[tep]">,
) {
  const { tep } = await ctx.params;
  const slug = tep.replace(/\.jpe?g$/i, "");
  // Không có ảnh thì trả thẳng ảnh chia sẻ chung của shop. Không dùng
  // chuyển hướng: website chạy sau nginx, địa chỉ tự tính ra sẽ là địa chỉ
  // nội bộ (localhost:3000) mà khách không mở được.
  const veAnhChung = async () => {
    try {
      const anhChung = await readFile(path.join(THU_MUC_PUBLIC, ANH_CHIA_SE));
      return new Response(new Uint8Array(anhChung), {
        headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=3600" },
      });
    } catch {
      return new Response("Không tìm thấy ảnh", { status: 404 });
    }
  };

  const sanPham = await laySanPhamTheoSlug(slug);
  const anh = sanPham?.images.find((a) => a.isMain) ?? sanPham?.images[0];
  if (!anh) return veAnhChung();

  let jpg = boNho.get(anh.url);
  if (!jpg) {
    // Chỉ đọc file nằm trong thư mục public, không cho thoát ra ngoài
    const duongDanFile = path.join(THU_MUC_PUBLIC, path.normalize(anh.url));
    if (!duongDanFile.startsWith(THU_MUC_PUBLIC + path.sep)) return veAnhChung();

    try {
      jpg = await sharp(await readFile(duongDanFile))
        .resize(1200, 1200, { fit: "cover" })
        .flatten({ background: "#FAF6EF" })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
    } catch {
      return veAnhChung();
    }

    if (boNho.size >= TOI_DA_TRONG_BO_NHO) boNho.clear();
    boNho.set(anh.url, jpg);
  }

  return new Response(new Uint8Array(jpg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
