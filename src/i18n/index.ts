import { vi } from "./vi";
import { en } from "./en";
import type { BanDich } from "./vi";

export type NgonNgu = "vi" | "en";

export const NGON_NGU_MAC_DINH: NgonNgu = "vi";
export const CAC_NGON_NGU: NgonNgu[] = ["vi", "en"];

const banDich: Record<NgonNgu, BanDich> = { vi, en };

export function laNgonNguHopLe(gt: string): gt is NgonNgu {
  return (CAC_NGON_NGU as string[]).includes(gt);
}

/** Lấy bộ chữ theo ngôn ngữ. Ngôn ngữ lạ thì trả về tiếng Việt. */
export function layBanDich(ngonNgu: string): BanDich {
  return laNgonNguHopLe(ngonNgu) ? banDich[ngonNgu] : vi;
}

/**
 * Chọn nội dung theo ngôn ngữ cho dữ liệu lấy từ database.
 * Nếu bản tiếng Anh để trống thì tự động dùng bản tiếng Việt,
 * để website không bao giờ hiện ô trống.
 */
export function theoNgonNgu(
  ngonNgu: NgonNgu,
  banViet: string | null | undefined,
  banAnh: string | null | undefined,
): string {
  if (ngonNgu === "en") return banAnh?.trim() || banViet?.trim() || "";
  return banViet?.trim() || banAnh?.trim() || "";
}

export type { BanDich };
