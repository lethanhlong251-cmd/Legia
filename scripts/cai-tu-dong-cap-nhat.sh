#!/bin/bash
#
# CÀI ĐẶT TỰ ĐỘNG CẬP NHẬT — CHẠY MỘT LẦN DUY NHẤT
# ================================================
#
# Chạy trên máy chủ VPS:
#
#     cd /var/www/chourmas && git pull && bash scripts/cai-tu-dong-cap-nhat.sh
#
# Script tự làm hết mọi thứ, bạn không phải gõ gì thêm. Chạy lại nhiều lần
# cũng không sao, nó tự nhận ra đã cài rồi.

set -uo pipefail

THU_MUC="${THU_MUC:-/var/www/chourmas}"
DICH="${DICH:-/root/tu-dong-cap-nhat.sh}"
NHAT_KY="${NHAT_KY:-/var/log/chourmas-cap-nhat.log}"
LENH_CRON="*/2 * * * * $DICH"

do=$'\e[31m'; xanh=$'\e[32m'; vang=$'\e[33m'; dam=$'\e[1m'; het=$'\e[0m'

buoc() { echo "${dam}▸ $1${het}"; }
xong() { echo "  ${xanh}✓${het} $1"; }
loi()  { echo "  ${do}✗ $1${het}"; }

echo ""
echo "${dam}CÀI ĐẶT TỰ ĐỘNG CẬP NHẬT WEBSITE CHOURMAS${het}"
echo "─────────────────────────────────────────────"
echo ""

# ---- 1. Kiểm tra đang đứng đúng chỗ ----
buoc "Kiểm tra máy chủ"
if [ ! -d "$THU_MUC/.git" ]; then
  loi "Không tìm thấy website ở $THU_MUC"
  echo ""
  echo "  Có vẻ bạn đang chạy lệnh này trên máy tính cá nhân chứ không phải VPS."
  echo "  Hãy đăng nhập VPS trước, xem mục 13 trong DEPLOY-HOSTINGER.md."
  exit 1
fi
xong "Tìm thấy website ở $THU_MUC"

if [ ! -f "$THU_MUC/scripts/tu-dong-cap-nhat.sh" ]; then
  loi "Thiếu file scripts/tu-dong-cap-nhat.sh"
  echo "  Chạy lệnh này trước rồi thử lại:  cd $THU_MUC && git pull"
  exit 1
fi
xong "Tìm thấy script cập nhật"

# ---- 2. Chép script ----
buoc "Chép script vào $DICH"
cp "$THU_MUC/scripts/tu-dong-cap-nhat.sh" "$DICH" && chmod +x "$DICH" || {
  loi "Không chép được. Bạn có đang đăng nhập bằng quyền root không?"
  exit 1
}
xong "Đã chép và cấp quyền chạy"

# ---- 3. Tạo file nhật ký ----
buoc "Tạo file nhật ký"
touch "$NHAT_KY" 2>/dev/null && xong "$NHAT_KY" || {
  loi "Không tạo được file nhật ký"
  exit 1
}

# ---- 4. Hẹn giờ chạy 2 phút một lần ----
buoc "Hẹn giờ tự chạy 2 phút một lần"
CRON_HIEN_TAI=$(crontab -l 2>/dev/null || true)

if echo "$CRON_HIEN_TAI" | grep -qF "$DICH"; then
  xong "Đã hẹn giờ từ trước, không thêm trùng"
else
  printf '%s\n%s\n' "$CRON_HIEN_TAI" "$LENH_CRON" | grep -v '^$' | crontab - || {
    loi "Không đặt được lịch chạy"
    exit 1
  }
  xong "Đã đặt lịch: 2 phút một lần"
fi

# ---- 5. Chạy thử ngay ----
buoc "Chạy thử một lượt"
if "$DICH"; then
  xong "Chạy thử không lỗi"
else
  echo "  ${vang}!${het} Lượt chạy thử báo lỗi — xem chi tiết: tail -30 $NHAT_KY"
fi

echo ""
echo "${xanh}${dam}XONG. Từ giờ cứ push code lên GitHub là website tự cập nhật trong 2 phút.${het}"
echo ""
echo "  Xem nhật ký cập nhật :  tail -f $NHAT_KY"
echo "  Cập nhật ngay lập tức:  $DICH"
echo "  Tắt tự động cập nhật :  crontab -l | grep -v tu-dong-cap-nhat | crontab -"
echo ""
