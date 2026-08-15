"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCw } from "lucide-react";

import { BieuTuongKhuon } from "@/components/logo";

/**
 * TRANG BÁO LỖI CHO KHU QUẢN TRỊ.
 * Khác trang lỗi phía khách: ở đây hiện luôn nội dung lỗi, vì người đọc
 * là chủ shop và thông tin đó giúp báo lại cho người kỹ thuật nhanh hơn.
 */
export default function LoiQuanTri({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi trang quản trị:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-kem-200 px-4 text-center">
      <BieuTuongKhuon className="h-12 w-12 opacity-50" mauChinh="#9E2B25" />

      <h1 className="mt-6 font-display text-2xl text-muc-900">
        Trang quản trị gặp lỗi
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muc-600">
        Dữ liệu của bạn vẫn an toàn. Thử tải lại trang, nếu vẫn lỗi thì gửi
        phần thông tin bên dưới cho người phụ trách kỹ thuật.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="nut-chinh">
          <RotateCw className="h-4 w-4" />
          Thử lại
        </button>
        <Link href="/admin" className="nut-phu">
          Về trang tổng quan
        </Link>
      </div>

      <pre className="mt-8 max-w-xl overflow-x-auto rounded-lg border border-kem-400 bg-white p-4 text-left text-[12px] leading-relaxed text-muc-600">
        {error.message}
        {error.digest ? `\n\nMã lỗi: ${error.digest}` : ""}
      </pre>
    </div>
  );
}
