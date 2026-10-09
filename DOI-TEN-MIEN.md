# Chuyển website từ chourmas.online sang thachlan.com

Code đã được sửa sẵn. Còn 3 việc: trỏ DNS, chạy lệnh trên VPS, báo Google.
Tên miền cũ vẫn giữ và **tự chuyển (301) sang tên miền mới**, nên link cũ
khách đã lưu, đã chia sẻ trên Facebook/Zalo vẫn vào được, Google cũng chuyển
thứ hạng sang tên miền mới.

## Bước 1 — Trỏ DNS của thachlan.com về VPS

Vào trang quản lý DNS nơi bạn mua `thachlan.com`, sửa/thêm:

| Loại | Tên | Trỏ tới |
|---|---|---|
| A | `@` | `187.127.101.60` |
| A | `www` | `187.127.101.60` (hoặc CNAME `www` → `thachlan.com`) |

Xoá bản ghi A cũ đang trỏ về `2.57.91.91` (trang đỗ mặc định của nhà đăng ký).
**Không xoá DNS của chourmas.online** — cần nó để chuyển hướng link cũ.

Kiểm tra trên Mac (đợi đến khi ra đúng `187.127.101.60` mới làm bước 2):

```bash
dig +short thachlan.com
dig +short www.thachlan.com
```

## Bước 2 — Chạy trên VPS

```bash
ssh root@187.127.101.60
```

### 2.1 Lấy code mới, đổi địa chỉ website, build lại

```bash
cd /var/www/chourmas && git pull
sed -i 's#^NEXT_PUBLIC_SITE_URL=.*#NEXT_PUBLIC_SITE_URL="https://thachlan.com"#' .env
grep NEXT_PUBLIC_SITE_URL .env
npm run build && pm2 restart chourmas
```

> Phải build lại: địa chỉ website được "đóng" vào lúc build (dùng cho sitemap,
> ảnh chia sẻ Facebook/Zalo, dữ liệu Google).

### 2.2 Tạo cấu hình Nginx cho tên miền mới

```bash
cat > /etc/nginx/sites-available/thachlan <<'NGINX'
server {
    listen 80;
    server_name thachlan.com www.thachlan.com;
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
NGINX
ln -sf /etc/nginx/sites-available/thachlan /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 2.3 Cài HTTPS cho tên miền mới

```bash
certbot --nginx -d thachlan.com -d www.thachlan.com --redirect
```

Mở thử `https://thachlan.com` — phải thấy website.

### 2.4 Cho tên miền cũ chuyển hướng sang tên miền mới

```bash
cp /etc/nginx/sites-available/chourmas /root/nginx-chourmas-cu.bak
cat > /etc/nginx/sites-available/chourmas <<'NGINX'
server {
    listen 80;
    server_name chourmas.online www.chourmas.online;
    return 301 https://thachlan.com$request_uri;
}
server {
    listen 443 ssl;
    server_name chourmas.online www.chourmas.online;
    ssl_certificate     /etc/letsencrypt/live/chourmas.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chourmas.online/privkey.pem;
    return 301 https://thachlan.com$request_uri;
}
NGINX
nginx -t && systemctl reload nginx
```

Nếu `nginx -t` báo lỗi: chép lại bản cũ bằng
`cp /root/nginx-chourmas-cu.bak /etc/nginx/sites-available/chourmas && systemctl reload nginx`
rồi gửi lỗi cho Claude.

Kiểm tra:

```bash
curl -I https://chourmas.online/vi     # phải thấy 301 và Location: https://thachlan.com/vi
curl -I https://thachlan.com/vi        # phải thấy 200
curl -s https://thachlan.com/sitemap.xml | head -5   # link phải là thachlan.com
```

## Bước 3 — Việc ngoài máy chủ

- **Google Search Console:** thêm `thachlan.com`, gửi sitemap
  `https://thachlan.com/sitemap.xml`, rồi ở thuộc tính cũ chourmas.online dùng
  *Cài đặt → Thay đổi địa chỉ* để báo chuyển sang thachlan.com.
- Sửa link website ở Facebook page, Zalo OA, Shopee/TikTok, danh thiếp, bao bì.
- **Gia hạn chourmas.online thêm ít nhất 1 năm** để link cũ không chết.
