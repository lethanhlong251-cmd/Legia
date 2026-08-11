/**
 * XỬ LÝ ẢNH SẢN PHẨM
 * ------------------
 * Đọc ảnh gốc trong "../Ảnh sản phẩm", chuẩn hoá thành ảnh vuông 1:1
 * định dạng WebP, đặt tên theo slug sản phẩm, lưu vào public/images/products.
 *
 * Ảnh KHÔNG bị cắt. Phần thiếu để thành hình vuông được lấp bằng chính
 * ảnh đó phóng to + làm mờ, nên không mất chi tiết nào.
 *
 * Chạy:  npm run anh
 */

import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THU_MUC_GOC = path.resolve(__dirname, "../../Ảnh sản phẩm");
const THU_MUC_DICH = path.resolve(__dirname, "../public/images/products");

const KICH_THUOC = 1400; // cạnh ảnh vuông xuất ra
const CHAT_LUONG = 82; // 1-100, càng cao càng nét và càng nặng

/**
 * Bản đồ: slug sản phẩm  ->  danh sách tên file ảnh gốc
 * Ảnh ĐẦU TIÊN trong mảng sẽ là ảnh đại diện của sản phẩm.
 *
 * Muốn thêm ảnh cho sản phẩm nào: bỏ file vào "Ảnh sản phẩm",
 * thêm tên file vào mảng tương ứng bên dưới, rồi chạy lại `npm run anh`.
 */
export const BAN_DO_ANH = {
  "sen-tu-quy": ["LX 001:4.jpg"],
  "lx-002-4": [
    "LX 002:4.jpg",
    "LX 002 4.jpg",
    "LX 002:4 1.jpg",
    "LX 002:4 2.jpg",
    "LX 002:4 3.jpg",
  ],
  "ca-doi-vuong": [
    "LX 003:4.jpg",
    "LX 003:4 1.jpg",
    "LX 003:4 2.jpg",
    "LX003:4 3.jpg",
    "LX 003:4 4.jpg",
  ],
  "heo-cute": ["LX 04:2.jpg"],
  "vuong-sen": ["LX 05:5 1.jpg", "LX 05:5 .jpg", "LX 05:5 2.jpg"],
  "mau-don-sen-cuc": ["LX 06:3 1.jpg", "LX 06:3 3 mặt 300g .jpg"],
  "lx-007-4": ["LX007:4.jpg"],
  "thach-lan": ["LX 08:5.jpg"],
  "lx-009-5": ["LX 09:5.jpg"],
  "bo-than-tai": ["LX 10:4.jpg"],
  "lx-011-7": ["LX 11:7.jpg"],
  "bo-ngu-hoa": ["LX12 05.jpg"],
  "pho-viet-nam": ["Phở Việt Nam .jpg"],
};

/** Ảnh chưa xác định thuộc sản phẩm nào — xuất vào thư mục riêng để dùng sau */
const ANH_CHUA_PHAN_LOAI = "chua-phan-loai";

async function taoAnhVuong(duongDanGoc, duongDanDich) {
  const anh = sharp(duongDanGoc, { failOn: "none" });
  const { width, height } = await anh.metadata();

  // Ảnh đã vuông sẵn -> chỉ resize, không cần đệm nền
  const tiLe = width / height;
  const daVuong = Math.abs(tiLe - 1) < 0.02;

  if (daVuong) {
    await sharp(duongDanGoc, { failOn: "none" })
      .resize(KICH_THUOC, KICH_THUOC, { fit: "cover" })
      .webp({ quality: CHAT_LUONG })
      .toFile(duongDanDich);
    return { width, height, daVuong: true };
  }

  // Nền: chính ảnh đó phủ kín khung vuông rồi làm mờ mạnh
  const nen = await sharp(duongDanGoc, { failOn: "none" })
    .resize(KICH_THUOC, KICH_THUOC, { fit: "cover" })
    .blur(45)
    .modulate({ brightness: 1.06, saturation: 0.55 })
    .toBuffer();

  // Ảnh chính: thu vừa khung, giữ trọn vẹn không cắt
  const anhChinh = await sharp(duongDanGoc, { failOn: "none" })
    .resize(KICH_THUOC, KICH_THUOC, { fit: "inside", withoutEnlargement: false })
    .toBuffer();

  await sharp(nen)
    .composite([{ input: anhChinh, gravity: "center" }])
    .webp({ quality: CHAT_LUONG })
    .toFile(duongDanDich);

  return { width, height, daVuong: false };
}

async function main() {
  await mkdir(THU_MUC_DICH, { recursive: true });
  await mkdir(path.join(THU_MUC_DICH, ANH_CHUA_PHAN_LOAI), { recursive: true });

  const tatCaFile = (await readdir(THU_MUC_GOC)).filter((f) =>
    /\.(jpe?g|png|webp)$/i.test(f),
  );

  // macOS lưu tên file có dấu ở dạng Unicode NFD, chuỗi trong code là NFC.
  // Lập bảng tra theo dạng đã chuẩn hoá để so khớp không bị lệch.
  const traTenFile = new Map(tatCaFile.map((f) => [f.normalize("NFC"), f]));

  const daDung = new Set();
  const ketQua = {};

  for (const [slug, danhSachFile] of Object.entries(BAN_DO_ANH)) {
    ketQua[slug] = [];

    for (let i = 0; i < danhSachFile.length; i++) {
      const tenFile = traTenFile.get(danhSachFile[i].normalize("NFC"));

      if (!tenFile) {
        console.warn(
          `  ⚠  Không tìm thấy ảnh: ${danhSachFile[i]}  (sản phẩm ${slug})`,
        );
        continue;
      }
      const duongDanGoc = path.join(THU_MUC_GOC, tenFile);
      daDung.add(tenFile);

      const tenDich = `${slug}-${i + 1}.webp`;
      const duongDanDich = path.join(THU_MUC_DICH, tenDich);
      const info = await taoAnhVuong(duongDanGoc, duongDanDich);

      ketQua[slug].push({ url: `/images/products/${tenDich}`, isMain: i === 0 });
      console.log(
        `  ✓ ${tenDich}  ←  ${tenFile}  (${info.width}×${info.height}${info.daVuong ? "" : " → đệm nền mờ"})`,
      );
    }
  }

  // Ảnh còn thừa
  const conThua = tatCaFile.filter((f) => !daDung.has(f));
  for (const tenFile of conThua) {
    const tenDich = `${ANH_CHUA_PHAN_LOAI}/${tenFile.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}.webp`;
    await taoAnhVuong(
      path.join(THU_MUC_GOC, tenFile),
      path.join(THU_MUC_DICH, tenDich),
    );
    console.log(`  • (chưa phân loại) ${tenDich}  ←  ${tenFile}`);
  }

  // Ghi kết quả ra file để bước seed database đọc lại
  await writeFile(
    path.join(__dirname, "anh-da-xu-ly.json"),
    JSON.stringify(ketQua, null, 2),
    "utf8",
  );

  const tong = Object.values(ketQua).flat().length;
  console.log(
    `\nXong: ${tong} ảnh sản phẩm + ${conThua.length} ảnh chưa phân loại → public/images/products/`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
