/**
 * KHUNG XÁM CHỜ TẢI
 * -----------------
 * Những mảng xám mô phỏng đúng bố cục trang sắp hiện ra. Khách thấy trang
 * đang dựng chứ không phải màn hình trắng, nên cảm giác nhanh hơn hẳn dù
 * thời gian thật không đổi.
 */

function OXam({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-kem-300 ${className}`} />;
}

/** Khung chờ cho một thẻ sản phẩm */
export function TheSanPhamDangCho() {
  return (
    <div className="overflow-hidden rounded-lg border border-kem-300 bg-white">
      <div className="aspect-square animate-pulse bg-kem-300" />
      <div className="space-y-2.5 p-4">
        <OXam className="h-2.5 w-20" />
        <OXam className="h-4 w-3/4" />
        <OXam className="h-3 w-full" />
        <OXam className="mt-3 h-5 w-24" />
      </div>
    </div>
  );
}

/** Khung chờ cho một lưới sản phẩm */
export function LuoiSanPhamDangCho({ soThe = 8 }: { soThe?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: soThe }, (_, i) => (
        <TheSanPhamDangCho key={i} />
      ))}
    </div>
  );
}

/** Khung chờ cho phần tiêu đề đầu trang */
export function TieuDeTrangDangCho() {
  return (
    <div className="border-b border-kem-300 bg-kem-200">
      <div className="khung space-y-4 py-12 sm:py-16">
        <OXam className="h-9 w-64 bg-kem-400" />
        <OXam className="h-4 w-96 max-w-full bg-kem-400" />
        <OXam className="h-8 w-72 max-w-full rounded-full bg-kem-400" />
      </div>
    </div>
  );
}

export { OXam };
