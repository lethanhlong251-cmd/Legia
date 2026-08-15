"use client";

/**
 * TRANG BÁO LỖI CUỐI CÙNG
 * -----------------------
 * Chỉ hiện khi lỗi nặng tới mức bố cục chung của website cũng không dựng
 * được. Lúc đó React thay thế toàn bộ trang bằng nội dung dưới đây, nên
 * file này phải tự chứa cả thẻ html và body, và không dùng được font hay
 * kiểu chữ của website.
 *
 * Vì vậy mọi màu sắc ở đây viết thẳng, không qua lớp thiết kế chung.
 */

const HOTLINE = process.env.NEXT_PUBLIC_HOTLINE || "0377497286";

export default function LoiToanTrang({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF6EF",
          color: "#2B211C",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "430px", textAlign: "center" }}>
          <svg viewBox="-50 -50 100 100" width="56" height="56" fill="none">
            <path
              d="M 16.84 -40.65 A 19 19 0 0 1 40.65 -16.84 A 19 19 0 0 1 40.65 16.84 A 19 19 0 0 1 16.84 40.65 A 19 19 0 0 1 -16.84 40.65 A 19 19 0 0 1 -40.65 16.84 A 19 19 0 0 1 -40.65 -16.84 A 19 19 0 0 1 -16.84 -40.65 A 19 19 0 0 1 16.84 -40.65 Z"
              stroke="#9E2B25"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <circle cx="0" cy="0" r="7" fill="#C8A24A" />
          </svg>

          <h1
            style={{
              margin: "22px 0 0",
              fontSize: "22px",
              fontWeight: 600,
              color: "#1A1310",
            }}
          >
            Website đang gặp sự cố
          </h1>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: "15px",
              lineHeight: 1.65,
              color: "#5A4C43",
            }}
          >
            Xin lỗi bạn. Bạn vẫn đặt hàng được bình thường bằng cách gọi hoặc
            nhắn Zalo cho shop.
          </p>

          <a
            href={`tel:${HOTLINE}`}
            style={{
              display: "inline-block",
              margin: "22px 0 0",
              fontSize: "26px",
              fontWeight: 700,
              color: "#9E2B25",
              textDecoration: "none",
            }}
          >
            {HOTLINE}
          </a>

          <div style={{ marginTop: "26px" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#9E2B25",
                color: "#FAF6EF",
                padding: "13px 26px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Thử lại
            </button>
          </div>

          {error.digest && (
            <p style={{ marginTop: "26px", fontSize: "11px", color: "#9C8B7E" }}>
              Mã lỗi: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
