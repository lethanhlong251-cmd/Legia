/**
 * KIỂM TRA THÔNG BÁO TELEGRAM
 * ---------------------------
 * Chạy:  npm run thu-telegram
 *
 * Gửi một tin nhắn thử bằng đúng cấu hình đang có trong file .env,
 * để biết chắc khi có đơn hàng thật thì thông báo có tới hay không.
 *
 * Ghi chú kỹ thuật: không import trực tiếp src/lib/telegram.ts được,
 * vì file đó gắn nhãn "server-only" — chỉ chạy được bên trong Next.js.
 * Nên phần gọi Telegram dưới đây viết lại y hệt, dùng chung hai biến
 * môi trường và cùng cách gửi.
 */

import "dotenv/config";

function ke() {
  console.log("─".repeat(56));
}

async function main() {
  console.log("");
  ke();
  console.log("  KIỂM TRA THÔNG BÁO TELEGRAM");
  ke();
  console.log("");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log(
    `  Mã bot        : ${token ? `đã có (${token.length} ký tự)` : "CHƯA CÓ"}`,
  );
  console.log(`  Mã trò chuyện : ${chatId ? `đã có (${chatId})` : "CHƯA CÓ"}`);
  console.log("");

  if (!token || !chatId) {
    console.log("  ✗ Chưa cấu hình xong.");
    console.log("    Chạy:  npm run bat-telegram");
    console.log("");
    console.log("    Khi chưa cấu hình, đơn hàng của khách VẪN được lưu");
    console.log("    đầy đủ, bạn xem tại trang /admin. Chỉ là không có");
    console.log("    tin nhắn báo về máy.");
    console.log("");
    return;
  }

  console.log("  → Đang gửi một đơn hàng giả để thử...");

  const noiDung = [
    "🥮 <b>ĐƠN HÀNG MỚI</b>",
    "",
    "<b>Mã đơn:</b> <code>THU-NGHIEM</code>",
    "<b>Khách:</b> Nguyễn Văn Thử (đơn giả)",
    "<b>Điện thoại:</b> 0900000000",
    "<b>Địa chỉ:</b> 123 Đường Thử Nghiệm, Quận 1, TP.HCM",
    "<b>Ghi chú:</b> Đây là tin nhắn kiểm tra, KHÔNG phải đơn hàng thật.",
    "",
    "<b>Sản phẩm:</b>",
    "• Khuôn Sen tứ quý — 150g × 1",
    "",
    "<b>Tổng tiền:</b> 239.000đ (COD, đã gồm ship)",
  ].join("\n");

  let phanHoi: Response;
  try {
    phanHoi = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: noiDung,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(30000),
    });
  } catch (loi) {
    const ma =
      (loi as { cause?: { code?: string } })?.cause?.code ??
      (loi as Error)?.name ??
      "";
    console.log("");
    console.log(`  ✗ KHÔNG GỬI ĐƯỢC — máy không gọi được tới Telegram (${ma})`);
    console.log("");
    console.log("    Thường là do nhà mạng chặn Telegram.");
    console.log("    Thử lại bằng 4G điện thoại hoặc bật VPN.");
    console.log("");
    console.log("    Lưu ý: máy chủ thật đặt ở nước ngoài nên vẫn gửi được,");
    console.log("    lỗi này chỉ xảy ra khi chạy từ máy ở Việt Nam.");
    console.log("");
    console.log("    Dù thế nào, đơn hàng của khách vẫn được lưu đầy đủ");
    console.log("    và xem được ở trang /admin.");
    console.log("");
    ke();
    console.log("");
    process.exitCode = 1;
    return;
  }

  const ketQua = (await phanHoi.json()) as {
    ok: boolean;
    description?: string;
  };

  console.log("");

  if (ketQua.ok) {
    console.log("  ✓ GỬI ĐƯỢC. Mở Telegram xem tin nhắn vừa tới.");
    console.log("");
    console.log("    Nghĩa là khi có đơn thật, thông báo sẽ tới đúng như vậy");
    console.log("    — miễn là website đã được bật lại sau khi cấu hình.");
  } else {
    console.log(`  ✗ Telegram từ chối: ${ketQua.description ?? "không rõ"}`);
    console.log("");
    console.log("    Có thể mã bot đã bị thu hồi, hoặc bạn đã chặn/xoá");
    console.log("    cuộc trò chuyện với bot.");
    console.log("    Chạy lại:  npm run bat-telegram");
    console.log("");
    console.log("    Đơn hàng của khách vẫn được lưu đầy đủ ở trang /admin.");
    process.exitCode = 1;
  }

  console.log("");
  ke();
  console.log("");
}

main().catch((loi: unknown) => {
  console.log("");
  console.log(`  ✗ ${loi instanceof Error ? loi.message : String(loi)}`);
  console.log("");
  process.exitCode = 1;
});
