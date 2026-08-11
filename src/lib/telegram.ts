import "server-only";

/**
 * GỬI THÔNG BÁO ĐƠN HÀNG QUA TELEGRAM
 * -----------------------------------
 * Cần hai giá trị trong file .env:
 *   TELEGRAM_BOT_TOKEN — lấy khi tạo bot với @BotFather
 *   TELEGRAM_CHAT_ID   — mã cuộc trò chuyện của bạn
 *
 * Chưa điền hai giá trị này thì hệ thống bỏ qua, đơn hàng VẪN được lưu
 * bình thường và bạn xem trong trang /admin.
 */

type ThongTinDon = {
  code: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string | null;
  total: number;
  items: { productName: string; variantLabel: string; quantity: number }[];
};

function thoat(chuoi: string) {
  // Telegram chế độ HTML chỉ cho vài thẻ, phải thoát ký tự đặc biệt
  return chuoi
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function guiThongBaoDonHang(don: ThongTinDon) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return { daGui: false, lyDo: "chua-cau-hinh" };

  const danhSachMon = don.items
    .map(
      (m) =>
        `• ${thoat(m.productName)} — ${thoat(m.variantLabel)} × ${m.quantity}`,
    )
    .join("\n");

  const noiDung = [
    "🥮 <b>ĐƠN HÀNG MỚI</b>",
    "",
    `<b>Mã đơn:</b> <code>${thoat(don.code)}</code>`,
    `<b>Khách:</b> ${thoat(don.customerName)}`,
    `<b>Điện thoại:</b> ${thoat(don.phone)}`,
    `<b>Địa chỉ:</b> ${thoat(don.address)}`,
    don.note ? `<b>Ghi chú:</b> ${thoat(don.note)}` : null,
    "",
    "<b>Sản phẩm:</b>",
    danhSachMon,
    "",
    `<b>Tổng tiền:</b> ${don.total.toLocaleString("vi-VN")}đ (COD, đã gồm ship)`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const phanHoi = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: noiDung,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        // Không để việc gửi thông báo làm chậm phản hồi cho khách
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!phanHoi.ok) {
      console.error("Telegram trả về lỗi:", await phanHoi.text());
      return { daGui: false, lyDo: "telegram-loi" };
    }
    return { daGui: true };
  } catch (loi) {
    console.error("Không gửi được thông báo Telegram:", loi);
    return { daGui: false, lyDo: "khong-ket-noi-duoc" };
  }
}
