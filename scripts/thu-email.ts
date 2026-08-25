/**
 * KIỂM TRA THÔNG BÁO EMAIL
 * ------------------------
 * Chạy:  npm run thu-email
 *
 * Gửi một email đơn hàng giả bằng đúng cấu hình đang có trong .env,
 * dùng đúng mẫu email mà website thật gửi đi.
 */

import "dotenv/config";
import { guiEmail } from "../src/lib/email-goc.js";

function ke() {
  console.log("─".repeat(56));
}

async function main() {
  console.log("");
  ke();
  console.log("  KIỂM TRA THÔNG BÁO EMAIL");
  ke();
  console.log("");

  const guiTu = process.env.EMAIL_GUI_TU;
  const matKhau = process.env.EMAIL_MAT_KHAU_UNG_DUNG;
  const nhan = process.env.EMAIL_NHAN;

  console.log(`  Gửi từ  : ${guiTu || "CHƯA CÓ"}`);
  console.log(
    `  Mật khẩu: ${matKhau ? `đã có (${matKhau.length} ký tự)` : "CHƯA CÓ"}`,
  );
  console.log(`  Gửi tới : ${nhan || "CHƯA CÓ"}`);
  console.log("");

  if (!guiTu || !matKhau || !nhan) {
    console.log("  ✗ Chưa cấu hình xong.");
    console.log("    Chạy:  npm run bat-email");
    console.log("");
    console.log("    Khi chưa cấu hình, đơn hàng của khách VẪN được lưu");
    console.log("    đầy đủ, bạn xem tại trang /admin.");
    console.log("");
    return;
  }

  console.log("  → Đang gửi email thử... (có thể mất 10-20 giây)");

  try {
    await guiEmail(guiTu, matKhau, nhan, {
      code: "THU-NGHIEM",
      customerName: "Nguyễn Văn Thử (đơn giả)",
      phone: "0900000000",
      address: "123 Đường Thử Nghiệm, Quận 1, TP.HCM",
      province: "TP. Hồ Chí Minh",
      note: "Đây là email kiểm tra, KHÔNG phải đơn hàng thật.",
      total: 478000,
      items: [
        {
          productName: "Khuôn Sen tứ quý",
          variantLabel: "150g",
          quantity: 1,
          lineTotal: 239000,
        },
        {
          productName: "Khuôn Bộ ngũ hoa",
          variantLabel: "200g",
          quantity: 1,
          lineTotal: 239000,
        },
      ],
    });
  } catch (loi) {
    const tin = loi instanceof Error ? loi.message : String(loi);
    console.log("");
    console.log("  ✗ KHÔNG GỬI ĐƯỢC");
    console.log(`    ${tin}`);
    console.log("");
    if (tin.includes("Invalid login") || tin.includes("535")) {
      console.log("    Mật khẩu ứng dụng có thể đã bị thu hồi.");
      console.log("    Chạy lại:  npm run bat-email");
    } else {
      console.log("    Kiểm tra lại mạng, hoặc thử bằng 4G.");
    }
    console.log("");
    console.log("    Đơn hàng của khách vẫn được lưu đầy đủ ở trang /admin.");
    console.log("");
    ke();
    console.log("");
    process.exitCode = 1;
    return;
  }

  console.log("");
  console.log(`  ✓ GỬI ĐƯỢC. Mở hộp thư ${nhan}`);
  console.log("    tìm email tiêu đề bắt đầu bằng [Đơn mới].");
  console.log("");
  console.log("    Không thấy thì xem mục Spam / Thư rác.");
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
