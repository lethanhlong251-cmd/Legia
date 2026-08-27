import { batBuocDangNhap } from "@/lib/xac-thuc";
import { layCaiDat } from "@/lib/du-lieu";
import { KhungQuanTri } from "@/components/admin/khung-quan-tri";
import { MauCaiDat } from "@/components/admin/mau-cai-dat";
import { MauCaiDatSPX } from "@/components/admin/mau-cai-dat-spx";
import { MauDoiMatKhau } from "@/components/admin/mau-doi-mat-khau";

export const dynamic = "force-dynamic";

export default async function TrangCaiDat() {
  const nguoiDung = await batBuocDangNhap();
  const caiDat = await layCaiDat();

  const daCauHinhTelegram = Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
  );

  return (
    <KhungQuanTri
      tenNguoiDung={nguoiDung.ten}
      tieuDe="Cài đặt"
      moTa="Thông tin liên hệ hiện ở chân trang và trang Liên hệ của website"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <MauCaiDat banDau={caiDat} />

        <div className="space-y-6">
          <MauCaiDatSPX banDau={caiDat} />

          <MauDoiMatKhau />

          <section className="rounded-lg border border-kem-300 bg-white p-6">
            <h2 className="font-display text-lg text-muc-900">
              Thông báo đơn hàng qua Telegram
            </h2>

            {daCauHinhTelegram ? (
              <p className="mt-3 rounded-md bg-emerald-50 px-4 py-3 text-[13px] leading-relaxed text-emerald-800">
                Đã cấu hình xong. Mỗi đơn hàng mới sẽ được gửi ngay vào Telegram
                của bạn.
              </p>
            ) : (
              <>
                <p className="mt-3 rounded-md bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
                  Chưa cấu hình. Đơn hàng vẫn được lưu đầy đủ và bạn xem trong
                  mục Đơn hàng, chỉ là chưa có thông báo tự động.
                </p>

                <ol className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-muc-600">
                  <li className="flex gap-2.5">
                    <span className="font-semibold text-dong-600">1.</span>
                    Mở Telegram, tìm tài khoản{" "}
                    <strong className="text-muc-800">@BotFather</strong>, nhắn{" "}
                    <code className="rounded bg-kem-200 px-1.5">/newbot</code> và
                    làm theo hướng dẫn. Xong sẽ nhận được một chuỗi token.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-semibold text-dong-600">2.</span>
                    Tìm tài khoản{" "}
                    <strong className="text-muc-800">@userinfobot</strong>, nhắn{" "}
                    <code className="rounded bg-kem-200 px-1.5">/start</code> để
                    lấy số ID của bạn.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-semibold text-dong-600">3.</span>
                    Nhắn tin cho chính con bot vừa tạo một câu bất kỳ, để bot
                    được phép nhắn lại cho bạn.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-semibold text-dong-600">4.</span>
                    Điền hai giá trị đó vào file{" "}
                    <code className="rounded bg-kem-200 px-1.5">.env</code> trên
                    máy chủ, rồi khởi động lại website.
                  </li>
                </ol>

                <pre className="mt-4 overflow-x-auto rounded-md bg-muc-900 p-4 text-[12px] leading-relaxed text-kem-200">
                  {`TELEGRAM_BOT_TOKEN="token-tu-BotFather"
TELEGRAM_CHAT_ID="so-id-tu-userinfobot"`}
                </pre>
              </>
            )}
          </section>
        </div>
      </div>
    </KhungQuanTri>
  );
}
