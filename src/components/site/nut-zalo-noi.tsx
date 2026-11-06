/**
 * Nút Zalo nổi ở góc màn hình.
 * Khách quen nhắn tin hơn là điền form, nên luôn để một lối chat trong tầm tay.
 */
export function NutZaloNoi({ zalo }: { zalo: string }) {
  const so = zalo.replace(/\D/g, "");
  if (!so) return null;

  return (
    <a
      href={`https://zalo.me/${so}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nhắn tin Zalo cho Chourmas"
      className="group fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] shadow-manh transition-transform duration-200 hover:scale-105 active:scale-95 lg:bottom-5"
    >
      {/* Vòng sóng nhấp nháy để thu hút chú ý */}
      <span className="absolute inset-0 animate-ping rounded-full bg-[#0068FF] opacity-20" />
      <svg viewBox="0 0 48 48" className="relative h-8 w-8" aria-hidden="true">
        <path
          fill="#fff"
          d="M24 8C14.6 8 7 14.5 7 22.5c0 4.6 2.5 8.7 6.4 11.3-.3 1.1-1.1 3.6-1.3 4.2-.2.8.3 1.1 1 .7.5-.3 3.6-2.1 5-3 1.8.5 3.8.8 5.9.8 9.4 0 17-6.5 17-14.5S33.4 8 24 8Z"
        />
        <text
          x="24"
          y="27"
          textAnchor="middle"
          fill="#0068FF"
          fontSize="11"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          Zalo
        </text>
      </svg>
    </a>
  );
}
