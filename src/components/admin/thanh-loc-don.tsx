"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Search, X } from "lucide-react";

import { dangLoc, duongDanLoc, type ThamSoLoc } from "@/lib/loc-don-hang";

/** Ngày hôm nay theo giờ Việt Nam, dạng 2026-08-27 */
function ngayVN(lechNgay = 0) {
  const moc = new Date(Date.now() + lechNgay * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(moc);
}

/**
 * Thanh tìm và lọc đơn hàng.
 * Mọi lựa chọn đều nằm trên địa chỉ trang nên chia sẻ được link, và bấm
 * quay lại vẫn giữ nguyên kết quả vừa xem.
 *
 * Trang cha gắn `key` theo bộ lọc, nên mỗi lần lọc xong các ô tự nạp lại
 * đúng giá trị đang có trên địa chỉ trang.
 */
export function ThanhLocDon({ loc }: { loc: ThamSoLoc }) {
  const router = useRouter();
  const [dangChay, batDau] = useTransition();

  const [tim, setTim] = useState(loc.tim);
  const [tuNgay, setTuNgay] = useState(loc.tuNgay);
  const [denNgay, setDenNgay] = useState(loc.denNgay);

  function di(thayDoi: Partial<ThamSoLoc>) {
    batDau(() => router.push(duongDanLoc(loc, thayDoi)));
  }

  const CAC_MOC = [
    { nhan: "Hôm nay", tu: ngayVN(0), den: ngayVN(0) },
    { nhan: "7 ngày qua", tu: ngayVN(-6), den: ngayVN(0) },
    { nhan: "30 ngày qua", tu: ngayVN(-29), den: ngayVN(0) },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        di({ tim, tuNgay, denNgay });
      }}
      className="rounded-lg border border-kem-300 bg-white p-4"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:min-w-[240px] sm:flex-1">
          <label htmlFor="tim" className="nhan-o-nhap">
            Tìm đơn
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muc-400" />
            <input
              id="tim"
              value={tim}
              onChange={(e) => setTim(e.target.value)}
              // Gõ xong bấm Enter là tìm luôn, không phải với chuột sang nút Lọc
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  di({ tim, tuNgay, denNgay });
                }
              }}
              placeholder="Tên khách, số điện thoại, mã đơn, mã vận đơn"
              className="o-nhap !pl-9"
            />
          </div>
        </div>

        <div className="min-w-[140px] flex-1 sm:flex-none">
          <label htmlFor="tuNgay" className="nhan-o-nhap">
            Từ ngày
          </label>
          <input
            id="tuNgay"
            type="date"
            value={tuNgay}
            max={denNgay || undefined}
            onChange={(e) => setTuNgay(e.target.value)}
            className="o-nhap"
          />
        </div>

        <div className="min-w-[140px] flex-1 sm:flex-none">
          <label htmlFor="denNgay" className="nhan-o-nhap">
            Đến ngày
          </label>
          <input
            id="denNgay"
            type="date"
            value={denNgay}
            min={tuNgay || undefined}
            onChange={(e) => setDenNgay(e.target.value)}
            className="o-nhap"
          />
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <button
            type="submit"
            disabled={dangChay}
            className="nut-chinh flex-1 !py-2.5 sm:flex-none"
          >
            {dangChay ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Lọc
          </button>

          {dangLoc(loc) && (
            <button
              type="button"
              onClick={() => {
                setTim("");
                setTuNgay("");
                setDenNgay("");
                batDau(() => router.push("/admin/don-hang"));
              }}
              className="nut-phu flex-1 !py-2.5 sm:flex-none"
            >
              <X className="h-4 w-4" />
              Xoá lọc
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-kem-200 pt-3">
        <span className="text-[11px] uppercase tracking-wider text-muc-500">
          Nhanh
        </span>
        {CAC_MOC.map(({ nhan, tu, den }) => {
          const dangChon = loc.tuNgay === tu && loc.denNgay === den;
          return (
            <button
              key={nhan}
              type="button"
              onClick={() => {
                setTuNgay(tu);
                setDenNgay(den);
                di({ tim, tuNgay: tu, denNgay: den });
              }}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                dangChon
                  ? "bg-son-700 text-kem-50"
                  : "border border-kem-400 text-muc-600 hover:border-son-700"
              }`}
            >
              {nhan}
            </button>
          );
        })}
        {(loc.tuNgay || loc.denNgay) && (
          <button
            type="button"
            onClick={() => {
              setTuNgay("");
              setDenNgay("");
              di({ tim, tuNgay: "", denNgay: "" });
            }}
            className="rounded-full px-3 py-1 text-[12px] font-medium text-son-700 hover:underline"
          >
            Mọi thời gian
          </button>
        )}
      </div>
    </form>
  );
}
