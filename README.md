# Chourmas — Khuôn bánh trung thu hoa văn độc quyền

Website bán hàng của Chourmas, đối tác phân phối chính thức các mẫu khuôn bánh
trung thu độc quyền do Thạch Lan thiết kế.

**Địa chỉ:** https://chourmas.online · **Quản trị:** https://chourmas.online/admin

---

## Tài liệu

| Bạn muốn | Đọc file |
|---|---|
| Dùng website hằng ngày: xử lý đơn, sửa giá, báo hết hàng | **[HUONG-DAN-VAN-HANH.md](HUONG-DAN-VAN-HANH.md)** |
| Đưa website lên máy chủ Hostinger | **[DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md)** |
| Xem còn thiếu nội dung gì | **[TODO-NOI-DUNG.md](TODO-NOI-DUNG.md)** |

---

## Tính năng

**Phía khách hàng**
- Song ngữ Việt – Anh (`/vi` và `/en`), tự chọn theo ngôn ngữ trình duyệt
- Danh sách và trang chi tiết sản phẩm, nhiều cỡ giá cho mỗi mẫu
- Giỏ hàng lưu trong trình duyệt, đồng bộ giữa nhiều tab
- Đặt hàng COD, không yêu cầu chuyển khoản trước, không cần đăng ký tài khoản
- Tối ưu SEO: dữ liệu có cấu trúc `Product`, thẻ `canonical`, `hreflang`, sitemap ảnh
- Trang tĩnh dựng sẵn cho mọi sản phẩm nên mở rất nhanh

**Phía quản trị** (`/admin`)
- Đăng nhập bằng phiên có ký, hạn 7 ngày
- Quản lý đơn hàng theo 5 trạng thái, có ghi chú nội bộ
- Thêm, sửa, xoá sản phẩm; sửa giá và các cỡ ngay trên một màn hình
- Công tắc nhanh: hiện trên web / còn hàng / nổi bật
- Tải ảnh lên, tự động cắt vuông và nén WebP
- Danh mục nhiều cấp, dựng sẵn cho việc bán thêm mặt hàng khác
- Sửa thông tin liên hệ, đổi mật khẩu
- Thông báo đơn mới qua Telegram

---

## Công nghệ

| Thành phần | Lựa chọn |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Ngôn ngữ | TypeScript |
| Giao diện | Tailwind CSS v4 |
| Cơ sở dữ liệu | SQLite qua Prisma 7 |
| Xử lý ảnh | sharp |
| Chữ | Playfair Display + Be Vietnam Pro |

Toàn bộ tên hàm, biến và chú thích trong code viết bằng **tiếng Việt** để người
tiếp quản dự án đọc được ngay.

---

## Chạy trên máy cá nhân

```bash
npm install
```

Tạo file `.env` từ mẫu:

```bash
cp .env.example .env
```

Sinh chuỗi bí mật cho phiên đăng nhập và dán vào `ADMIN_SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Tạo cơ sở dữ liệu và nạp 13 sản phẩm ban đầu:

```bash
npx prisma migrate deploy && npm run nap-du-lieu
```

Lệnh trên in ra mật khẩu quản trị — chép lại ngay, chỉ hiện một lần.

Khởi động:

```bash
npm run dev
```

Mở http://localhost:3000

---

## Các lệnh có sẵn

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy ở chế độ phát triển |
| `npm run build` | Build bản chạy thật |
| `npm start` | Chạy bản đã build |
| `npm run anh` | Xử lý lại ảnh gốc từ thư mục `Ảnh sản phẩm` |
| `npm run nap-du-lieu` | Nạp lại 13 sản phẩm gốc (ghi đè sửa đổi trong admin) |
| `npm run doi-mat-khau` | Đặt lại mật khẩu quản trị khi quên |
| `npm run db:studio` | Mở giao diện xem cơ sở dữ liệu |
| `npm run lint` | Kiểm tra code |

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (site)/[lang]/        Website khách xem, song ngữ
│   ├── (admin)/admin/        Trang quản trị, chỉ tiếng Việt
│   └── actions/              Xử lý đặt hàng và các thao tác quản trị
├── components/
│   ├── site/                 Thành phần giao diện phía khách
│   ├── admin/                Thành phần giao diện quản trị
│   └── logo.tsx              Logo và biểu tượng mặt khuôn
├── i18n/                     Bản dịch Việt và Anh
├── lib/                      Kết nối dữ liệu, giỏ hàng, xác thực, định dạng
├── noi-dung/                 Nội dung các trang chính sách
└── proxy.ts                  Tự thêm mã ngôn ngữ vào đường dẫn

prisma/
├── schema.prisma             Cấu trúc cơ sở dữ liệu
├── du-lieu-san-pham.ts       13 sản phẩm ban đầu
└── seed.ts                   Script nạp dữ liệu

scripts/
├── xu-ly-anh.mjs             Chuẩn hoá ảnh sản phẩm sang WebP vuông
└── doi-mat-khau.ts           Đặt lại mật khẩu quản trị
```

---

## Hai điều quan trọng về bảo mật

1. **`ADMIN_SESSION_SECRET` phải là chuỗi ngẫu nhiên dài.** Ai biết chuỗi này
   đều tự tạo được vé đăng nhập vào trang quản trị. Không dùng lại chuỗi mẫu.

2. **Giá tiền luôn được đọc lại từ cơ sở dữ liệu khi đặt hàng.** Hệ thống không
   bao giờ tin giá do trình duyệt gửi lên, nên không ai sửa giá trong trình
   duyệt rồi đặt hàng giá 0 đồng được.
