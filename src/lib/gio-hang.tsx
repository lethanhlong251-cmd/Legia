"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * GIỎ HÀNG
 * --------
 * Giỏ hàng lưu trong trình duyệt của khách (localStorage), không lưu trên
 * máy chủ. Khách đóng trình duyệt mở lại vẫn còn hàng trong giỏ, và nếu
 * mở website ở nhiều tab thì các tab tự đồng bộ với nhau.
 *
 * Chỉ khi bấm "Xác nhận đặt hàng" thì đơn mới được gửi về máy chủ, và khi
 * đó máy chủ đọc lại giá từ cơ sở dữ liệu chứ không tin giá trong giỏ.
 */

export type MonHang = {
  variantId: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  sku: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
};

const KHOA_LUU = "chourmas-gio-hang";
const GIO_TRONG: MonHang[] = [];

// ---------------------------------------------------------------
// Kho dữ liệu nằm ngoài React
// ---------------------------------------------------------------

let anhChup: MonHang[] = GIO_TRONG;
let daDoc = false;
const nguoiNghe = new Set<() => void>();

function docTuTrinhDuyet(): MonHang[] {
  try {
    const chuoi = localStorage.getItem(KHOA_LUU);
    if (!chuoi) return GIO_TRONG;
    const duLieu = JSON.parse(chuoi);
    return Array.isArray(duLieu) ? (duLieu as MonHang[]) : GIO_TRONG;
  } catch {
    // localStorage bị chặn hoặc dữ liệu hỏng — coi như giỏ trống
    return GIO_TRONG;
  }
}

function bao() {
  for (const goi of nguoiNghe) goi();
}

function dat(danhSachMoi: MonHang[]) {
  anhChup = danhSachMoi;
  try {
    localStorage.setItem(KHOA_LUU, JSON.stringify(danhSachMoi));
  } catch {
    // Bộ nhớ đầy hoặc bị chặn — giỏ vẫn dùng được trong phiên này
  }
  bao();
}

function dangKyNghe(goi: () => void) {
  // Lần đầu có người nghe thì đọc dữ liệu đã lưu
  if (!daDoc) {
    daDoc = true;
    anhChup = docTuTrinhDuyet();
  }
  nguoiNghe.add(goi);

  // Tab khác sửa giỏ thì tab này cập nhật theo
  const khiTabKhacSua = (su: StorageEvent) => {
    if (su.key !== KHOA_LUU) return;
    anhChup = docTuTrinhDuyet();
    bao();
  };
  window.addEventListener("storage", khiTabKhacSua);

  return () => {
    nguoiNghe.delete(goi);
    window.removeEventListener("storage", khiTabKhacSua);
  };
}

const layAnhChup = () => anhChup;
const layAnhChupTrenMayChu = () => GIO_TRONG;

// ---------------------------------------------------------------
// Trạng thái đóng mở của ngăn giỏ hàng trượt bên phải
// ---------------------------------------------------------------

let dangMoNgan = false;
const nguoiNgheNgan = new Set<() => void>();

function baoNgan() {
  for (const goi of nguoiNgheNgan) goi();
}

export function moNganGio() {
  dangMoNgan = true;
  baoNgan();
}

export function dongNganGio() {
  dangMoNgan = false;
  baoNgan();
}

function dangKyNgheNgan(goi: () => void) {
  nguoiNgheNgan.add(goi);
  return () => nguoiNgheNgan.delete(goi);
}

/** Ngăn giỏ hàng có đang mở hay không */
export function useNganGioDangMo() {
  return useSyncExternalStore(
    dangKyNgheNgan,
    () => dangMoNgan,
    () => false, // Máy chủ luôn dựng ở trạng thái đóng
  );
}

// Máy chủ chưa đọc được localStorage, nên lần dựng đầu tiên luôn coi là
// "chưa nạp xong". Nhờ vậy giao diện không bị nhấp nháy khi tải trang.
const layTrangThaiNap = () => true;
const layTrangThaiNapTrenMayChu = () => false;

// ---------------------------------------------------------------
// Cách dùng trong giao diện
// ---------------------------------------------------------------

export function useGioHang() {
  const danhSach = useSyncExternalStore(
    dangKyNghe,
    layAnhChup,
    layAnhChupTrenMayChu,
  );
  const daNapXong = useSyncExternalStore(
    dangKyNghe,
    layTrangThaiNap,
    layTrangThaiNapTrenMayChu,
  );

  const them = useCallback(
    (
      mon: Omit<MonHang, "quantity">,
      soLuong = 1,
      /** Đặt false khi bấm "Mua ngay", vì lúc đó chuyển thẳng sang thanh toán */
      moNgan = true,
    ) => {
      const daCo = anhChup.find((m) => m.variantId === mon.variantId);
      dat(
        daCo
          ? anhChup.map((m) =>
              m.variantId === mon.variantId
                ? { ...m, quantity: Math.min(m.quantity + soLuong, 99) }
                : m,
            )
          : [...anhChup, { ...mon, quantity: soLuong }],
      );
      if (moNgan) moNganGio();
    },
    [],
  );

  const doiSoLuong = useCallback((variantId: string, soLuong: number) => {
    dat(
      soLuong <= 0
        ? anhChup.filter((m) => m.variantId !== variantId)
        : anhChup.map((m) =>
            m.variantId === variantId
              ? { ...m, quantity: Math.min(soLuong, 99) }
              : m,
          ),
    );
  }, []);

  const xoa = useCallback((variantId: string) => {
    dat(anhChup.filter((m) => m.variantId !== variantId));
  }, []);

  const xoaHet = useCallback(() => dat(GIO_TRONG), []);

  return useMemo(
    () => ({
      danhSach,
      soMon: danhSach.reduce((t, m) => t + m.quantity, 0),
      tongTien: danhSach.reduce((t, m) => t + m.unitPrice * m.quantity, 0),
      daNapXong,
      them,
      doiSoLuong,
      xoa,
      xoaHet,
    }),
    [danhSach, daNapXong, them, doiSoLuong, xoa, xoaHet],
  );
}

/**
 * Giữ lại để bọc quanh ứng dụng cho dễ đọc. Giỏ hàng không cần Context
 * nữa vì dữ liệu nằm ngoài React, nhưng để nguyên thẻ này thì bố cục
 * không phải sửa và sau này muốn thêm gì cũng có sẵn chỗ.
 */
export function NhaCungCapGioHang({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
