#!/bin/bash
# ============================================================
#  TẠO LINK XEM THỬ WEBSITE CHOURMAS
#
#  Script này bật website trên máy bạn rồi tạo một đường link
#  công khai, gửi cho ai cũng xem được — kể cả trên điện thoại,
#  không cần thuê máy chủ.
#
#  Cách chạy:  npm run xem-thu
#  Cách tắt :  bấm Ctrl + C
#
#  Lưu ý: link chỉ sống khi MacBook còn bật và cửa sổ này còn mở.
#  Đóng cửa sổ hoặc tắt máy là link chết.
# ============================================================

set -e

# Về thư mục gốc của dự án, dù script được gọi từ đâu
cd "$(dirname "$0")/.."
THU_MUC_DU_AN="$(pwd)"
CONG=3000

echo ""
echo "════════════════════════════════════════════════════"
echo "   CHOURMAS — TẠO LINK XEM THỬ"
echo "════════════════════════════════════════════════════"
echo ""

# ------------------------------------------------------------
# Bước 1: Chuẩn bị cloudflared (công cụ tạo link)
# ------------------------------------------------------------
# cloudflared là công cụ miễn phí của Cloudflare, làm nhiệm vụ
# nối từ Internet về máy bạn. Nếu máy chưa có thì tải về, chỉ
# tải một lần rồi để dành trong thư mục dự án.

THU_MUC_CONG_CU="$THU_MUC_DU_AN/.cong-cu"
CLOUDFLARED="$THU_MUC_CONG_CU/cloudflared"

if command -v cloudflared >/dev/null 2>&1; then
  # Máy đã cài sẵn (ví dụ qua Homebrew) thì dùng luôn
  CLOUDFLARED="$(command -v cloudflared)"
  echo "✓ Đã có sẵn công cụ tạo link"
elif [ -x "$CLOUDFLARED" ]; then
  echo "✓ Đã có sẵn công cụ tạo link"
else
  echo "→ Lần đầu chạy, đang tải công cụ tạo link (khoảng 30 giây)..."
  mkdir -p "$THU_MUC_CONG_CU"

  # Máy Mac đời mới dùng chip Apple (arm64), đời cũ dùng chip Intel (amd64)
  if [ "$(uname -m)" = "arm64" ]; then
    KIEU_MAY="darwin-arm64"
  else
    KIEU_MAY="darwin-amd64"
  fi

  DIA_CHI_TAI="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-${KIEU_MAY}.tgz"

  if ! curl -fsSL "$DIA_CHI_TAI" -o "$THU_MUC_CONG_CU/cloudflared.tgz"; then
    echo ""
    echo "✗ Tải không được. Kiểm tra lại mạng rồi chạy lại lệnh này."
    exit 1
  fi

  tar -xzf "$THU_MUC_CONG_CU/cloudflared.tgz" -C "$THU_MUC_CONG_CU"
  rm -f "$THU_MUC_CONG_CU/cloudflared.tgz"
  chmod +x "$CLOUDFLARED"

  # macOS chặn file tải từ mạng, dòng này gỡ nhãn chặn đó
  xattr -d com.apple.quarantine "$CLOUDFLARED" 2>/dev/null || true

  echo "✓ Tải xong"
fi

# ------------------------------------------------------------
# Bước 2: Dọn dẹp khi bấm Ctrl + C
# ------------------------------------------------------------
# Không có phần này thì tắt script xong website vẫn chạy ngầm,
# lần sau chạy lại sẽ báo lỗi "cổng 3000 đang bận".

PID_WEB=""
PID_LINK=""

# Tắt mọi tiến trình đang chiếm cổng 3000.
# Viết bằng vòng lặp thay vì xargs, vì cờ `xargs -r` không có trên macOS.
giai_phong_cong() {
  local pid
  for pid in $(lsof -ti :$CONG 2>/dev/null); do
    kill "$pid" 2>/dev/null || true
  done
}

don_dep() {
  echo ""
  echo "→ Đang tắt..."
  [ -n "$PID_LINK" ] && kill "$PID_LINK" 2>/dev/null || true
  [ -n "$PID_WEB" ] && kill "$PID_WEB" 2>/dev/null || true
  # Dọn nốt tiến trình con của Next.js nếu còn sót
  giai_phong_cong
  echo "✓ Đã tắt. Link xem thử không còn dùng được nữa."
  echo ""
  exit 0
}
trap don_dep INT TERM

# Nếu cổng 3000 đang bị chiếm từ lần chạy trước thì giải phóng
if lsof -ti :$CONG >/dev/null 2>&1; then
  echo "→ Cổng $CONG đang bận, đang giải phóng..."
  giai_phong_cong
  sleep 2
fi

# ------------------------------------------------------------
# Bước 3: Bật website
# ------------------------------------------------------------
echo "→ Đang bật website..."

NHAT_KY_WEB="$THU_MUC_CONG_CU/nhat-ky-web.txt"
npm run dev >"$NHAT_KY_WEB" 2>&1 &
PID_WEB=$!

# Chờ website sẵn sàng, tối đa 90 giây
echo -n "  Chờ website khởi động"
SAN_SANG=0
for _ in $(seq 1 90); do
  if curl -fsS -o /dev/null "http://localhost:$CONG/vi" 2>/dev/null; then
    SAN_SANG=1
    break
  fi
  # Website chết giữa chừng thì báo lỗi ngay, không chờ vô ích
  if ! kill -0 "$PID_WEB" 2>/dev/null; then
    echo ""
    echo ""
    echo "✗ Website không bật được. Lý do:"
    echo ""
    tail -20 "$NHAT_KY_WEB"
    exit 1
  fi
  echo -n "."
  sleep 1
done
echo ""

if [ "$SAN_SANG" -ne 1 ]; then
  echo ""
  echo "✗ Website khởi động quá lâu. Xem chi tiết trong:"
  echo "  $NHAT_KY_WEB"
  don_dep
fi

echo "✓ Website đã chạy"

# ------------------------------------------------------------
# Bước 4: Tạo link công khai
# ------------------------------------------------------------
echo "→ Đang tạo link công khai..."

NHAT_KY_LINK="$THU_MUC_CONG_CU/nhat-ky-link.txt"
: >"$NHAT_KY_LINK"

"$CLOUDFLARED" tunnel --url "http://localhost:$CONG" --no-autoupdate \
  >"$NHAT_KY_LINK" 2>&1 &
PID_LINK=$!

# Đợi cloudflared in ra địa chỉ, tối đa 60 giây
DIA_CHI=""
for _ in $(seq 1 60); do
  DIA_CHI=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$NHAT_KY_LINK" 2>/dev/null | head -1 || true)
  [ -n "$DIA_CHI" ] && break
  if ! kill -0 "$PID_LINK" 2>/dev/null; then
    echo ""
    echo "✗ Không tạo được link. Lý do:"
    echo ""
    tail -20 "$NHAT_KY_LINK"
    don_dep
  fi
  sleep 1
done

if [ -z "$DIA_CHI" ]; then
  echo ""
  echo "✗ Chờ mãi không thấy link. Xem chi tiết trong:"
  echo "  $NHAT_KY_LINK"
  don_dep
fi

# ------------------------------------------------------------
# Xong
# ------------------------------------------------------------
echo ""
echo "════════════════════════════════════════════════════"
echo ""
echo "  ✓ XONG! Gửi link này cho ai cũng xem được:"
echo ""
echo "    $DIA_CHI/vi"
echo ""
echo "  Trang quản trị:"
echo "    $DIA_CHI/admin"
echo ""
echo "════════════════════════════════════════════════════"
echo ""
echo "  • Mở link trên điện thoại để xem giao diện di động"
echo "  • Link sống khi cửa sổ này còn mở"
echo "  • Bấm Ctrl + C để tắt"
echo ""

# Giữ script chạy cho đến khi người dùng bấm Ctrl + C
wait "$PID_LINK"
