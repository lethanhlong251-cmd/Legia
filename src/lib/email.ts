import "server-only";
import { guiEmail, type ThongTinDonEmail } from "@/lib/email-goc";

/**
 * GỬI THÔNG BÁO ĐƠN HÀNG QUA EMAIL
 * --------------------------------
 * Đây là kênh dự phòng cho Telegram. Nhà mạng Việt Nam thỉnh thoảng chặn
 * Telegram, còn email thì luôn vào được, nên bật cả hai cho chắc.
 *
 * Cần ba giá trị trong file .env — chạy `npm run bat-email` để điền tự động:
 *   EMAIL_GUI_TU            — địa chỉ Gmail dùng để gửi
 *   EMAIL_MAT_KHAU_UNG_DUNG — mật khẩu ứng dụng 16 ký tự của Gmail
 *   EMAIL_NHAN              — địa chỉ nhận thông báo đơn hàng
 *
 * Chưa điền thì hệ thống bỏ qua, đơn hàng VẪN được lưu bình thường và
 * bạn xem trong trang /admin.
 *
 * Phần dựng nội dung email nằm ở src/lib/email-goc.ts, để script kiểm tra
 * chạy bằng dòng lệnh dùng lại được đúng mẫu đó.
 */

export type KetQuaGuiEmail =
  | { daGui: true }
  | { daGui: false; lyDo: string; chiTiet?: string };

export async function guiEmailDonHang(
  don: ThongTinDonEmail,
): Promise<KetQuaGuiEmail> {
  const guiTu = process.env.EMAIL_GUI_TU;
  const matKhau = process.env.EMAIL_MAT_KHAU_UNG_DUNG;
  const nhan = process.env.EMAIL_NHAN;

  if (!guiTu || !matKhau || !nhan) {
    return { daGui: false, lyDo: "chua-cau-hinh" };
  }

  try {
    await guiEmail(guiTu, matKhau, nhan, don);
    return { daGui: true };
  } catch (loi) {
    const chiTiet = loi instanceof Error ? loi.message : String(loi);
    console.error("Không gửi được email đơn hàng:", chiTiet);
    return { daGui: false, lyDo: "gui-that-bai", chiTiet };
  }
}
