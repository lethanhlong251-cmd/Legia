"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HIỆN DẦN KHI CUỘN TỚI
 * ---------------------
 * Nội dung nhích lên và rõ dần khi lọt vào tầm nhìn, chỉ chạy MỘT LẦN cho
 * mỗi khối — cuộn lên cuộn xuống mà cứ nhấp nháy lại thì rất khó chịu.
 *
 * Cố ý làm nhẹ tay: dịch 14 pixel trong 0,55 giây. Website bán hàng cao cấp,
 * hiệu ứng mạnh tay sẽ làm rẻ đi cảm giác thương hiệu.
 *
 * Phần ẩn/hiện nằm ở tệp globals.css chứ không phải ở đây, vì nó được đặt
 * trong khối "không bật giảm chuyển động". Nhờ vậy ai bật cài đặt giảm
 * chuyển động sẽ luôn thấy nội dung ngay, kể cả khi trình duyệt không chạy
 * được phần theo dõi cuộn trang.
 */
export function HienDan({
  children,
  /** Trễ thêm, tính bằng mili giây — dùng để các thẻ trong lưới hiện lệch nhau */
  tre = 0,
  className = "",
}: {
  children: React.ReactNode;
  tre?: number;
  className?: string;
}) {
  const khoi = useRef<HTMLDivElement>(null);
  const [daHien, setDaHien] = useState(false);

  useEffect(() => {
    const el = khoi.current;
    if (!el) return;

    const coTheoDoiCuon = typeof IntersectionObserver !== "undefined";
    let theoDoi: IntersectionObserver | null = null;

    if (coTheoDoiCuon) {
      theoDoi = new IntersectionObserver(
        ([muc]) => {
          if (!muc.isIntersecting) return;
          setDaHien(true);
          theoDoi?.disconnect();
        },
        { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
      );
      theoDoi.observe(el);
    }

    /**
     * Lưới an toàn: nếu sau 1,5 giây vẫn chưa có tín hiệu nào thì hiện luôn.
     * Có những trường hợp trình duyệt không phát tín hiệu cuộn — ví dụ tab
     * đang bị ẩn, hoặc trang mở trong khung nhúng. Thà mất hiệu ứng còn hơn
     * để khách nhìn vào một trang trống.
     *
     * Trình duyệt quá cũ không có công cụ theo dõi cuộn thì hiện ngay.
     */
    const luoiAnToan = setTimeout(
      () => setDaHien(true),
      coTheoDoiCuon ? 1500 : 0,
    );

    return () => {
      theoDoi?.disconnect();
      clearTimeout(luoiAnToan);
    };
  }, []);

  return (
    <div
      ref={khoi}
      style={{ transitionDelay: `${tre}ms` }}
      className={`hien-dan ${daHien ? "da-hien" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
