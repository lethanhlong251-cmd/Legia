# Dựng lại ảnh chia sẻ (khi muốn đổi ảnh hoặc đổi chữ)

Ảnh hiện ra khi dán link website vào Messenger, Zalo hay Facebook nằm ở:

```
public/anh-chia-se.jpg      (1200 × 630)
```

Ảnh này được dựng sẵn một lần rồi lưu thành file, nên website chạy không tốn
tài nguyên gì cho việc này.

---

## Muốn đổi ảnh nền

1. Bỏ ảnh mới vào `public/images/thuong-hieu/`
2. Cắt ảnh về khung ngang bằng lệnh sau (sửa lại tên file và vùng cắt):

```bash
node -e "
const sharp=require('sharp');
sharp('public/images/thuong-hieu/TEN-ANH-MOI.jpg')
  .extract({ left: 0, top: 349, width: 1086, height: 983 })
  .resize(1392, 1260, { fit: 'cover' })
  .jpeg({ quality: 92 })
  .toFile('public/images/thuong-hieu/banh-viet-nam-ngang.jpg');
"
```

`top` là khoảng cách từ mép trên, chỉnh số này để lấy đúng phần muốn giữ.

## Muốn đổi chữ

Sửa file `mau.html` trong thư mục này. Các chữ cần sửa nằm ở cuối file, trong
khối `<div class="bang">`.

## Dựng lại file ảnh

Việc này cần chạy trong trình duyệt vì phải dùng đúng font thương hiệu
(Playfair Display và Be Vietnam Pro, đã tải sẵn trong `public/fonts/`).

Cách nhanh nhất: nhờ trợ lý lập trình làm lại giúp — chỉ cần nói *"dựng lại ảnh
chia sẻ"* và chỉ ra chỗ muốn đổi. Quy trình gồm ba bước:

1. Chép `mau.html` vào thư mục `public/`, chạy `npm run dev`
2. Mở trang đó trong trình duyệt, vẽ nội dung ra thẻ `canvas` kích thước
   1200×630 rồi xuất ra JPEG
3. Lưu đè lên `public/anh-chia-se.jpg`, sau đó xoá file HTML khỏi `public/`

> **Vì sao không để sẵn công cụ tự động?** Việc đó cần một đường dẫn cho phép
> ghi file lên máy chủ. Để lại trong mã nguồn của một website bán hàng là rủi
> ro không đáng, trong khi việc dựng lại ảnh một năm chỉ làm vài lần.

---

## Kiểm tra sau khi đổi

Sau khi website đã chạy trên tên miền thật, dán địa chỉ website vào:

- **Facebook:** [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
  → bấm **Scrape Again** để Facebook đọc lại ảnh mới
- **Zalo:** dán link vào một cuộc trò chuyện với chính mình để xem thử

Facebook và Zalo đều **nhớ ảnh cũ** khá lâu. Đổi ảnh xong mà chưa thấy thay
đổi thì phải dùng công cụ Scrape Again ở trên, không phải lỗi website.
