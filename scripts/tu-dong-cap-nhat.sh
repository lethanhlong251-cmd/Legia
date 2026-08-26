#!/bin/bash
#
# TỰ ĐỘNG CẬP NHẬT WEBSITE KHI CÓ CODE MỚI TRÊN GITHUB
# ====================================================
#
# Chạy 2 phút một lần. Không có code mới thì thoát ngay, không làm gì cả.
# Có code mới thì: sao lưu → tải về → cài đặt → build → khởi động lại.
#
# NGUYÊN TẮC AN TOÀN (đây là website đang bán hàng thật):
#
#   1. Không bao giờ chạy chồng lên nhau. Build mất vài phút mà cứ 2 phút
#      lại chạy một lần, chồng nhau là hỏng.
#   2. Luôn sao lưu cơ sở dữ liệu TRƯỚC khi chạy chuyển đổi dữ liệu.
#   3. Build hỏng thì KHÔNG khởi động lại, mà quay về bản cũ đang chạy tốt.
#      Thà web giữ nguyên bản cũ còn hơn sập giữa mùa.
#   4. Có chuyện gì cũng nhắn Telegram báo ngay, không im lặng.
#
# Cài đặt: xem mục 12 trong DEPLOY-HOSTINGER.md

set -uo pipefail

THU_MUC="/var/www/chourmas"
TEN_PM2="chourmas"
NHANH="main"
NHAT_KY="/var/log/chourmas-cap-nhat.log"
DIR_KHOA="/tmp/chourmas-cap-nhat.lock"

ghi() {
  echo "[$(date '+%d/%m/%Y %H:%M:%S')] $*" >>"$NHAT_KY"
}

# Nhắn Telegram. Chưa cấu hình Telegram thì lặng lẽ bỏ qua.
bao() {
  local noi_dung="$1"
  local token chat_id
  token=$(grep -E '^TELEGRAM_BOT_TOKEN=' "$THU_MUC/.env" 2>/dev/null | cut -d= -f2- | tr -d '"' | tr -d "'")
  chat_id=$(grep -E '^TELEGRAM_CHAT_ID=' "$THU_MUC/.env" 2>/dev/null | cut -d= -f2- | tr -d '"' | tr -d "'")
  [ -z "$token" ] || [ -z "$chat_id" ] && return 0
  curl -sS --max-time 10 -o /dev/null \
    -d "chat_id=$chat_id" --data-urlencode "text=$noi_dung" \
    "https://api.telegram.org/bot$token/sendMessage" || true
}

# ---- Chống chạy chồng ----
# Build mất vài phút mà cứ 2 phút lại chạy một lượt, chồng nhau là hỏng.
# Dùng mkdir vì nó là thao tác nguyên tử, có sẵn ở mọi máy, không cần
# cài thêm công cụ nào. Lần trước chưa xong thì lần này thoát luôn.
if ! mkdir "$DIR_KHOA" 2>/dev/null; then
  # Khoá quá 30 phút nghĩa là lần chạy trước bị kẹt giữa chừng,
  # không thể để nó chặn vĩnh viễn.
  if [ -n "$(find "$DIR_KHOA" -maxdepth 0 -mmin +30 2>/dev/null)" ]; then
    ghi "Khoá cũ quá 30 phút, coi như lần trước bị kẹt. Tiếp tục."
    rm -rf "$DIR_KHOA"
    mkdir "$DIR_KHOA" 2>/dev/null || exit 0
  else
    exit 0
  fi
fi
# Xoá khoá dù script kết thúc theo cách nào
trap 'rm -rf "$DIR_KHOA"' EXIT

cd "$THU_MUC" || { ghi "LỖI: không vào được $THU_MUC"; exit 1; }

# ---- Có code mới không? ----
if ! git fetch --quiet origin "$NHANH" 2>/dev/null; then
  ghi "Không kết nối được GitHub, bỏ qua lượt này"
  exit 0
fi

BAN_CU=$(git rev-parse HEAD)
BAN_MOI=$(git rev-parse "origin/$NHANH")

if [ "$BAN_CU" = "$BAN_MOI" ]; then
  exit 0   # Không có gì mới, im lặng thoát
fi

MO_TA=$(git log --format=%s -1 "$BAN_MOI")
ghi "───────────────────────────────────────────"
ghi "Có code mới: ${BAN_CU:0:7} → ${BAN_MOI:0:7}"
ghi "Nội dung: $MO_TA"

# ---- Sao lưu trước khi động vào bất cứ thứ gì ----
if [ -x /root/sao-luu.sh ]; then
  /root/sao-luu.sh >>"$NHAT_KY" 2>&1 && ghi "Đã sao lưu" || ghi "CẢNH BÁO: sao lưu không thành công"
else
  ghi "CẢNH BÁO: không tìm thấy /root/sao-luu.sh, bỏ qua bước sao lưu"
fi

# ---- Tải code mới ----
# Dùng reset --hard thay vì pull để không bao giờ kẹt vì xung đột.
# Đổi lại: TUYỆT ĐỐI không sửa code trực tiếp trên máy chủ, sẽ bị ghi đè.
git reset --hard "origin/$NHANH" -q || { ghi "LỖI: không tải được code mới"; bao "❌ Chourmas: không tải được code mới từ GitHub"; exit 1; }

# ---- Cài thư viện, chỉ khi danh sách thư viện có thay đổi ----
if ! git diff --quiet "$BAN_CU" "$BAN_MOI" -- package-lock.json package.json; then
  ghi "Danh sách thư viện có thay đổi, đang cài lại…"
  npm install --no-audit --no-fund >>"$NHAT_KY" 2>&1 || { ghi "LỖI: cài thư viện thất bại"; bao "❌ Chourmas: cài thư viện thất bại"; exit 1; }
else
  ghi "Thư viện không đổi, bỏ qua bước cài"
fi

# ---- Chuyển đổi cơ sở dữ liệu ----
npx prisma migrate deploy >>"$NHAT_KY" 2>&1 || { ghi "LỖI: chuyển đổi cơ sở dữ liệu thất bại"; bao "❌ Chourmas: chuyển đổi cơ sở dữ liệu thất bại. Web vẫn đang chạy bản cũ."; exit 1; }

# ---- Build ----
ghi "Đang build…"
if npm run build >>"$NHAT_KY" 2>&1; then
  pm2 restart "$TEN_PM2" >>"$NHAT_KY" 2>&1
  ghi "✅ Cập nhật xong, website đã chạy bản mới"
  bao "✅ Chourmas đã cập nhật: $MO_TA"
else
  # Build hỏng: quay về bản cũ đang chạy tốt
  ghi "LỖI: build thất bại. Đang quay về bản cũ ${BAN_CU:0:7}…"
  git reset --hard "$BAN_CU" -q

  if npm run build >>"$NHAT_KY" 2>&1; then
    pm2 restart "$TEN_PM2" >>"$NHAT_KY" 2>&1
    ghi "Đã quay về bản cũ, website vẫn chạy bình thường"
    bao "⚠️ Chourmas: bản mới build lỗi nên đã quay về bản cũ. Website vẫn bán hàng bình thường. Xem nhật ký: $NHAT_KY"
  else
    ghi "NGUY HIỂM: bản cũ cũng build lỗi. Cần kiểm tra ngay."
    bao "🚨 Chourmas: build lỗi cả bản mới lẫn bản cũ. CẦN KIỂM TRA NGAY máy chủ."
  fi
  exit 1
fi

# ---- Cắt bớt nhật ký cho khỏi phình ----
if [ -f "$NHAT_KY" ] && [ "$(wc -l <"$NHAT_KY")" -gt 3000 ]; then
  tail -n 1000 "$NHAT_KY" >"$NHAT_KY.tam" && mv "$NHAT_KY.tam" "$NHAT_KY"
fi
