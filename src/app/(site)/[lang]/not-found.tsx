import Link from "next/link";
import { BieuTuongKhuon } from "@/components/logo";

export default function KhongTimThay() {
  return (
    <div className="khung flex flex-col items-center py-24 text-center sm:py-32">
      <BieuTuongKhuon className="h-16 w-16 opacity-40" mauChinh="#9E2B25" />
      <p className="mt-7 font-display text-5xl text-son-700">404</p>
      <h1 className="mt-4 font-display text-2xl text-muc-900">
        Không tìm thấy trang này
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muc-600">
        Trang bạn tìm không tồn tại hoặc đã được chuyển đi nơi khác.
        <br />
        <span className="text-muc-500">
          The page you are looking for does not exist or has moved.
        </span>
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/vi/san-pham" className="nut-chinh">
          Xem bộ sưu tập khuôn
        </Link>
        <Link href="/vi" className="nut-phu">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
