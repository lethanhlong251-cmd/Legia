"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import {
  datAnhDaiDien,
  luuSanPham,
  taiAnhLen,
  xoaAnh,
  xoaSanPham,
} from "@/app/actions/quan-tri";
import { dinhDangTien, taoSlug } from "@/lib/dinh-dang";

type BienThe = {
  id?: string;
  labelVi: string;
  labelEn: string;
  price: number;
  comparePrice: number | null;
  noteVi: string;
  noteEn: string;
  inStock: boolean;
  isAccessory: boolean;
};

type Anh = { id: string; url: string; isMain: boolean };

export type SanPhamSoan = {
  id?: string;
  sku: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  shortDescVi: string;
  shortDescEn: string;
  descVi: string;
  descEn: string;
  categoryId: string;
  faceCount: number | null;
  diameter: string;
  material: string;
  patterns: string;
  noteVi: string;
  noteEn: string;
  isExclusive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  inStock: boolean;
  sortOrder: number;
  variants: BienThe[];
  images: Anh[];
};

const BIEN_THE_TRONG: BienThe = {
  labelVi: "",
  labelEn: "",
  price: 0,
  comparePrice: null,
  noteVi: "",
  noteEn: "",
  inStock: true,
  isAccessory: false,
};

export function SoanSanPham({
  banDau,
  danhMuc,
}: {
  banDau: SanPhamSoan;
  danhMuc: { id: string; nameVi: string; capDo: number }[];
}) {
  const router = useRouter();
  const [sp, setSp] = useState<SanPhamSoan>(banDau);
  const [dangLuu, batDauLuu] = useTransition();
  const [dangTaiAnh, batDauTaiAnh] = useTransition();
  const [thongBao, setThongBao] = useState<{ ok: boolean; chu: string } | null>(
    null,
  );
  const oChonFile = useRef<HTMLInputElement>(null);

  const laSanPhamMoi = !sp.id;

  function sua<K extends keyof SanPhamSoan>(khoa: K, giaTri: SanPhamSoan[K]) {
    setSp((cu) => ({ ...cu, [khoa]: giaTri }));
  }

  function suaBienThe<K extends keyof BienThe>(
    viTri: number,
    khoa: K,
    giaTri: BienThe[K],
  ) {
    setSp((cu) => ({
      ...cu,
      variants: cu.variants.map((b, i) =>
        i === viTri ? { ...b, [khoa]: giaTri } : b,
      ),
    }));
  }

  function luu() {
    setThongBao(null);
    batDauLuu(async () => {
      const kq = await luuSanPham({
        ...sp,
        slug: sp.slug || taoSlug(sp.nameVi),
        faceCount: sp.faceCount,
        variants: sp.variants.map((b) => ({
          ...b,
          comparePrice: b.comparePrice || null,
        })),
      });

      if (kq.ok) {
        setThongBao({ ok: true, chu: kq.thongBao ?? "Đã lưu." });
        router.refresh();
        if (laSanPhamMoi) router.push("/admin/san-pham");
      } else {
        setThongBao({ ok: false, chu: kq.loi ?? "Có lỗi xảy ra." });
      }
    });
  }

  function taiAnh(files: FileList | null) {
    if (!files || files.length === 0 || !sp.id) return;
    const fd = new FormData();
    fd.set("productId", sp.id);
    for (const f of Array.from(files)) fd.append("files", f);

    batDauTaiAnh(async () => {
      const kq = await taiAnhLen(fd);
      setThongBao(
        kq.ok
          ? { ok: true, chu: kq.thongBao ?? "Đã tải ảnh." }
          : { ok: false, chu: kq.loi ?? "Không tải được ảnh." },
      );
      if (oChonFile.current) oChonFile.current.value = "";
      router.refresh();
    });
  }

  async function xoaHanSanPham() {
    if (!sp.id) return;
    const chac = window.confirm(
      `Xoá hẳn sản phẩm "${sp.nameVi}"?\n\nHành động này không hoàn tác được. Nếu chỉ muốn tạm ẩn, hãy tắt công tắc "Hiện trên web" thay vì xoá.`,
    );
    if (!chac) return;

    const kq = await xoaSanPham(sp.id);
    if (kq.ok) router.push("/admin/san-pham");
    else setThongBao({ ok: false, chu: kq.loi ?? "Không xoá được." });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      {/* ============ CỘT TRÁI ============ */}
      <div className="space-y-6">
        {/* --- Thông tin cơ bản --- */}
        <section className="rounded-lg border border-kem-300 bg-white p-6">
          <h2 className="font-display text-lg text-muc-900">
            Thông tin cơ bản
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nameVi" className="nhan-o-nhap">
                Tên sản phẩm (tiếng Việt) <span className="text-son-700">*</span>
              </label>
              <input
                id="nameVi"
                value={sp.nameVi}
                onChange={(e) => sua("nameVi", e.target.value)}
                placeholder="Ví dụ: Sen tứ quý"
                className="o-nhap"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="nameEn" className="nhan-o-nhap">
                Tên sản phẩm (tiếng Anh)
              </label>
              <input
                id="nameEn"
                value={sp.nameEn}
                onChange={(e) => sua("nameEn", e.target.value)}
                placeholder="Để trống thì website tiếng Anh dùng tên tiếng Việt"
                className="o-nhap"
              />
            </div>

            <div>
              <label htmlFor="sku" className="nhan-o-nhap">
                Mã sản phẩm <span className="text-son-700">*</span>
              </label>
              <input
                id="sku"
                value={sp.sku}
                onChange={(e) => sua("sku", e.target.value)}
                placeholder="LX-001/4"
                className="o-nhap"
              />
            </div>

            <div>
              <label htmlFor="slug" className="nhan-o-nhap">
                Đường dẫn trên web
              </label>
              <input
                id="slug"
                value={sp.slug}
                onChange={(e) => sua("slug", e.target.value)}
                placeholder={taoSlug(sp.nameVi) || "sen-tu-quy"}
                className="o-nhap"
              />
              <p className="mt-1 text-[11px] text-muc-500">
                Để trống sẽ tự tạo từ tên. Đã đăng bán rồi thì đừng đổi, sẽ mất
                thứ hạng Google.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="shortDescVi" className="nhan-o-nhap">
                Mô tả ngắn (hiện dưới tên ở trang danh sách)
              </label>
              <input
                id="shortDescVi"
                value={sp.shortDescVi}
                onChange={(e) => sua("shortDescVi", e.target.value)}
                placeholder="Khuôn lò xo 1 nhấn 4 mặt hoa"
                className="o-nhap"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="shortDescEn" className="nhan-o-nhap">
                Mô tả ngắn (tiếng Anh)
              </label>
              <input
                id="shortDescEn"
                value={sp.shortDescEn}
                onChange={(e) => sua("shortDescEn", e.target.value)}
                className="o-nhap"
              />
            </div>
          </div>
        </section>

        {/* --- Giá và các cỡ --- */}
        <section className="rounded-lg border border-kem-300 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg text-muc-900">
                Giá và các cỡ khuôn
              </h2>
              <p className="mt-1 text-[13px] text-muc-500">
                Mỗi cỡ là một dòng. Giá nhập bằng số, không cần dấu chấm.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                sua("variants", [...sp.variants, { ...BIEN_THE_TRONG }])
              }
              className="nut-phu !py-2 !text-[13px]"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm cỡ
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {sp.variants.map((b, i) => (
              <div
                key={b.id ?? `moi-${i}`}
                className="rounded-lg border border-kem-300 bg-kem-50 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="nhan-o-nhap">Tên cỡ (tiếng Việt)</label>
                    <input
                      value={b.labelVi}
                      onChange={(e) => suaBienThe(i, "labelVi", e.target.value)}
                      placeholder="Cỡ 150g"
                      className="o-nhap"
                    />
                  </div>
                  <div>
                    <label className="nhan-o-nhap">Tên cỡ (tiếng Anh)</label>
                    <input
                      value={b.labelEn}
                      onChange={(e) => suaBienThe(i, "labelEn", e.target.value)}
                      placeholder="150g"
                      className="o-nhap"
                    />
                  </div>
                  <div>
                    <label className="nhan-o-nhap">
                      Giá bán (đồng) <span className="text-son-700">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={b.price || ""}
                      onChange={(e) =>
                        suaBienThe(i, "price", Number(e.target.value) || 0)
                      }
                      placeholder="229000"
                      className="o-nhap"
                    />
                    {b.price > 0 && (
                      <p className="mt-1 text-[11px] font-medium text-son-700">
                        = {dinhDangTien(b.price)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="nhan-o-nhap">Giá gạch ngang</label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={b.comparePrice ?? ""}
                      onChange={(e) =>
                        suaBienThe(
                          i,
                          "comparePrice",
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      placeholder="Để trống nếu không muốn hiện"
                      className="o-nhap"
                    />
                    {b.comparePrice && b.comparePrice > b.price && (
                      <p className="mt-1 text-[11px] font-medium text-emerald-700">
                        Hiện giảm{" "}
                        {Math.round(
                          ((b.comparePrice - b.price) / b.comparePrice) * 100,
                        )}
                        %
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="nhan-o-nhap">
                      Ghi chú nhỏ cạnh cỡ này
                    </label>
                    <input
                      value={b.noteVi}
                      onChange={(e) => suaBienThe(i, "noteVi", e.target.value)}
                      placeholder="Đựng vừa khay số 9"
                      className="o-nhap"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <label className="flex items-center gap-2 text-sm text-muc-700">
                      <input
                        type="checkbox"
                        checked={b.inStock}
                        onChange={(e) =>
                          suaBienThe(i, "inStock", e.target.checked)
                        }
                        className="h-4 w-4 accent-emerald-600"
                      />
                      Cỡ này còn hàng
                    </label>

                    <label
                      className="flex items-center gap-2 text-sm text-muc-700"
                      title="Ví dụ: mặt khuôn bán lẻ, phụ kiện rời. Bật lên thì giá này không bị lấy làm giá hiển thị ngoài trang danh sách."
                    >
                      <input
                        type="checkbox"
                        checked={b.isAccessory}
                        onChange={(e) =>
                          suaBienThe(i, "isAccessory", e.target.checked)
                        }
                        className="h-4 w-4 accent-dong-600"
                      />
                      Là món mua lẻ
                    </label>
                  </div>

                  {sp.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        sua(
                          "variants",
                          sp.variants.filter((_, j) => j !== i),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[13px] text-muc-500 transition-colors hover:bg-son-50 hover:text-son-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Xoá cỡ này
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Mô tả đầy đủ --- */}
        <section className="rounded-lg border border-kem-300 bg-white p-6">
          <h2 className="font-display text-lg text-muc-900">Mô tả chi tiết</h2>

          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="descVi" className="nhan-o-nhap">
                Mô tả (tiếng Việt)
              </label>
              <textarea
                id="descVi"
                rows={8}
                value={sp.descVi}
                onChange={(e) => sua("descVi", e.target.value)}
                className="o-nhap resize-y"
              />
              <p className="mt-1 text-[11px] text-muc-500">
                Xuống dòng trong ô này sẽ hiện đúng như vậy trên website.
              </p>
            </div>

            <div>
              <label htmlFor="descEn" className="nhan-o-nhap">
                Mô tả (tiếng Anh)
              </label>
              <textarea
                id="descEn"
                rows={6}
                value={sp.descEn}
                onChange={(e) => sua("descEn", e.target.value)}
                className="o-nhap resize-y"
              />
            </div>

            <div>
              <label htmlFor="patterns" className="nhan-o-nhap">
                Hoa văn từng mặt — mỗi dòng một mặt
              </label>
              <textarea
                id="patterns"
                rows={5}
                value={sp.patterns}
                onChange={(e) => sua("patterns", e.target.value)}
                placeholder={"Mặt 1: Hoa sen\nMặt 2: Mẫu đơn\nMặt 3: Hoa cúc\nMặt 4: Cá đôi"}
                className="o-nhap resize-y"
              />
              <p className="mt-1 text-[11px] text-muc-500">
                Khách rất hay hỏi mục này. Điền đầy đủ sẽ giảm hẳn tin nhắn hỏi
                lặp.
              </p>
            </div>

            <div>
              <label htmlFor="noteVi" className="nhan-o-nhap">
                Lưu ý quan trọng (hiện trong khung vàng)
              </label>
              <textarea
                id="noteVi"
                rows={3}
                value={sp.noteVi}
                onChange={(e) => sua("noteVi", e.target.value)}
                placeholder="Ví dụ: Cỡ 150g đựng vừa khay số 9…"
                className="o-nhap resize-y"
              />
            </div>
          </div>
        </section>

        {/* --- Ảnh --- */}
        <section className="rounded-lg border border-kem-300 bg-white p-6">
          <h2 className="font-display text-lg text-muc-900">Ảnh sản phẩm</h2>

          {laSanPhamMoi ? (
            <p className="mt-4 rounded-md bg-kem-100 p-4 text-[13px] text-muc-600">
              Hãy lưu sản phẩm trước, sau đó quay lại đây để tải ảnh lên.
            </p>
          ) : (
            <>
              <p className="mt-1 text-[13px] text-muc-500">
                Ảnh được tự động cắt vuông và nén lại. Ảnh có ngôi sao là ảnh đại
                diện hiện ở trang danh sách.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {sp.images.map((a) => (
                  <div
                    key={a.id}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
                      a.isMain ? "border-dong-500" : "border-kem-300"
                    }`}
                  >
                    <Image
                      src={a.url}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />

                    {a.isMain && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-dong-500 p-1">
                        <Star className="h-3 w-3 fill-muc-900 text-muc-900" />
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-muc-900/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      {!a.isMain && (
                        <button
                          type="button"
                          onClick={async () => {
                            await datAnhDaiDien(a.id);
                            router.refresh();
                          }}
                          className="flex-1 rounded bg-kem-100 px-1.5 py-1 text-[10px] font-semibold text-muc-800"
                        >
                          Đại diện
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm("Xoá ảnh này?")) return;
                          await xoaAnh(a.id);
                          router.refresh();
                        }}
                        className="rounded bg-son-700 px-2 py-1 text-[10px] font-semibold text-kem-50"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => oChonFile.current?.click()}
                  disabled={dangTaiAnh}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-kem-400 text-muc-500 transition-colors hover:border-son-700 hover:text-son-700 disabled:opacity-50"
                >
                  {dangTaiAnh ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <ImagePlus className="h-6 w-6" />
                  )}
                  <span className="text-[11px] font-medium">
                    {dangTaiAnh ? "Đang tải…" : "Thêm ảnh"}
                  </span>
                </button>
              </div>

              <input
                ref={oChonFile}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={(e) => taiAnh(e.target.files)}
                className="hidden"
              />
            </>
          )}
        </section>
      </div>

      {/* ============ CỘT PHẢI ============ */}
      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <section className="rounded-lg border border-kem-300 bg-white p-6">
          {thongBao && (
            <div
              className={`mb-4 flex gap-2.5 rounded-md p-3 ${
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

          <button
            type="button"
            onClick={luu}
            disabled={dangLuu}
            className="nut-chinh w-full"
          >
            {dangLuu ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu…
              </>
            ) : laSanPhamMoi ? (
              "Tạo sản phẩm"
            ) : (
              "Lưu thay đổi"
            )}
          </button>

          <div className="mt-6 space-y-3.5 border-t border-kem-300 pt-5">
            {[
              {
                khoa: "isActive" as const,
                nhan: "Hiện trên website",
                moTa: "Tắt để ẩn hẳn sản phẩm khỏi web",
              },
              {
                khoa: "inStock" as const,
                nhan: "Còn hàng",
                moTa: "Tắt khi hết hàng tạm thời",
              },
              {
                khoa: "isFeatured" as const,
                nhan: "Nổi bật ở trang chủ",
                moTa: "Hiện trong mục Mẫu được chọn nhiều nhất",
              },
              {
                khoa: "isExclusive" as const,
                nhan: "Gắn nhãn Độc quyền",
                moTa: "Huy hiệu vàng trên ảnh sản phẩm",
              },
              {
                khoa: "isNew" as const,
                nhan: "Gắn nhãn Mới",
                moTa: "Dùng cho mẫu vừa về",
              },
            ].map(({ khoa, nhan, moTa }) => (
              <label key={khoa} className="flex cursor-pointer gap-3">
                <input
                  type="checkbox"
                  checked={sp[khoa]}
                  onChange={(e) => sua(khoa, e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-son-700"
                />
                <span>
                  <span className="block text-sm font-medium text-muc-800">
                    {nhan}
                  </span>
                  <span className="block text-[11px] text-muc-500">{moTa}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-kem-300 bg-white p-6">
          <h2 className="font-display text-lg text-muc-900">Phân loại</h2>

          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="categoryId" className="nhan-o-nhap">
                Danh mục <span className="text-son-700">*</span>
              </label>
              <select
                id="categoryId"
                value={sp.categoryId}
                onChange={(e) => sua("categoryId", e.target.value)}
                className="o-nhap"
              >
                {danhMuc.map((dm) => (
                  <option key={dm.id} value={dm.id}>
                    {"— ".repeat(dm.capDo)}
                    {dm.nameVi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="faceCount" className="nhan-o-nhap">
                Số mặt hoa văn
              </label>
              <input
                id="faceCount"
                type="number"
                min={0}
                max={50}
                value={sp.faceCount ?? ""}
                onChange={(e) =>
                  sua("faceCount", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="4"
                className="o-nhap"
              />
            </div>

            <div>
              <label htmlFor="diameter" className="nhan-o-nhap">
                Đường kính
              </label>
              <input
                id="diameter"
                value={sp.diameter}
                onChange={(e) => sua("diameter", e.target.value)}
                placeholder="12,8 cm"
                className="o-nhap"
              />
            </div>

            <div>
              <label htmlFor="material" className="nhan-o-nhap">
                Chất liệu
              </label>
              <input
                id="material"
                value={sp.material}
                onChange={(e) => sua("material", e.target.value)}
                placeholder="Để trống nếu chưa muốn công bố"
                className="o-nhap"
              />
            </div>

            <div>
              <label htmlFor="sortOrder" className="nhan-o-nhap">
                Thứ tự hiển thị
              </label>
              <input
                id="sortOrder"
                type="number"
                value={sp.sortOrder}
                onChange={(e) => sua("sortOrder", Number(e.target.value) || 0)}
                className="o-nhap"
              />
              <p className="mt-1 text-[11px] text-muc-500">
                Số nhỏ hiện trước. Muốn đẩy một mẫu lên đầu thì đặt số 1.
              </p>
            </div>
          </div>
        </section>

        {!laSanPhamMoi && (
          <section className="rounded-lg border border-son-200 bg-son-50 p-6">
            <h2 className="font-display text-base text-son-900">Vùng nguy hiểm</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-son-800">
              Xoá hẳn sản phẩm cùng toàn bộ ảnh và các cỡ giá. Không hoàn tác
              được. Nếu chỉ muốn tạm ẩn, hãy tắt “Hiện trên website”.
            </p>
            <button
              type="button"
              onClick={xoaHanSanPham}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-son-700 px-4 py-2.5 text-[13px] font-semibold text-son-700 transition-colors hover:bg-son-700 hover:text-kem-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xoá sản phẩm này
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
