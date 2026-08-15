"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Phone, RotateCw } from "lucide-react";

import { BieuTuongKhuon } from "@/components/logo";

/**
 * TRANG BÁO LỖI
 * -------------
 * Hiện ra khi có sự cố khiến trang không dựng được.
 *
 * Điều quan trọng nhất ở đây KHÔNG phải là báo lỗi, mà là **giữ khách lại**:
 * cho họ một nút thử lại và một số điện thoại để đặt hàng ngay cả khi
 * website đang trục trặc.
 */

const HOTLINE = process.env.NEXT_PUBLIC_HOTLINE || "0377497286";

export default function TrangLoi({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ghi lỗi ra nhật ký máy chủ để còn tìm được nguyên nhân
    console.error("Lỗi hiển thị trang:", error);
  }, [error]);

  return (
    <div className="khung flex flex-col items-center py-24 text-center sm:py-32">
      <BieuTuongKhuon className="h-14 w-14 opacity-40" mauChinh="#9E2B25" />

      <h1 className="mt-7 font-display text-2xl text-muc-900 sm:text-3xl">
        Trang này đang gặp trục trặc
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muc-600">
        Xin lỗi bạn, có gì đó không ổn ở phía chúng tôi chứ không phải do bạn.
        Bạn thử tải lại xem sao.
      </p>
      <p className="mt-1.5 max-w-md text-sm text-muc-500">
        Something went wrong on our side. Please try again.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="nut-chinh">
          <RotateCw className="h-4 w-4" />
          Thử lại
        </button>
        <Link href="/vi" className="nut-phu">
          Về trang chủ
        </Link>
      </div>

      {/* Lối thoát quan trọng nhất: khách vẫn đặt hàng được qua điện thoại */}
      <div className="mt-12 w-full max-w-md rounded-lg border border-dong-300 bg-dong-50 p-6">
        <p className="text-sm leading-relaxed text-muc-700">
          Bạn vẫn đặt hàng được bình thường. Gọi hoặc nhắn Zalo cho shop, chúng
          tôi chốt đơn giúp bạn ngay.
        </p>
        <a
          href={`tel:${HOTLINE}`}
          className="mt-4 inline-flex items-center gap-2 font-display text-2xl font-semibold text-son-700 hover:underline"
        >
          <Phone className="h-5 w-5" />
          {HOTLINE}
        </a>
      </div>

      {error.digest && (
        <p className="mt-8 text-[11px] text-muc-400">
          Mã lỗi: {error.digest}
        </p>
      )}
    </div>
  );
}
