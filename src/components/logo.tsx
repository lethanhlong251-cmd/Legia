/**
 * LOGO CHOURMAS
 * -------------
 * Biểu tượng là một mặt khuôn bánh trung thu 8 cánh, bên trong là hoa sen 6 cánh.
 * Vẽ bằng SVG nên phóng to cỡ nào cũng nét, in ấn được, và đổi màu theo nền.
 *
 * Cách dùng:
 *   <Logo />                        → logo đầy đủ (biểu tượng + chữ)
 *   <Logo bien="tren-nen-toi" />    → dùng trên nền tối, ví dụ chân trang
 *   <BieuTuongKhuon className="..." /> → chỉ riêng biểu tượng
 */

type Bien = "mac-dinh" | "tren-nen-toi";

/** Biểu tượng mặt khuôn — dùng riêng cho favicon, avatar, tem dán */
export function BieuTuongKhuon({
  className,
  mauChinh = "currentColor",
  mauNhan = "#C8A24A",
}: {
  className?: string;
  mauChinh?: string;
  mauNhan?: string;
}) {
  // Hoa sen 6 cánh ở giữa, mỗi cánh xoay 60 độ
  const canhSen = Array.from({ length: 6 }, (_, i) => (
    <path
      key={i}
      d="M 0 0 C -7 -6, -6.5 -14, 0 -19 C 6.5 -14, 7 -6, 0 0 Z"
      transform={`rotate(${i * 60})`}
      fill={mauNhan}
      fillOpacity={i % 2 === 0 ? 0.95 : 0.6}
    />
  ));

  // Vòng 12 chấm giữa hai lớp cánh khuôn
  const vongCham = [
    [0, -37],
    [18.5, -32.04],
    [32.04, -18.5],
    [37, 0],
    [32.04, 18.5],
    [18.5, 32.04],
    [0, 37],
    [-18.5, 32.04],
    [-32.04, 18.5],
    [-37, 0],
    [-32.04, -18.5],
    [-18.5, -32.04],
  ];

  return (
    <svg
      viewBox="-50 -50 100 100"
      className={className}
      role="img"
      aria-label="Chourmas"
      fill="none"
    >
      {/* Cánh khuôn vòng ngoài */}
      <path
        d="M 16.84 -40.65 A 19 19 0 0 1 40.65 -16.84 A 19 19 0 0 1 40.65 16.84 A 19 19 0 0 1 16.84 40.65 A 19 19 0 0 1 -16.84 40.65 A 19 19 0 0 1 -40.65 16.84 A 19 19 0 0 1 -40.65 -16.84 A 19 19 0 0 1 -16.84 -40.65 A 19 19 0 0 1 16.84 -40.65 Z"
        stroke={mauChinh}
        strokeWidth={3.2}
        strokeLinejoin="round"
      />

      {/* Vòng chấm trang trí */}
      <g fill={mauNhan}>
        {vongCham.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.7} />
        ))}
      </g>

      {/* Cánh khuôn vòng trong */}
      <path
        d="M 11.48 -27.72 A 13 13 0 0 1 27.72 -11.48 A 13 13 0 0 1 27.72 11.48 A 13 13 0 0 1 11.48 27.72 A 13 13 0 0 1 -11.48 27.72 A 13 13 0 0 1 -27.72 11.48 A 13 13 0 0 1 -27.72 -11.48 A 13 13 0 0 1 -11.48 -27.72 A 13 13 0 0 1 11.48 -27.72 Z"
        stroke={mauChinh}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Hoa sen giữa khuôn */}
      {canhSen}

      {/* Nhuỵ sen */}
      <circle cx={0} cy={0} r={4.2} fill={mauChinh} />
      <circle cx={0} cy={0} r={1.8} fill={mauNhan} />
    </svg>
  );
}

export function Logo({
  bien = "mac-dinh",
  hienSlogan = true,
  className = "",
}: {
  bien?: Bien;
  hienSlogan?: boolean;
  className?: string;
}) {
  const toi = bien === "tren-nen-toi";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BieuTuongKhuon
        className="h-9 w-9 shrink-0"
        mauChinh={toi ? "#FAF6EF" : "#9E2B25"}
        mauNhan="#C8A24A"
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[19px] font-semibold tracking-[0.14em] ${
            toi ? "text-kem-100" : "text-son-700"
          }`}
        >
          CHOURMAS
        </span>
        {hienSlogan && (
          <span
            className={`mt-1 text-[8.5px] font-medium tracking-[0.22em] ${
              toi ? "text-dong-400" : "text-dong-600"
            }`}
          >
            ĐỘC QUYỀN HOA VĂN VIỆT
          </span>
        )}
      </span>
    </span>
  );
}
