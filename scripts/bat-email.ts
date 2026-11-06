/**
 * BẬT THÔNG BÁO ĐƠN HÀNG QUA EMAIL
 * --------------------------------
 * Chạy:  npm run bat-email
 *
 * Script tự làm những việc sau:
 *   1. Hỏi địa chỉ Gmail dùng để gửi
 *   2. Hỏi mật khẩu ứng dụng 16 ký tự lấy từ trang bảo mật Google
 *   3. Hỏi địa chỉ nhận thông báo
 *   4. Gửi thử một email, gửi được mới ghi vào .env
 *
 * Vì sao phải dùng "mật khẩu ứng dụng" chứ không phải mật khẩu Gmail
 * thường: Google đã chặn việc đăng nhập bằng mật khẩu thường từ chương
 * trình bên ngoài. Mật khẩu ứng dụng là một chuỗi riêng, chỉ dùng để gửi
 * thư, thu hồi lúc nào cũng được mà không ảnh hưởng tài khoản chính.
 */

import "dotenv/config";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { resolve } from "node:path";

import { guiEmail } from "../src/lib/email-goc.js";

const DUONG_DAN_ENV = resolve(process.cwd(), ".env");
const EMAIL_NHAN_MAC_DINH = "kiemtien25012000@gmail.com";

const hoi = createInterface({ input: process.stdin, output: process.stdout });

function ke() {
  console.log("─".repeat(56));
}

function laEmailHopLe(chuoi: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(chuoi);
}

/**
 * Ghi biến vào .env: có sẵn thì thay giá trị, chưa có thì thêm vào cuối.
 * Giữ nguyên mọi dòng khác, kể cả dòng ghi chú.
 */
function ghiVaoEnv(cacBien: Record<string, string>) {
  let noiDung = existsSync(DUONG_DAN_ENV)
    ? readFileSync(DUONG_DAN_ENV, "utf8")
    : "";

  if (existsSync(DUONG_DAN_ENV)) {
    copyFileSync(DUONG_DAN_ENV, `${DUONG_DAN_ENV}.sao-luu`);
  }

  for (const [ten, giaTri] of Object.entries(cacBien)) {
    const dongMoi = `${ten}="${giaTri}"`;
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

/** Dịch lỗi khó hiểu của Gmail sang lời khuyên cụ thể */
function giaiThichLoi(loi: unknown): string {
  const tin = loi instanceof Error ? loi.message : String(loi);
  const ma = (loi as { code?: string })?.code ?? "";

  if (tin.includes("Invalid login") || tin.includes("535")) {
    return [
      "Google từ chối đăng nhập.",
      "",
      "    Nguyên nhân hay gặp nhất:",
      "    • Dán nhầm mật khẩu Gmail thường thay vì mật khẩu ứng dụng",
      "    • Mật khẩu ứng dụng đã bị thu hồi",
      "    • Chưa bật Xác minh 2 bước cho tài khoản",
      "",
      "    Tạo lại mật khẩu ứng dụng tại:",
      "    https://myaccount.google.com/apppasswords",
    ].join("\n    ");
  }

  if (ma === "ETIMEDOUT" || ma === "ESOCKET" || ma === "ECONNECTION") {
    return [
      "Không kết nối được tới máy chủ thư của Google.",
      "",
      "    Kiểm tra lại mạng. Nếu đang dùng mạng công ty hoặc",
      "    trường học, cổng 465 có thể bị chặn — thử bằng 4G.",
    ].join("\n    ");
  }

  return tin;
}

async function main() {
  console.log("");
  ke();
  console.log("  BẬT THÔNG BÁO ĐƠN HÀNG QUA EMAIL");
  ke();
  console.log("");
  console.log("  Đây là kênh dự phòng cho Telegram. Email không bị nhà mạng");
  console.log("  chặn, nên dù Telegram trục trặc bạn vẫn nhận được đơn.");
  console.log("");
  ke();
  console.log("");
  console.log("  CHUẨN BỊ — làm 2 việc này trên trình duyệt trước:");
  console.log("");
  console.log("   1. Bật Xác minh 2 bước cho tài khoản Google (nếu chưa):");
  console.log("      https://myaccount.google.com/signinoptions/twosv");
  console.log("");
  console.log("   2. Tạo mật khẩu ứng dụng:");
  console.log("      https://myaccount.google.com/apppasswords");
  console.log("      Đặt tên bất kỳ, ví dụ 'Chourmas'. Google trả về một");
  console.log("      chuỗi 16 chữ cái dạng: abcd efgh ijkl mnop");
  console.log("");
  console.log("   Không tạo được mật khẩu ứng dụng thường là do chưa bật");
  console.log("   Xác minh 2 bước ở việc số 1.");
  console.log("");
  ke();
  console.log("");

  // --- Địa chỉ gửi ---
  const guiTu = (
    await hoi.question("  Gmail dùng để GỬI thông báo:\n  > ")
  ).trim();

  if (!laEmailHopLe(guiTu)) {
    console.log("\n  ✗ Địa chỉ email không hợp lệ. Dừng lại.\n");
    return;
  }

  if (!/@gmail\.com$/i.test(guiTu)) {
    console.log("");
    console.log("  ⚠ Địa chỉ này không phải Gmail.");
    console.log("    Script được viết cho Gmail (smtp.gmail.com).");
    const tiepTuc = (
      await hoi.question("    Vẫn muốn thử? (gõ 'co' để tiếp tục): ")
    ).trim();
    if (tiepTuc.toLowerCase() !== "co") {
      console.log("\n  Đã dừng.\n");
      return;
    }
  }

  // --- Mật khẩu ứng dụng ---
  console.log("");
  const matKhauTho = (
    await hoi.question(
      "  Mật khẩu ứng dụng 16 ký tự (dán cả khoảng trắng cũng được):\n  > ",
    )
  ).trim();

  const matKhau = matKhauTho.replace(/\s+/g, "");

  if (matKhau.length < 16) {
    console.log("");
    console.log("  ✗ Mật khẩu ứng dụng phải có 16 chữ cái.");
    console.log(`    Chuỗi bạn nhập chỉ có ${matKhau.length} ký tự.`);
    console.log("    Lấy lại tại: https://myaccount.google.com/apppasswords\n");
    return;
  }

  // --- Địa chỉ nhận ---
  console.log("");
  const nhanTho = (
    await hoi.question(
      `  Email NHẬN thông báo\n  (bấm Enter để dùng ${EMAIL_NHAN_MAC_DINH}):\n  > `,
    )
  ).trim();

  const nhan = nhanTho || EMAIL_NHAN_MAC_DINH;

  if (!laEmailHopLe(nhan)) {
    console.log("\n  ✗ Địa chỉ nhận không hợp lệ. Dừng lại.\n");
    return;
  }

  // --- Gửi thử ---
  console.log("");
  console.log(`  → Đang gửi email thử tới ${nhan}...`);
  console.log("    (có thể mất 10-20 giây)");

  try {
    await guiEmail(guiTu, matKhau, nhan, {
      code: "THU-NGHIEM",
      customerName: "Nguyễn Văn Thử (đơn giả)",
      phone: "0900000000",
      address: "123 Đường Thử Nghiệm, Quận 1, TP.HCM",
      province: "TP. Hồ Chí Minh",
      note: "Đây là email kiểm tra, KHÔNG phải đơn hàng thật.",
      total: 239000,
      items: [
        {
          productName: "Khuôn Sen tứ quý",
          variantLabel: "150g",
          quantity: 1,
          lineTotal: 239000,
        },
      ],
    });
  } catch (loi) {
    console.log("");
    console.log(`  ✗ Không gửi được: ${giaiThichLoi(loi)}`);
    console.log("");
    console.log("    Chưa ghi gì vào file .env. Sửa xong chạy lại:");
    console.log("      npm run bat-email");
    console.log("");
    process.exitCode = 1;
    return;
  }

  console.log("  ✓ Gửi được");

  // --- Ghi cấu hình ---
  console.log("\n  → Đang lưu cấu hình...");
  ghiVaoEnv({
    EMAIL_GUI_TU: guiTu,
    EMAIL_MAT_KHAU_UNG_DUNG: matKhau,
    EMAIL_NHAN: nhan,
  });
  console.log("  ✓ Đã lưu vào file .env");

  console.log("");
  ke();
  console.log("");
  console.log(`  XONG! Mở hộp thư ${nhan}`);
  console.log("  tìm email tiêu đề bắt đầu bằng [Đơn mới].");
  console.log("");
  console.log("  Không thấy thì xem trong mục Spam / Thư rác, rồi bấm");
  console.log("  'Báo không phải spam' để lần sau vào thẳng hộp thư chính.");
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
