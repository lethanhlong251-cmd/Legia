import {
  LuoiSanPhamDangCho,
  TieuDeTrangDangCho,
} from "@/components/site/khung-xam";

/** Hiện trong lúc trang danh sách đang lấy dữ liệu, ví dụ khi khách đổi bộ lọc */
export default function DangTaiDanhSach() {
  return (
    <>
      <TieuDeTrangDangCho />
      <div className="khung py-8 sm:py-10">
        <div className="h-[188px] animate-pulse rounded-lg bg-kem-200" />
        <div className="mt-6">
          <LuoiSanPhamDangCho soThe={8} />
        </div>
      </div>
    </>
  );
}
