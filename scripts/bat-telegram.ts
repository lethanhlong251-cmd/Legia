/**
 * BẬT THÔNG BÁO ĐƠN HÀNG QUA TELEGRAM
 * -----------------------------------
 * Chạy:  npm run bat-telegram
 *
 * Script tự làm những việc sau:
 *   1. Hỏi mã bot (token) mà bạn lấy từ @BotFather
 *   2. Tự tìm mã cuộc trò chuyện (chat ID) của bạn
 *   3. Ghi cả hai vào file .env
 *   4. Gửi một tin nhắn thử để xác nhận đã chạy
 *
 * File .env không bao giờ được đưa lên GitHub, nên chạy script này trên
 * máy nào thì chỉ máy đó nhận thông báo. Khi lên máy chủ thật, chạy lại
 * script này một lần nữa trên máy chủ.
 */

import "dotenv/config";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { resolve } from "node:path";

const DUONG_DAN_ENV = resolve(process.cwd(), ".env");

const hoi = createInterface({ input: process.stdin, output: process.stdout });

/** In một dòng kẻ ngang cho dễ nhìn */
function ke() {
  console.log("─".repeat(56));
}

/**
 * Ghi một biến vào file .env.
 * Có sẵn dòng đó thì thay giá trị, chưa có thì thêm vào cuối.
 * Giữ nguyên mọi dòng khác, kể cả ghi chú.
 */
function ghiVaoEnv(cacBien: Record<string, string>) {
  let noiDung = existsSync(DUONG_DAN_ENV)
    ? readFileSync(DUONG_DAN_ENV, "utf8")
    : "";

  // Sao lưu trước khi sửa, phòng khi có sự cố
  if (existsSync(DUONG_DAN_ENV)) {
    copyFileSync(DUONG_DAN_ENV, `${DUONG_DAN_ENV}.sao-luu`);
  }

  for (const [ten, giaTri] of Object.entries(cacBien)) {
    const dongMoi = `${ten}="${giaTri}"`;
    // Bắt cả dòng đang để trống lẫn dòng đã có giá trị
    const mauTim = new RegExp(`^${ten}=.*$`, "m");

    if (mauTim.test(noiDung)) {
      noiDung = noiDung.replace(mauTim, dongMoi);
    } else {
      if (noiDung.length > 0 && !noiDung.endsWith("\n")) noiDung += "\n";
      noiDung += `${dongMoi}\n`;
    }
  }

  writeFileSync(DUONG_DAN_ENV, noiDung, "utf8");
}

/** Gọi Telegram, trả về dữ liệu hoặc ném lỗi có lời giải thích tiếng Việt */
async function goiTelegram(token: string, phuongThuc: string, than?: unknown) {
  let phanHoi: Response;
  try {
    phanHoi = await fetch(`https://api.telegram.org/bot${token}/${phuongThuc}`, {
      method: than ? "POST" : "GET",
      headers: than ? { "Content-Type": "application/json" } : undefined,
      body: than ? JSON.stringify(than) : undefined,
      signal: AbortSignal.timeout(30000),
    });
  } catch (loi) {
    // In ra lý do thật, vì mỗi nguyên nhân có cách xử lý khác nhau
    const gocRe = (loi as { cause?: { code?: string } })?.cause;
    const ma = gocRe?.code ?? (loi as Error)?.name ?? "";

    let giaiThich: string;
    if (ma === "ENOTFOUND" || ma === "EAI_AGAIN") {
      giaiThich =
        "Máy không tra được địa chỉ api.telegram.org.\n" +
        "    Thường là do nhà mạng chặn Telegram, hoặc máy đang mất mạng.";
    } else if (ma === "TimeoutError" || ma === "ETIMEDOUT") {
      giaiThich =
        "Gọi tới Telegram nhưng chờ mãi không thấy trả lời.\n" +
        "    Thường là do nhà mạng chặn Telegram.";
    } else if (ma === "ECONNREFUSED" || ma === "ECONNRESET") {
      giaiThich =
        "Kết nối tới Telegram bị ngắt giữa chừng.\n" +
        "    Thường là do nhà mạng chặn Telegram.";
    } else {
      giaiThich = `Lỗi mạng: ${ma || String(loi)}`;
    }

    throw new Error(
      `Không kết nối được tới Telegram.\n\n    ${giaiThich}\n\n` +
        "    Cách kiểm tra: chạy lệnh này trong Terminal\n" +
        "      curl -sS -m 15 https://api.telegram.org\n\n" +
        "    • Hiện chữ gì đó → mạng bình thường, báo lại cho tôi\n" +
        "    • Báo lỗi hoặc treo → nhà mạng đang chặn Telegram",
    );
  }

  const ketQua = (await phanHoi.json()) as {
    ok: boolean;
    result?: unknown;
    description?: string;
  };

  if (!ketQua.ok) {
    if (phanHoi.status === 401) {
      throw new Error(
        "Mã bot không đúng. Kiểm tra lại chuỗi bạn copy từ @BotFather.",
      );
    }
    throw new Error(`Telegram báo lỗi: ${ketQua.description ?? "không rõ"}`);
  }

  return ketQua.result;
}

async function main() {
  console.log("");
  ke();
  console.log("  BẬT THÔNG BÁO ĐƠN HÀNG QUA TELEGRAM");
  ke();
  console.log("");
  console.log("  Trước khi tiếp tục, làm 3 việc này trên Telegram:");
  console.log("");
  console.log("   1. Tìm tài khoản  @BotFather  rồi bấm Start");
  console.log("   2. Gửi lệnh  /newbot  và đặt tên cho bot");
  console.log("      (tên đăng nhập của bot phải kết thúc bằng chữ 'bot',");
  console.log("       ví dụ: chourmas_donhang_bot)");
  console.log("   3. BotFather trả về một chuỗi dài dạng");
  console.log("      1234567890:AAH... — đó là MÃ BOT");
  console.log("");
  ke();
  console.log("");

  const token = (await hoi.question("  Dán MÃ BOT vào đây rồi bấm Enter:\n  > "))
    .trim();

  if (!token) {
    console.log("\n  Bạn chưa nhập gì. Dừng lại.\n");
    return;
  }

  if (!/^\d+:[A-Za-z0-9_-]{30,}$/.test(token)) {
    console.log("");
    console.log("  ✗ Chuỗi này không giống mã bot.");
    console.log("    Mã bot có dạng: 1234567890:AAHdqTcvCH1vGWJxfSeofSAs...");
    console.log("    Copy lại từ tin nhắn của @BotFather rồi chạy lại.\n");
    return;
  }

  // --- Kiểm tra mã bot có thật không ---
  console.log("\n  → Đang kiểm tra mã bot...");
  const thongTinBot = (await goiTelegram(token, "getMe")) as {
    username: string;
    first_name: string;
  };
  console.log(`  ✓ Đã nhận ra bot: @${thongTinBot.username}`);

  // --- Tìm chat ID ---
  console.log("");
  ke();
  console.log("");
  console.log("  Việc cuối cùng: mở Telegram, tìm bot vừa tạo");
  console.log(`  ( @${thongTinBot.username} ), bấm START rồi nhắn cho nó`);
  console.log("  một tin nhắn bất kỳ — gõ chữ 'chào' cũng được.");
  console.log("");
  console.log("  Bước này để bot biết phải gửi thông báo cho ai.");
  console.log("");
  await hoi.question("  Nhắn xong rồi thì bấm Enter...");

  console.log("\n  → Đang tìm cuộc trò chuyện của bạn...");

  let chatId: string | null = null;
  let tenNguoiNhan = "";

  // Thử lại vài lần, vì tin nhắn có thể chưa kịp tới Telegram
  for (let lan = 1; lan <= 6; lan++) {
    const capNhat = (await goiTelegram(token, "getUpdates")) as {
      message?: {
        chat: { id: number; first_name?: string; title?: string };
      };
    }[];

    // Lấy tin nhắn mới nhất
    const tinCuoi = [...capNhat].reverse().find((c) => c.message?.chat?.id);

    if (tinCuoi?.message) {
      chatId = String(tinCuoi.message.chat.id);
      tenNguoiNhan =
        tinCuoi.message.chat.first_name ?? tinCuoi.message.chat.title ?? "bạn";
      break;
    }

    if (lan < 6) {
      console.log(`    Chưa thấy tin nhắn, thử lại (${lan}/5)...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  if (!chatId) {
    console.log("");
    console.log("  ✗ Không tìm thấy tin nhắn nào gửi tới bot.");
    console.log("");
    console.log("    Kiểm tra lại:");
    console.log(`    • Đã tìm đúng @${thongTinBot.username} chưa?`);
    console.log("    • Đã bấm nút START trong cửa sổ chat chưa?");
    console.log("    • Đã gửi ít nhất một tin nhắn chưa?");
    console.log("");
    console.log("    Làm xong thì chạy lại:  npm run bat-telegram\n");
    return;
  }

  console.log(`  ✓ Tìm thấy: ${tenNguoiNhan}`);

  // --- Ghi vào .env ---
  console.log("\n  → Đang lưu cấu hình...");
  ghiVaoEnv({
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_CHAT_ID: chatId,
  });
  console.log("  ✓ Đã lưu vào file .env");

  // --- Gửi tin nhắn thử ---
  console.log("\n  → Đang gửi tin nhắn thử...");
  await goiTelegram(token, "sendMessage", {
    chat_id: chatId,
    parse_mode: "HTML",
    text: [
      "✅ <b>Thông báo đơn hàng đã được bật</b>",
      "",
      "Từ giờ mỗi khi có khách đặt hàng trên website Chourmas,",
      "bạn sẽ nhận được tin nhắn tại đây kèm đầy đủ:",
      "",
      "• Mã đơn",
      "• Tên và số điện thoại khách",
      "• Địa chỉ giao hàng",
      "• Sản phẩm và tổng tiền",
      "",
      "<i>Đây là tin nhắn thử, không phải đơn hàng thật.</i>",
    ].join("\n"),
  });

  console.log("  ✓ Đã gửi");
  console.log("");
  ke();
  console.log("");
  console.log("  XONG! Mở Telegram xem tin nhắn thử vừa tới.");
  console.log("");
  console.log("  Lưu ý: nếu website đang chạy, phải tắt và bật lại");
  console.log("  ( Ctrl + C rồi chạy lại ) thì cấu hình mới có hiệu lực.");
  console.log("");
  ke();
  console.log("");
}

main()
  .catch((loi: unknown) => {
    console.log("");
    console.log(`  ✗ ${loi instanceof Error ? loi.message : String(loi)}`);
    console.log("");
    process.exitCode = 1;
  })
  .finally(() => hoi.close());
