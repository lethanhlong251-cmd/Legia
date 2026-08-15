import sharp from "sharp";

/**
 * TẠO ẢNH XEM TRƯỚC MỜ
 * --------------------
 * Thu ảnh xuống còn khoảng 12 pixel rồi nhúng thẳng vào trang dưới dạng
 * chuỗi ký tự. Nhờ vậy khách thấy ngay một mảng màu mờ đúng tông ảnh thật,
 * rồi ảnh thật hiện đè lên khi tải xong — thay vì nhìn ô trống.
 *
 * Chuỗi tạo ra chỉ nặng khoảng 300 đến 600 ký tự nên nhúng thẳng vào trang
 * được, không tốn thêm một lượt tải nào.
 */
export async function taoAnhMo(anhGoc: Buffer | string): Promise<string> {
  const nho = await sharp(anhGoc, { failOn: "none" })
    .resize(12, 12, { fit: "inside" })
    .webp({ quality: 45 })
    .toBuffer();

  return `data:image/webp;base64,${nho.toString("base64")}`;
}
