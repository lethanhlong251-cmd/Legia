# Việc cần bổ sung nội dung

Danh sách những chỗ website đang thiếu thông tin hoặc đang dùng nội dung tạm.
Ghi rõ **sửa ở đâu** để làm cho nhanh.

---

## 🔴 Cần làm sớm — ảnh hưởng uy tín

### 1. Duyệt lại 3 trang chính sách

Nội dung hiện tại được soạn theo **thông lệ chung** của thương mại điện tử Việt
Nam, chưa phải cách vận hành thật của Chourmas. Khách đọc và tin theo, nên sai
là mất uy tín.

**Sửa ở:** `src/noi-dung/chinh-sach.ts`

Những chỗ đã đánh dấu `⚠️` trong file, cần bạn xác nhận:

| Nội dung đang ghi tạm | Cần xác nhận |
|---|---|
| Thời gian giao 2–3 ngày (thành phố lớn), 3–5 ngày (tỉnh khác) | Thực tế bao lâu? |
| Đổi trả trong vòng **7 ngày** | Bạn cho bao nhiêu ngày? |
| Lỗi từ shop → shop chịu ship 2 chiều | Đúng không? |
| Khách chọn nhầm cỡ → khách chịu ship trả | Đúng không? |
| "gửi qua các đơn vị chuyển phát nhanh" | Tên đơn vị cụ thể bạn dùng? |
| Chưa có mục bảo hành | Có bảo hành lò xo gãy không? Bao lâu? |

---

## 🟡 Nên làm — tăng chốt đơn

### 2. Đặt tên cho 4 sản phẩm chưa có tên

Hiện đang hiển thị tên tạm theo mã sản phẩm. Tên có ý nghĩa bán tốt hơn nhiều.

**Sửa ở:** trang quản trị → **Sản phẩm** → bấm vào từng sản phẩm → ô **Tên sản phẩm**

| Mã | Tên đang hiện | Gợi ý đặt tên |
|---|---|---|
| `LX-002/4` | Khuôn lò xo LX-002/4 | Bộ 4 mặt thay được, cỡ 300g |
| `LX-007/4` | Khuôn lò xo LX-007/4 | — |
| `LX-009/5` | Khuôn lò xo LX-009/5 | — |
| `LX-011/7` | Khuôn lò xo LX-011/7 | Có 7 mặt: cúc, sen, mẫu đơn, chữ Thọ, tre trúc, mặt cười, chim công |

### 3. Điền hoa văn từng mặt cho cả 13 sản phẩm

Đây là câu khách hỏi **nhiều nhất**. Điền vào sẽ giảm hẳn tin nhắn hỏi lặp và
tăng tỷ lệ chốt đơn.

> **Kèm theo:** hiện mới có 1 trên 13 sản phẩm ghi khuôn đó vừa **khay số mấy**
> (khay 9, khay 10). Khi bạn điền đủ thông tin khay cho các mẫu còn lại, tôi sẽ
> thêm được bộ lọc *"khuôn vừa khay số 9"* — đây là câu khách hay hỏi thứ hai.
> Hiện tại trang danh sách mới lọc được theo số mặt và theo cỡ gam.

**Sửa ở:** trang quản trị → **Sản phẩm** → từng sản phẩm → ô **Hoa văn từng mặt**

Mỗi dòng một mặt, ví dụ:

```
Mặt 1: Hoa sen
Mặt 2: Mẫu đơn
Mặt 3: Hoa cúc
Mặt 4: Cá đôi
```

Riêng `LX-011/7` đã biết từ ảnh: cúc, sen (chữ Thọ), hoa văn cổ, mẫu đơn,
tre trúc, mặt cười, chim công.

### 4. Đăng video hướng dẫn đóng bánh

Bạn nói đã có video. Video làm tăng tin tưởng rất mạnh vì khách thấy được kết
quả thật.

**Cần làm:** tải video lên YouTube (chế độ Không công khai cũng được), gửi link.
Tôi sẽ nhúng vào trang **Hướng dẫn** và trang chi tiết sản phẩm.

### 5. Đăng feedback khách hàng

Bảng `Testimonial` đã dựng sẵn trong cơ sở dữ liệu nhưng chưa có giao diện quản
lý. Khi bạn gửi ảnh feedback, tôi sẽ làm mục "Khách hàng nói gì" ở trang chủ.

**Cần làm:** gửi các ảnh chụp tin nhắn khách khen, kèm tên khách (viết tắt cũng
được, ví dụ "Chị Lan, Hà Nội").

---

## 🟢 Làm khi có thời gian

### 6. Chất liệu khuôn

Hiện để trống theo yêu cầu, website chỉ nói "khuôn cao cấp". Nếu sau này muốn
công bố (nhựa ABS thực phẩm, PP…), điền vào ô **Chất liệu** trong trang sản phẩm.

### 7. Gắn Google Analytics và Facebook Pixel

Cần khi bắt đầu chạy quảng cáo, để đo được quảng cáo nào ra đơn.

**Cần gửi tôi:** mã đo lường Google Analytics (`G-XXXXXXXXXX`) và ID Facebook Pixel.

**Sẽ sửa ở:** `src/app/(site)/[lang]/layout.tsx`

### 8. Hai ảnh chưa phân loại

Hai ảnh Facebook chưa rõ thuộc sản phẩm nào, đã được xử lý sẵn và để tại:

```
public/images/products/chua-phan-loai/
```

Nếu là ảnh feedback khách hoặc ảnh bánh thành phẩm, báo tôi để đưa vào đúng chỗ.

### 9. Mua thêm tên miền `.vn`

Khách Việt hay gõ `.vn` theo phản xạ. Mua `chourmas.vn` và trỏ về cùng website
sẽ không mất khách. Chi phí khoảng 750.000đ/năm.

### 10. Watermark ảnh

Toàn bộ ảnh hiện có watermark "Khuôn thiết kế Thạch Lan". Điều này **có lợi** —
nó chứng minh hàng chính hãng, và website đã nói rõ Chourmas là đối tác phân
phối chính thức. Nếu sau này muốn ảnh mang thương hiệu Chourmas, cần chụp lại
bộ ảnh mới.

---

## Ghi chú về giá gạch ngang

Giá gạch ngang hiện tại được đặt **cao hơn giá bán khoảng 25%**, do tôi tính tự
động khi nạp dữ liệu. Đây là con số giả định, không phải giá cũ thật.

Bạn nên xem lại từng sản phẩm và đặt con số phản ánh đúng thực tế, hoặc **tắt
hẳn tính năng này** trong trang quản trị → **Cài đặt** → bỏ tích *Hiện giá gạch
ngang*.

Lý do: nếu khách từng mua với giá thấp hơn "giá gốc" bạn hiện, hoặc thấy nơi
khác bán đúng bằng "giá gốc" đó, sẽ mất tin tưởng.
