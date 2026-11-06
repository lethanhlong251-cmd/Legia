import nodemailer from "nodemailer";

/**
 * PHẦN LÕI CỦA VIỆC GỬI EMAIL
 * ---------------------------
 * File này cố tình KHÔNG gắn nhãn "server-only", để các script chạy bằng
 * dòng lệnh (npm run bat-email, npm run thu-email) dùng lại được y hệt
 * mẫu email mà website thật gửi đi. Nhờ vậy thử thành công là chắc chắn
 * đơn thật cũng gửi đúng như thế.
 *
 * File đọc biến môi trường và gọi hàm này là src/lib/email.ts.
 */

export type ThongTinDonEmail = {
  code: string;
  customerName: string;
  phone: string;
  address: string;
  province?: string | null;
  note?: string | null;
  total: number;
  items: {
    productName: string;
    variantLabel: string;
    quantity: number;
    lineTotal: number;
  }[];
};

/** Thoát ký tự đặc biệt để nội dung khách nhập không phá vỡ HTML của email */
function thoat(chuoi: string) {
  return chuoi
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tien(so: number) {
  return `${so.toLocaleString("vi-VN")}đ`;
}

/** Tạo kết nối tới máy chủ gửi thư của Google */
export function taoKetNoiEmail(guiTu: string, matKhau: string) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: guiTu,
      // Gmail hiển thị mật khẩu ứng dụng theo nhóm 4 chữ cách nhau,
      // nhưng khi dùng phải bỏ hết khoảng trắng
      pass: matKhau.replace(/\s+/g, ""),
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });
}

/** Dựng tiêu đề và nội dung email từ thông tin đơn hàng */
export function dungNoiDungEmail(don: ThongTinDonEmail) {
  const dongSanPham = don.items
    .map(
      (m) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e9dccb">
          ${thoat(m.productName)}<br>
          <span style="color:#7a6a5f;font-size:13px">${thoat(m.variantLabel)}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e9dccb;text-align:center">
          ${m.quantity}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e9dccb;text-align:right;white-space:nowrap">
          ${tien(m.lineTotal)}
        </td>
      </tr>`,
    )
    .join("");

  const dongPhu = (nhan: string, giaTri: string) => `
      <tr>
        <td style="padding:6px 0;color:#7a6a5f;width:120px;vertical-align:top">${nhan}</td>
        <td style="padding:6px 0;color:#2b211c;font-weight:600">${giaTri}</td>
      </tr>`;

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#faf6ef;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e9dccb;border-radius:12px;overflow:hidden">

      <div style="background:#9e2b25;padding:20px 24px">
        <div style="color:#fefdfb;font-size:19px;font-weight:700">🥮 ĐƠN HÀNG MỚI</div>
        <div style="color:#f6d0cd;font-size:13px;margin-top:4px">Mã đơn: ${thoat(don.code)}</div>
      </div>

      <div style="padding:20px 24px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${dongPhu("Khách hàng", thoat(don.customerName))}
          ${dongPhu("Điện thoại", `<a href="tel:${thoat(don.phone)}" style="color:#9e2b25;text-decoration:none">${thoat(don.phone)}</a>`)}
          ${dongPhu("Địa chỉ", thoat(don.address))}
          ${don.province ? dongPhu("Tỉnh/Thành", thoat(don.province)) : ""}
          ${don.note ? dongPhu("Ghi chú", thoat(don.note)) : ""}
        </table>

        <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px">
          <thead>
            <tr style="background:#f4ede1">
              <th style="padding:10px 12px;text-align:left;font-size:12px;letter-spacing:.05em;color:#5a4c43">SẢN PHẨM</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#5a4c43">SL</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#5a4c43">THÀNH TIỀN</th>
            </tr>
          </thead>
          <tbody>${dongSanPham}</tbody>
        </table>

        <div style="margin-top:16px;padding-top:14px;border-top:2px solid #9e2b25;text-align:right">
          <span style="color:#5a4c43;font-size:14px">Tổng cộng: </span>
          <span style="color:#9e2b25;font-size:20px;font-weight:700">${tien(don.total)}</span>
          <div style="color:#7a6a5f;font-size:12px;margin-top:4px">
            Thu tiền khi giao hàng (COD), đã gồm phí vận chuyển
          </div>
        </div>
      </div>

    </div>
  </div>`;

  // Bản chữ thuần, cho ứng dụng mail nào không hiện được HTML
  const chuThuan = [
    `ĐƠN HÀNG MỚI — ${don.code}`,
    "",
    `Khách hàng: ${don.customerName}`,
    `Điện thoại: ${don.phone}`,
    `Địa chỉ: ${don.address}`,
    don.province ? `Tỉnh/Thành: ${don.province}` : null,
    don.note ? `Ghi chú: ${don.note}` : null,
    "",
    "Sản phẩm:",
    ...don.items.map(
      (m) =>
        `- ${m.productName} (${m.variantLabel}) x${m.quantity} = ${tien(m.lineTotal)}`,
    ),
    "",
    `Tổng cộng: ${tien(don.total)} (COD, đã gồm ship)`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    // Tiêu đề để sẵn tên khách và tổng tiền, nhìn danh sách mail là biết ngay
    tieuDe: `[Đơn mới] ${don.code} — ${don.customerName} — ${tien(don.total)}`,
    html,
    chuThuan,
  };
}

/** Gửi thật. Ném lỗi nếu không gửi được, nơi gọi tự quyết định xử lý sao. */
export async function guiEmail(
  guiTu: string,
  matKhau: string,
  nhan: string,
  don: ThongTinDonEmail,
) {
  const { tieuDe, html, chuThuan } = dungNoiDungEmail(don);
  const ketNoi = taoKetNoiEmail(guiTu, matKhau);

  await ketNoi.sendMail({
    from: `"Chourmas — Đơn hàng" <${guiTu}>`,
    to: nhan,
    subject: tieuDe,
    text: chuThuan,
    html,
  });
}
