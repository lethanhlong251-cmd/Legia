"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

/**
 * KHUNG XEM ẢNH PHÓNG TO
 * ----------------------
 * Khách mua khuôn là mua độ sắc nét của hoa văn, nên phải xem được thật gần.
 *
 * Cách dùng:
 *  - Bấm vào ảnh để mở
 *  - Bấm tiếp (hoặc bấm hai lần trên điện thoại) để phóng to gấp 2,5 lần
 *  - Khi đã phóng to thì kéo để di chuyển quanh ảnh
 *  - Vuốt trái phải để đổi ảnh, bấm Esc hoặc nút X để đóng
 */

type Anh = { id: string; url: string; alt: string };

const MUC_PHONG = 2.5;

export function XemAnhLon({
  danhSachAnh,
  viTriBanDau,
  khiDong,
}: {
  danhSachAnh: Anh[];
  viTriBanDau: number;
  khiDong: () => void;
}) {
  const [viTri, setViTri] = useState(viTriBanDau);
  const [phongTo, setPhongTo] = useState(false);
  const [lech, setLech] = useState({ x: 0, y: 0 });
  // Ref dùng cho phần tính toán lúc kéo, state dùng cho phần hiển thị.
  // Tách ra vì React không cho đọc ref trong lúc dựng giao diện.
  const [dangKeoHienThi, setDangKeoHienThi] = useState(false);

  const dangKeo = useRef(false);
  const diemBatDau = useRef({ x: 0, y: 0 });
  const lechLucBatDau = useRef({ x: 0, y: 0 });
  const chamBatDau = useRef<{ x: number; y: number; luc: number } | null>(null);

  const anhHienTai = danhSachAnh[viTri];
  const nhieuAnh = danhSachAnh.length > 1;

  const veBanDau = useCallback(() => {
    setPhongTo(false);
    setLech({ x: 0, y: 0 });
  }, []);

  const doiAnh = useCallback(
    (buoc: number) => {
      veBanDau();
      setViTri((cu) => (cu + buoc + danhSachAnh.length) % danhSachAnh.length);
    },
    [danhSachAnh.length, veBanDau],
  );

  // Phím tắt trên máy tính
  useEffect(() => {
    const xuLyPhim = (su: KeyboardEvent) => {
      if (su.key === "Escape") khiDong();
      else if (su.key === "ArrowRight" && nhieuAnh) doiAnh(1);
      else if (su.key === "ArrowLeft" && nhieuAnh) doiAnh(-1);
    };
    window.addEventListener("keydown", xuLyPhim);
    return () => window.removeEventListener("keydown", xuLyPhim);
  }, [khiDong, doiAnh, nhieuAnh]);

  // Khoá cuộn trang phía sau khi đang mở khung xem ảnh
  useEffect(() => {
    const cuonCu = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = cuonCu;
    };
  }, []);

  function bamVaoAnh(su: React.MouseEvent<HTMLDivElement>) {
    if (phongTo) {
      veBanDau();
      return;
    }
    // Phóng to đúng chỗ vừa bấm
    const khung = su.currentTarget.getBoundingClientRect();
    const tyLeX = (su.clientX - khung.left) / khung.width - 0.5;
    const tyLeY = (su.clientY - khung.top) / khung.height - 0.5;
    setLech({
      x: -tyLeX * khung.width * (MUC_PHONG - 1),
      y: -tyLeY * khung.height * (MUC_PHONG - 1),
    });
    setPhongTo(true);
  }

  // --- Kéo bằng chuột khi đã phóng to ---
  function batDauKeo(su: React.MouseEvent) {
    if (!phongTo) return;
    dangKeo.current = true;
    setDangKeoHienThi(true);
    diemBatDau.current = { x: su.clientX, y: su.clientY };
    lechLucBatDau.current = lech;
  }
  function dangKeoChuot(su: React.MouseEvent) {
    if (!dangKeo.current) return;
    setLech({
      x: lechLucBatDau.current.x + (su.clientX - diemBatDau.current.x),
      y: lechLucBatDau.current.y + (su.clientY - diemBatDau.current.y),
    });
  }
  const ngungKeo = () => {
    dangKeo.current = false;
    setDangKeoHienThi(false);
  };

  // --- Vuốt trên điện thoại ---
  function chamXuong(su: React.TouchEvent) {
    const c = su.touches[0];
    chamBatDau.current = { x: c.clientX, y: c.clientY, luc: Date.now() };
    if (phongTo) {
      dangKeo.current = true;
      setDangKeoHienThi(true);
      diemBatDau.current = { x: c.clientX, y: c.clientY };
      lechLucBatDau.current = lech;
    }
  }
  function chamDiChuyen(su: React.TouchEvent) {
    if (!phongTo || !dangKeo.current) return;
    const c = su.touches[0];
    setLech({
      x: lechLucBatDau.current.x + (c.clientX - diemBatDau.current.x),
      y: lechLucBatDau.current.y + (c.clientY - diemBatDau.current.y),
    });
  }
  function chamNhac(su: React.TouchEvent) {
    dangKeo.current = false;
    setDangKeoHienThi(false);
    const batDau = chamBatDau.current;
    if (!batDau || phongTo) return;

    const c = su.changedTouches[0];
    const dx = c.clientX - batDau.x;
    const dy = c.clientY - batDau.y;

    // Vuốt ngang đủ dài thì đổi ảnh
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) && nhieuAnh) {
      doiAnh(dx < 0 ? 1 : -1);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-muc-900/96 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh phóng to"
    >
      {/* Thanh trên cùng */}
      <div className="flex items-center justify-between px-4 py-3 text-kem-200 sm:px-6">
        <span className="text-sm tabular-nums">
          {nhieuAnh ? `${viTri + 1} / ${danhSachAnh.length}` : ""}
        </span>
        <div className="flex items-center gap-2">
          {!phongTo && (
            <span className="hidden items-center gap-1.5 text-xs text-kem-400 sm:flex">
              <ZoomIn className="h-3.5 w-3.5" />
              Bấm vào ảnh để phóng to
            </span>
          )}
          <button
            type="button"
            onClick={khiDong}
            aria-label="Đóng"
            className="rounded-full p-2 transition-colors hover:bg-kem-100/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Ảnh */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div
          onClick={bamVaoAnh}
          onMouseDown={batDauKeo}
          onMouseMove={dangKeoChuot}
          onMouseUp={ngungKeo}
          onMouseLeave={ngungKeo}
          onTouchStart={chamXuong}
          onTouchMove={chamDiChuyen}
          onTouchEnd={chamNhac}
          style={{
            transform: `translate(${lech.x}px, ${lech.y}px) scale(${phongTo ? MUC_PHONG : 1})`,
            transition: dangKeoHienThi
              ? "none"
              : "transform .3s var(--ease-muot)",
            cursor: phongTo ? "grab" : "zoom-in",
          }}
          className="relative aspect-square w-full max-w-[min(92vw,78vh)] select-none touch-none"
        >
          <Image
            src={anhHienTai.url}
            alt={anhHienTai.alt}
            fill
            sizes="(max-width: 768px) 92vw, 78vh"
            priority
            draggable={false}
            className="object-contain"
          />
        </div>

        {/* Nút chuyển ảnh trên máy tính */}
        {nhieuAnh && !phongTo && (
          <>
            <button
              type="button"
              onClick={() => doiAnh(-1)}
              aria-label="Ảnh trước"
              className="absolute left-2 hidden rounded-full bg-kem-100/10 p-3 text-kem-100 transition-colors hover:bg-kem-100/20 sm:block"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => doiAnh(1)}
              aria-label="Ảnh sau"
              className="absolute right-2 hidden rounded-full bg-kem-100/10 p-3 text-kem-100 transition-colors hover:bg-kem-100/20 sm:block"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Dải ảnh nhỏ phía dưới */}
      {nhieuAnh && (
        <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
          {danhSachAnh.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                veBanDau();
                setViTri(i);
              }}
              aria-label={`Ảnh ${i + 1}`}
              aria-current={i === viTri}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === viTri ? "border-dong-500" : "border-transparent opacity-50"
              }`}
            >
              <Image src={a.url} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Nhắc thao tác trên điện thoại */}
      <p className="pb-4 text-center text-[11px] text-kem-500 sm:hidden">
        {phongTo ? "Kéo để xem quanh ảnh · Chạm để thu nhỏ" : "Chạm để phóng to · Vuốt để đổi ảnh"}
      </p>
    </div>
  );
}
