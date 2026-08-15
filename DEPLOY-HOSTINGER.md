# Đưa website Chourmas lên Hostinger

Hướng dẫn từng bước, chạy từ đầu đến khi website chạy thật trên tên miền.

---

## 0. Cần chuẩn bị

| Thứ cần có | Ghi chú |
|---|---|
| **VPS Hostinger** gói KVM 1 trở lên | Bắt buộc. Gói Shared Hosting KHÔNG chạy được Node.js |
| Hệ điều hành **Ubuntu 24.04** | Chọn khi tạo VPS |
| Tên miền `chourmasviet.com` | Mua ở Hostinger hoặc nơi khác |
| Tài khoản GitHub | Đã có: `lethanhlong251-cmd` |

**Vì sao phải là VPS?** Website có trang quản trị, giỏ hàng và cơ sở dữ liệu,
nên cần một máy chủ chạy Node.js liên tục. Shared Hosting chỉ chạy PHP và file
tĩnh.

---

## 1. Tạo VPS và đăng nhập

1. Vào hPanel Hostinger → **VPS** → **Create VPS**
2. Chọn gói **KVM 1**, hệ điều hành **Ubuntu 24.04 LTS**
3. Đặt mật khẩu root, lưu lại
4. Ghi lại **địa chỉ IP** của VPS

Mở Terminal trên máy bạn và đăng nhập:

```bash
ssh root@DIA_CHI_IP_CUA_BAN
```

---

## 2. Cài các phần mềm cần thiết

Chạy lần lượt từng lệnh:

```bash
apt update && apt upgrade -y
```

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs git nginx
```

```bash
npm install -g pm2
```

Kiểm tra đã cài đúng:

```bash
node -v && npm -v && nginx -v
```

Kết quả phải thấy Node phiên bản `v22.x` trở lên.

---

## 3. Tải mã nguồn về máy chủ

```bash
mkdir -p /var/www && cd /var/www
```

```bash
git clone https://github.com/lethanhlong251-cmd/Legia.git chourmas
```

```bash
cd /var/www/chourmas && npm install
```

---

## 4. Tạo file cấu hình `.env`

```bash
nano /var/www/chourmas/.env
```

Dán nội dung sau vào, **nhớ thay các giá trị in hoa**:

```env
DATABASE_URL="file:./data/chourmas.db"
ADMIN_SESSION_SECRET="DAN_CHUOI_NGAU_NHIEN_VUA_TAO_VAO_DAY"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
NEXT_PUBLIC_SITE_URL="https://chourmasviet.com"
NODE_ENV="production"
```

Tạo chuỗi ngẫu nhiên cho `ADMIN_SESSION_SECRET` bằng lệnh:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Copy kết quả và dán vào file. Lưu file: bấm `Ctrl+O`, `Enter`, rồi `Ctrl+X`.

> **Cảnh báo 1:** Đừng để trống `ADMIN_SESSION_SECRET` và đừng dùng chuỗi mẫu
> trong `.env.example`. Ai biết chuỗi này đều đăng nhập được vào trang quản trị.

> **Cảnh báo 2:** `NEXT_PUBLIC_SITE_URL` phải là địa chỉ thật
> `https://chourmasviet.com`. Nếu để `localhost` thì khi dán link website vào
> Messenger hay Zalo sẽ **không hiện ảnh preview**, vì Facebook đi tìm ảnh ở
> địa chỉ localhost của chính nó và không thấy gì.

---

## 5. Tạo cơ sở dữ liệu và nạp dữ liệu ban đầu

```bash
cd /var/www/chourmas && npx prisma migrate deploy
```

```bash
npm run nap-du-lieu
```

Lệnh này in ra **mật khẩu quản trị**. **Chép lại ngay**, nó chỉ hiện một lần.

---

## 6. Build và khởi động website

```bash
npm run build
```

```bash
pm2 start npm --name chourmas -- start
```

```bash
pm2 save && pm2 startup
```

Lệnh `pm2 startup` in ra một dòng lệnh khác — copy dòng đó và chạy tiếp. Việc
này để website **tự khởi động lại khi VPS khởi động lại**.

Kiểm tra website đã chạy chưa:

```bash
curl -I http://localhost:3000/vi
```

Thấy `HTTP/1.1 200 OK` là được.

---

## 7. Cấu hình Nginx và tên miền

### 7.1 Trỏ tên miền về VPS

Vào nơi quản lý tên miền, tạo hai bản ghi DNS:

| Loại | Tên | Trỏ tới |
|---|---|---|
| A | `@` | Địa chỉ IP của VPS |
| A | `www` | Địa chỉ IP của VPS |

Chờ 10 đến 30 phút để DNS lan truyền.

### 7.2 Tạo cấu hình Nginx

```bash
nano /etc/nginx/sites-available/chourmas
```

Dán nội dung:

```nginx
server {
    listen 80;
    server_name chourmasviet.com www.chourmasviet.com;

    # Cho phép khách tải ảnh sản phẩm nặng khi upload trong admin
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Bật cấu hình lên:

```bash
ln -s /etc/nginx/sites-available/chourmas /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### 7.3 Cài chứng chỉ HTTPS miễn phí

```bash
apt install -y certbot python3-certbot-nginx
```

```bash
certbot --nginx -d chourmasviet.com -d www.chourmasviet.com
```

Làm theo hướng dẫn trên màn hình. Chọn **redirect** khi được hỏi, để khách vào
`http://` tự chuyển sang `https://`.

Chứng chỉ tự gia hạn, bạn không phải làm gì thêm.

**Xong. Mở trình duyệt vào `https://chourmasviet.com` để xem kết quả.**

---

## 8. Sao lưu tự động hằng ngày

```bash
mkdir -p /root/sao-luu && nano /root/sao-luu.sh
```

Dán nội dung:

```bash
#!/bin/bash
NGAY=$(date +%Y-%m-%d)
cd /var/www/chourmas
tar czf /root/sao-luu/chourmas-$NGAY.tar.gz data public/uploads
# Chỉ giữ lại 14 bản gần nhất
ls -t /root/sao-luu/chourmas-*.tar.gz | tail -n +15 | xargs -r rm
```

```bash
chmod +x /root/sao-luu.sh && crontab -e
```

Thêm dòng này vào cuối file (sao lưu lúc 3 giờ sáng mỗi ngày):

```
0 3 * * * /root/sao-luu.sh
```

**Tải bản sao lưu về máy bạn:**

```bash
scp root@DIA_CHI_IP:/root/sao-luu/chourmas-*.tar.gz ~/Downloads/
```

---

## 9. Cập nhật website khi có thay đổi code

Mỗi lần code được cập nhật trên GitHub, chạy trên VPS:

```bash
cd /var/www/chourmas
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart chourmas
```

> **Luôn sao lưu trước khi cập nhật:** `/root/sao-luu.sh`

Để tiện, tạo sẵn một lệnh tắt:

```bash
nano /root/cap-nhat.sh
```

```bash
#!/bin/bash
set -e
/root/sao-luu.sh
cd /var/www/chourmas
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart chourmas
echo "Đã cập nhật xong."
```

```bash
chmod +x /root/cap-nhat.sh
```

Từ nay chỉ cần chạy `/root/cap-nhat.sh`.

---

## 10. Xử lý sự cố thường gặp

**Website không mở được**

```bash
pm2 status
pm2 logs chourmas --lines 50
```

**Sửa xong code mà web không đổi**

Phải build lại, không chỉ restart:

```bash
cd /var/www/chourmas && npm run build && pm2 restart chourmas
```

**Lỗi "Thiếu ADMIN_SESSION_SECRET"**

File `.env` chưa có hoặc chuỗi ngắn hơn 24 ký tự. Xem lại mục 4.

**Upload ảnh trong admin báo lỗi**

Nginx chặn file lớn. Kiểm tra dòng `client_max_body_size 20M;` đã có trong
cấu hình Nginx chưa, rồi `systemctl reload nginx`.

**VPS hết dung lượng ổ cứng**

```bash
df -h
du -sh /var/www/chourmas/.next /root/sao-luu
```

Xoá bớt bản sao lưu cũ trong `/root/sao-luu`.

**Muốn xem website đang dùng bao nhiêu RAM**

```bash
pm2 monit
```

Gói KVM 1 có 4GB RAM, thừa sức cho website này.

---

## 11. Ghi chú kỹ thuật

- **Cơ sở dữ liệu:** SQLite, một file duy nhất tại `data/chourmas.db`.
  Muốn chuyển sang PostgreSQL sau này, chỉ cần đổi `provider` trong
  `prisma/schema.prisma` và đổi adapter trong `src/lib/prisma.ts`.
- **Ảnh sản phẩm gốc** nằm trong `public/images/products/`, được đưa lên GitHub.
- **Ảnh tải lên qua admin** nằm trong `public/uploads/`, **không** đưa lên
  GitHub — nên bắt buộc phải sao lưu theo mục 8.
- **File `.env` không bao giờ được đưa lên GitHub.** Nó đã nằm trong
  `.gitignore`.
- **Ảnh được nén tự động sang AVIF** (nhẹ hơn WebP khoảng 45%). Việc này dựa
  vào việc máy chủ đọc được tiêu đề `Accept` của trình duyệt. Nginx trong
  hướng dẫn này chuyển tiếp tiêu đề đó sẵn nên không phải làm gì thêm.

  > Nếu sau này bạn đặt thêm Cloudflare hay một dịch vụ tăng tốc nào khác ở
  > phía trước, phải bật cho nó **chuyển tiếp tiêu đề `Accept`**. Quên bước
  > này thì mọi khách đều nhận ảnh nặng hơn, website không lỗi nhưng chậm đi
  > thấy rõ.
