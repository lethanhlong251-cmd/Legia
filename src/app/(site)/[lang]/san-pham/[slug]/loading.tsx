import { OXam } from "@/components/site/khung-xam";

/** Hiện trong lúc trang chi tiết sản phẩm đang lấy dữ liệu */
export default function DangTaiChiTiet() {
  return (
    <div className="khung py-6 sm:py-10">
      <OXam className="h-3 w-64" />

      <div className="mt-6 flex gap-2">
        <OXam className="h-6 w-24 rounded-full" />
        <OXam className="h-6 w-20 rounded-full" />
      </div>
      <OXam className="mt-4 h-9 w-72 max-w-full" />
      <OXam className="mt-3 h-4 w-96 max-w-full" />

      <div className="mt-9 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="aspect-square animate-pulse rounded-lg bg-kem-300" />
          <div className="mt-3 grid grid-cols-5 gap-2.5">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-md bg-kem-300"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <OXam className="h-10 w-48" />
          <div className="space-y-2.5">
            <OXam className="h-16 w-full rounded-lg" />
            <OXam className="h-16 w-full rounded-lg" />
            <OXam className="h-16 w-full rounded-lg" />
          </div>
          <OXam className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
