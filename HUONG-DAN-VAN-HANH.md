# Hướng dẫn vận hành website Chourmas

Tài liệu này viết cho người **không rành kỹ thuật**. Mọi việc thường ngày đều
làm được trong trang quản trị, không cần đụng tới code.

---

## 1. Đăng nhập trang quản trị

Mở trình duyệt, vào địa chỉ:

```
https://chourmasviet.com/admin
```

- **Tài khoản:** `admin`
- **Mật khẩu:** mật khẩu đã được cấp khi cài đặt website

> **Quên mật khẩu?** Xem mục 8 ở cuối tài liệu này.

Sau khi đăng nhập, bạn ở trong hệ thống 7 ngày rồi mới phải đăng nhập lại.

---

## 2. Xử lý đơn hàng mới

Khi có khách đặt hàng, bạn nhận được tin nhắn Telegram ngay lập tức (nếu đã cài
theo mục 7). Đơn hàng cũng luôn hiện trong trang quản trị.

**Các bước xử lý một đơn:**

1. Vào **Đơn hàng** ở thanh bên trái
2. Bấm vào **mã đơn** (ví dụ `CH2608120001`) để xem chi tiết
3. Gọi điện cho khách theo số điện thoại hiện trong đơn để xác nhận
4. Bấm nút **Đã xác nhận** ở cột bên phải
5. Đóng gói và gửi hàng qua đơn vị vận chuyển
6. Bấm **Đang giao**, và ghi mã vận đơn vào ô **Ghi chú nội bộ** rồi bấm Lưu
7. Khi khách đã nhận hàng và trả tiền, bấm **Đã giao**

**Ý nghĩa các trạng thái:**

| Trạng thái | Khi nào dùng |
|---|---|
| Chờ xác nhận | Đơn vừa về, chưa gọi khách |
| Đã xác nhận | Đã gọi khách, khách đồng ý mua |
| Đang giao | Đã gửi cho đơn vị vận chuyển |
| Đã giao | Khách đã nhận và đã trả tiền |
| Đã huỷ | Khách đổi ý, hoặc không liên lạc được |

> Doanh thu tháng ở trang Tổng quan chỉ tính các đơn ở trạng thái **Đã giao**.
> Nhớ bấm "Đã giao" để con số này đúng.

---

## 3. Sửa giá sản phẩm

1. Vào **Sản phẩm** ở thanh bên trái
2. Bấm vào **tên sản phẩm** muốn sửa
3. Kéo xuống mục **Giá và các cỡ khuôn**
4. Sửa số trong ô **Giá bán**. Nhập số liền, không cần dấu chấm:
   `229000` chứ không phải `229.000`
5. Bấm **Lưu thay đổi** ở cột bên phải

Giá mới hiện trên website **ngay lập tức**, không cần chờ.

**Về giá gạch ngang:** Ô **Giá gạch ngang** là con số bị gạch đi hiện bên cạnh
giá bán, tạo cảm giác đang giảm giá. Để trống ô này nếu không muốn hiện.
Website tự tính và hiện phần trăm giảm.

---

## 4. Báo hết hàng / còn hàng

**Cách nhanh nhất:** vào **Sản phẩm**, tìm dòng sản phẩm, gạt công tắc ở cột
**Còn hàng**. Xong. Không cần bấm Lưu.

Khi tắt "Còn hàng":
- Sản phẩm **vẫn hiện** trên website
- Có nhãn xám **"Tạm hết hàng"** đè lên ảnh
- Khách **không bấm mua được**

Khi tắt "Hiện trên web": sản phẩm **biến mất hoàn toàn** khỏi website.

> **Nên dùng cái nào?** Hết hàng tạm thời thì tắt "Còn hàng" — khách vẫn thấy
> mẫu đó và có thể nhắn hỏi khi nào có lại. Ngừng bán hẳn thì tắt "Hiện trên web".

---

## 5. Thêm sản phẩm mới

1. Vào **Sản phẩm** → bấm **Thêm sản phẩm** ở góc trên bên phải
2. Điền các ô **bắt buộc** (có dấu sao đỏ):
   - Tên sản phẩm tiếng Việt
   - Mã sản phẩm (ví dụ `LX-013/4`)
   - Ít nhất một cỡ, có giá bán
3. Chọn **Danh mục**
4. Bấm **Tạo sản phẩm**
5. Hệ thống đưa bạn về danh sách. Bấm lại vào sản phẩm vừa tạo
6. Kéo xuống mục **Ảnh sản phẩm**, bấm ô **Thêm ảnh** và chọn ảnh từ máy

Ảnh được **tự động cắt vuông và nén lại**, bạn không cần chỉnh sửa gì trước khi
tải lên. Ảnh có ngôi sao vàng là ảnh đại diện — ảnh hiện ở trang danh sách.
Muốn đổi ảnh đại diện, di chuột lên ảnh khác rồi bấm **Đại diện**.

**Những ô nên điền để bán tốt hơn:**

- **Mô tả ngắn** — hiện dưới tên ở trang danh sách, giúp khách hiểu ngay
- **Hoa văn từng mặt** — khách hỏi nhiều nhất. Mỗi dòng một mặt:
  ```
  Mặt 1: Hoa sen
  Mặt 2: Mẫu đơn
  Mặt 3: Hoa cúc
  Mặt 4: Cá đôi
  ```
- **Lưu ý quan trọng** — hiện trong khung vàng nổi bật ở trang sản phẩm
- **Ghi chú nhỏ cạnh mỗi cỡ** — ví dụ "Đựng vừa khay số 9"

---

## 6. Bán thêm mặt hàng khác (bột, dụng cụ, khuôn bánh in…)

Website đã dựng sẵn cấu trúc cho việc này. Bạn **không cần thuê code lại**.

1. Vào **Danh mục** ở thanh bên trái
2. Các danh mục `Nguyên liệu làm bánh`, `Dụng cụ làm bánh`, `Khuôn bánh in`
   đã có sẵn nhưng đang **tắt** vì chưa có sản phẩm
3. Thêm sản phẩm mới và chọn danh mục tương ứng
4. Quay lại **Danh mục**, bấm vào danh mục đó, tích **Hiện trên website**, bấm Lưu

Muốn tạo danh mục hoàn toàn mới: bấm **Thêm** ở trang Danh mục. Ô **Nằm trong
danh mục** cho phép tạo danh mục con (ví dụ `Khuôn bánh` → `Khuôn bánh dẻo`).

---

## 7. Cài thông báo Telegram khi có đơn mới

Làm một lần, dùng mãi. Mất khoảng 5 phút.

1. Mở Telegram, tìm tài khoản **@BotFather**
2. Nhắn `/newbot`, đặt tên bot (ví dụ `Chourmas Đơn Hàng`)
3. BotFather trả về một chuỗi dài — đó là **token**, copy lại
4. Tìm tài khoản **@userinfobot**, nhắn `/start`, nó trả về **số ID** của bạn
5. **Quan trọng:** nhắn một câu bất kỳ cho chính con bot bạn vừa tạo, để bot
   được phép nhắn lại cho bạn
6. Gửi hai giá trị đó cho người quản lý kỹ thuật để điền vào file `.env` trên
   máy chủ, rồi khởi động lại website

Trang **Cài đặt** trong admin có hướng dẫn chi tiết kèm mẫu file.

> Chưa cài Telegram cũng **không sao** — đơn hàng vẫn được lưu đầy đủ, bạn chỉ
> cần vào mục Đơn hàng để xem.

---

## 8. Đổi mật khẩu

**Cách thường:** vào **Cài đặt** → mục **Đổi mật khẩu**, nhập mật khẩu cũ và
mật khẩu mới.

**Nếu quên mật khẩu:** cần người có quyền vào máy chủ chạy lệnh:

```bash
npm run doi-mat-khau
```

Hệ thống sẽ tạo một mật khẩu mới và in ra màn hình.

---

## 9. Sửa thông tin liên hệ

Vào **Cài đặt** → mục **Thông tin liên hệ**. Sửa số điện thoại, Zalo, link
Facebook, khu vực bán hàng, thời gian nhận đơn.

Các thông tin này hiện ở: đầu trang, chân trang, trang Liên hệ, và nút Zalo nổi
ở góc màn hình.

---

## 10. Những việc CẦN người kỹ thuật

Các việc sau phải sửa trong code, không làm được trong admin:

| Việc | File cần sửa |
|---|---|
| Sửa nội dung chính sách đổi trả, vận chuyển, bảo mật | `src/noi-dung/chinh-sach.ts` |
| Sửa nội dung trang Hướng dẫn dùng khuôn | `src/app/(site)/[lang]/huong-dan/page.tsx` |
| Sửa câu chuyện thương hiệu ở trang Giới thiệu | `src/app/(site)/[lang]/gioi-thieu/page.tsx` |
| Sửa chữ trên nút, tiêu đề mục | `src/i18n/vi.ts` và `src/i18n/en.ts` |
| Đổi màu sắc toàn website | `src/app/globals.css`, khối `@theme` |
| Gắn Google Analytics / Facebook Pixel | `src/app/(site)/[lang]/layout.tsx` |

---

## 11. Sao lưu dữ liệu

Toàn bộ đơn hàng và sản phẩm nằm trong **một file duy nhất**:

```
data/chourmas.db
```

Ảnh bạn tải lên qua admin nằm trong:

```
public/uploads/
```

Chép hai thứ này về máy là đã sao lưu xong toàn bộ. Nên làm **mỗi tuần một lần**,
và **bắt buộc làm trước khi nâng cấp website**.

Xem lệnh sao lưu tự động trong file `DEPLOY-HOSTINGER.md`, mục 8.
