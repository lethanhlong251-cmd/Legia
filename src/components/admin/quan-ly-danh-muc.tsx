"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, Check, Plus, Trash2 } from "lucide-react";

import { luuDanhMuc, xoaDanhMuc } from "@/app/actions/quan-tri";

type DanhMuc = {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  soSanPham: number;
  capDo: number;
};

export function QuanLyDanhMuc({ danhSach }: { danhSach: DanhMuc[] }) {
  const router = useRouter();
  const [dangSua, setDangSua] = useState<DanhMuc | "moi" | null>(null);
  const [dangChay, batDau] = useTransition();
  const [thongBao, setThongBao] = useState<{ ok: boolean; chu: string } | null>(
    null,
  );

  function gui(formData: FormData) {
    batDau(async () => {
      const kq = await luuDanhMuc(formData);
      setThongBao(
        kq.ok
          ? { ok: true, chu: kq.thongBao ?? "Đã lưu." }
          : { ok: false, chu: kq.loi ?? "Có lỗi." },
      );
      if (kq.ok) {
        setDangSua(null);
        router.refresh();
      }
    });
  }

  async function xoa(dm: DanhMuc) {
    if (!window.confirm(`Xoá danh mục "${dm.nameVi}"?`)) return;
    const kq = await xoaDanhMuc(dm.id);
    setThongBao(
      kq.ok
        ? { ok: true, chu: kq.thongBao ?? "Đã xoá." }
        : { ok: false, chu: kq.loi ?? "Không xoá được." },
    );
    if (kq.ok) router.refresh();
  }

  const dangSuaLaMoi = dangSua === "moi";
  const duLieuSua = dangSuaLaMoi ? null : dangSua;

  return (
    <>
      {thongBao && (
        <div
          className={`mb-5 flex gap-2.5 rounded-md p-3.5 ${
            thongBao.ok
              ? "bg-emerald-50 text-emerald-800"
              : "bg-son-50 text-son-800"
          }`}
        >
          {thongBao.ok ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p className="text-[13px] leading-relaxed">{thongBao.chu}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Bảng danh mục */}
        <div className="overflow-hidden rounded-lg border border-kem-300 bg-white">
          <div className="flex items-center justify-between border-b border-kem-300 px-5 py-4">
            <h2 className="font-display text-lg text-muc-900">
              Cây danh mục ({danhSach.length})
            </h2>
            <button
              type="button"
              onClick={() => setDangSua("moi")}
              className="nut-phu !py-2 !text-[13px]"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm
            </button>
          </div>

          <ul className="divide-y divide-kem-200">
            {danhSach.map((dm) => (
              <li
                key={dm.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-kem-50"
              >
                <div
                  className="min-w-0 flex-1"
                  style={{ paddingLeft: `${dm.capDo * 20}px` }}
                >
                  <button
                    type="button"
                    onClick={() => setDangSua(dm)}
                    className="text-left font-medium text-son-700 hover:underline"
                  >
                    {dm.nameVi}
                  </button>
                  <p className="text-[11px] text-muc-500">
                    /{dm.slug} · {dm.soSanPham} sản phẩm
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    dm.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-kem-300 text-muc-600"
                  }`}
                >
                  {dm.isActive ? "Đang bật" : "Đang tắt"}
                </span>

                <button
                  type="button"
                  onClick={() => xoa(dm)}
                  className="shrink-0 rounded p-1.5 text-muc-400 transition-colors hover:bg-son-50 hover:text-son-700"
                  aria-label={`Xoá ${dm.nameVi}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Ô soạn */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {dangSua ? (
            <form
              action={gui}
              key={dangSuaLaMoi ? "moi" : duLieuSua?.id}
              className="space-y-5 rounded-lg border border-kem-300 bg-white p-6"
            >
              <h2 className="font-display text-lg text-muc-900">
                {dangSuaLaMoi ? "Thêm danh mục" : "Sửa danh mục"}
              </h2>

              {duLieuSua && (
                <input type="hidden" name="id" value={duLieuSua.id} />
              )}

              <div>
                <label htmlFor="dm-nameVi" className="nhan-o-nhap">
                  Tên (tiếng Việt) <span className="text-son-700">*</span>
                </label>
                <input
                  id="dm-nameVi"
                  name="nameVi"
                  defaultValue={duLieuSua?.nameVi ?? ""}
                  required
                  className="o-nhap"
                />
              </div>

              <div>
                <label htmlFor="dm-nameEn" className="nhan-o-nhap">
                  Tên (tiếng Anh)
                </label>
                <input
                  id="dm-nameEn"
                  name="nameEn"
                  defaultValue={duLieuSua?.nameEn ?? ""}
                  className="o-nhap"
                />
              </div>

              <div>
                <label htmlFor="dm-slug" className="nhan-o-nhap">
                  Đường dẫn
                </label>
                <input
                  id="dm-slug"
                  name="slug"
                  defaultValue={duLieuSua?.slug ?? ""}
                  placeholder="Để trống sẽ tự tạo từ tên"
                  className="o-nhap"
                />
              </div>

              <div>
                <label htmlFor="dm-parentId" className="nhan-o-nhap">
                  Nằm trong danh mục
                </label>
                <select
                  id="dm-parentId"
                  name="parentId"
                  defaultValue={duLieuSua?.parentId ?? ""}
                  className="o-nhap"
                >
                  <option value="">— Danh mục gốc —</option>
                  {danhSach
                    .filter((d) => d.id !== duLieuSua?.id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {"— ".repeat(d.capDo)}
                        {d.nameVi}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label htmlFor="dm-sortOrder" className="nhan-o-nhap">
                  Thứ tự
                </label>
                <input
                  id="dm-sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={duLieuSua?.sortOrder ?? 0}
                  className="o-nhap"
                />
              </div>

              <label className="flex cursor-pointer gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={duLieuSua?.isActive ?? true}
                  className="mt-0.5 h-4 w-4 accent-son-700"
                />
                <span>
                  <span className="block text-sm font-medium text-muc-800">
                    Hiện trên website
                  </span>
                  <span className="block text-[11px] text-muc-500">
                    Danh mục chưa có sản phẩm thì nên để tắt
                  </span>
                </span>
              </label>

              <div className="flex gap-3 border-t border-kem-300 pt-5">
                <button
                  type="submit"
                  disabled={dangChay}
                  className="nut-chinh flex-1"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setDangSua(null)}
                  className="nut-phu"
                >
                  Huỷ
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-lg border border-dashed border-kem-400 bg-kem-50 p-6 text-center">
              <p className="text-sm leading-relaxed text-muc-600">
                Bấm tên một danh mục để sửa, hoặc bấm <strong>Thêm</strong> để
                tạo danh mục mới.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-muc-500">
                Khi bạn bán thêm bột, dụng cụ hay khuôn bánh in, chỉ cần bật
                danh mục tương ứng lên là website tự hiện thêm mục đó.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
