import "server-only";
import { taoFileExcel, type OExcel } from "./xlsx-don-gian";

/**
 * Xuất đơn hàng ra file Excel đúng khuôn mẫu tải đơn hàng loạt của SPX
 * (Shopee Express) — xem "FIle mẫu SPX.xlsx" trong thư mục Tham khảo.
 *
 * Dùng bảng "Tạo đơn (địa chỉ mới)", tức địa chỉ 2 cấp Tỉnh/Thành + Xã/Phường
 * theo cách chia đơn vị hành chính hiện hành.
 *
 * Cách dùng: vào /admin/don-hang, chọn đơn rồi bấm "Xuất file SPX", lưu file
 * về máy. Sau đó lên spx.vn chọn Tạo đơn → Tạo nhiều đơn hàng → Chọn tệp.
 */

// Tiêu đề phải giữ nguyên từng chữ như file mẫu, SPX dò cột theo tên
const COT = [
  "*Mã đơn hàng",
  "*Tên người nhận",
  "*Số điện thoại",
  "*Tỉnh/Thành Phố",
  "*Xã/Phường",
  "*Địa chỉ chi tiết",
  "Lưu ý về địa chỉ",
  "Mã bưu chính",
  "*Tên sản phẩm",
  "Số lượng (Thông tin bắt buộc khi chọn Giao hàng một phần & Thu COD)",
  "Giá tiền (Thông tin bắt buộc khi chọn Giao hàng một phần & Thu COD)",
  "*Tổng cân nặng bưu gửi (KG)",
  "Chiều dài (CM)",
  "Chiều rộng (CM)",
  "Chiều cao (CM)",
  "Mã khách hàng",
  "*Giá trị đơn hàng",
  "*Giao hàng một phần (Y/N)",
  "*Cho phép thử hàng (Y/N)",
  "*Cho xem hàng, không cho thử (Y/N)",
  "Thu phí từ chối nhận hàng (Y/N)",
  "Phí từ chối nhận hàng cần thu",
  "*Thu COD (Y/N)",
  "Số tiền COD",
  "bưu gửi giá trị cao (Y/N)",
  "*Hình thức thanh Toán",
  "Lưu ý giao hàng",
  // Hai cột cuối trong file mẫu chỉ là lời nhắc cho người điền tay,
  // giữ lại tiêu đề cho khớp cấu trúc nhưng luôn để trống
  "Nhắc nhở điền đúng số tiền COD",
  'Đơn chỉ hoàn thành nếu ở dưới hiện "Đủ điều kiện"',
] as const;

const DO_RONG_COT = [
  16, 20, 14, 18, 20, 40, 18, 12, 34, 12, 14, 14, 11, 11, 11, 14, 15, 12, 12,
  14, 14, 14, 11, 14, 14, 18, 30, 24, 24,
];

/** Tên các tỉnh/thành hiện hành, dùng để tách tỉnh ra khỏi địa chỉ khách gõ */
const TINH_THANH = [
  "Thành phố Hà Nội",
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Thành phố Hồ Chí Minh",
  "Hồ Chí Minh",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "Thừa Thiên Huế",
  "Huế",
  "An Giang",
  "Bắc Ninh",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Tĩnh",
  "Hưng Yên",
  "Khánh Hòa",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Nghệ An",
  "Ninh Bình",
  "Phú Thọ",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sơn La",
  "Tây Ninh",
  "Thái Nguyên",
  "Thanh Hóa",
  "Tuyên Quang",
  "Vĩnh Long",
];

/** Tên SPX nhận cho từng cách khách hay viết tắt */
const TEN_CHUAN: Record<string, string> = {
  "thanh pho ha noi": "Hà Nội",
  "ha noi": "Hà Nội",
  "thanh pho ho chi minh": "TP. Hồ Chí Minh",
  "tp ho chi minh": "TP. Hồ Chí Minh",
  "ho chi minh": "TP. Hồ Chí Minh",
  hue: "Thừa Thiên Huế",
  "thua thien hue": "Thừa Thiên Huế",
};

/** "Hà Nội" → "ha noi", để so sánh không phụ thuộc dấu và chữ hoa thường */
function boDau(chu: string) {
  return chu
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const TINH_DA_BO_DAU = TINH_THANH.map((t) => ({ ten: t, khoa: boDau(t) }));

function chuanHoaTinh(ten: string) {
  const khoa = boDau(ten);
  return TEN_CHUAN[khoa] ?? ten.trim();
}

/**
 * Khách chỉ gõ một ô địa chỉ tự do nên phải đoán: tìm tên tỉnh trong chuỗi,
 * đoạn ngay trước tên tỉnh thường là xã/phường.
 *
 * Đoán sai cũng không sao — bảng tính SPX có sẵn ô chọn tỉnh/xã, chủ shop
 * sửa lại trong Excel trước khi tải lên.
 */
export function tachDiaChi(diaChi: string, tinhCoSan?: string | null) {
  const doan = diaChi
    .split(/[,\n]/)
    .map((d) => d.trim())
    .filter(Boolean);

  let tinh = tinhCoSan?.trim() ? chuanHoaTinh(tinhCoSan) : "";
  let viTriTinh = -1;

  // Dò từ cuối lên, vì tỉnh thường nằm ở cuối địa chỉ
  for (let i = doan.length - 1; i >= 0; i--) {
    const khoa = boDau(doan[i]);
    const trung = TINH_DA_BO_DAU.find(
      (t) => khoa === t.khoa || khoa.endsWith(` ${t.khoa}`),
    );
    if (trung) {
      viTriTinh = i;
      if (!tinh) tinh = chuanHoaTinh(trung.ten);
      break;
    }
  }

  // Đoạn ngay trước tên tỉnh thường là xã/phường. Nếu địa chỉ không nhắc
  // tới tỉnh (khách điền tỉnh ở ô riêng) thì lấy đoạn cuối cùng.
  const viTriXa = viTriTinh >= 0 ? viTriTinh - 1 : doan.length - 1;
  const xaPhuong = viTriXa > 0 ? doan[viTriXa] : "";

  // Địa chỉ chi tiết giữ nguyên cả câu khách gõ, thừa còn hơn thiếu số nhà.
  // Tỉnh khai ở ô riêng thì ghép thêm vào cuối cho đủ.
  const chiTiet =
    viTriTinh < 0 && tinh ? [...doan, tinh].join(", ") : doan.join(", ");

  return { tinh, xaPhuong, chiTiet };
}

/** "+84 387 677 780" → "0387677780" */
export function chuanHoaSoDienThoai(sdt: string) {
  const so = sdt.replace(/[^\d+]/g, "");
  if (so.startsWith("+84")) return `0${so.slice(3)}`;
  if (so.startsWith("84") && so.length >= 11) return `0${so.slice(2)}`;
  return so;
}

export type CaiDatSPX = {
  /** Cân nặng ước tính cho mỗi sản phẩm, đơn vị kilôgam */
  canNangMoiMon: number;
  dai: number;
  rong: number;
  cao: number;
  choThuHang: boolean;
  choXemHang: boolean;
};

export type DonDeXuat = {
  code: string;
  customerName: string;
  phone: string;
  address: string;
  province: string | null;
  note: string | null;
  adminNote: string | null;
  total: number;
  items: {
    productName: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
  }[];
};

const YN = (co: boolean) => (co ? "Y" : "N");

/**
 * Mỗi đơn chiếm nhiều dòng, mỗi sản phẩm một dòng. Theo file mẫu, chỉ dòng
 * đầu của đơn ghi thông tin người nhận và bưu gửi, các dòng sau chỉ cần mã
 * đơn và sản phẩm.
 */
export function taoCacDongSPX(danhSachDon: DonDeXuat[], caiDat: CaiDatSPX) {
  const dong: OExcel[][] = [[...COT]];

  for (const don of danhSachDon) {
    const diaChi = tachDiaChi(don.address, don.province);
    const soMon = don.items.reduce((t, m) => t + m.quantity, 0);
    const canNang =
      Math.round(Math.max(soMon, 1) * caiDat.canNangMoiMon * 100) / 100;
    const luuY = [don.note, don.adminNote].filter(Boolean).join(" — ");

    // Đơn không có sản phẩm nào thì vẫn xuất một dòng để không bị bỏ sót
    const cacMon = don.items.length
      ? don.items
      : [{ productName: "Hàng hoá", variantLabel: "", quantity: 1, unitPrice: don.total }];

    cacMon.forEach((mon, i) => {
      const tenHang = [mon.productName, mon.variantLabel]
        .filter(Boolean)
        .join(" - ");

      if (i > 0) {
        // Dòng sản phẩm tiếp theo của cùng một đơn
        const tiep: OExcel[] = new Array(COT.length).fill(null);
        tiep[0] = don.code;
        tiep[8] = tenHang;
        tiep[9] = mon.quantity;
        tiep[10] = mon.unitPrice;
        dong.push(tiep);
        return;
      }

      dong.push([
        don.code,
        don.customerName,
        chuanHoaSoDienThoai(don.phone),
        diaChi.tinh,
        diaChi.xaPhuong,
        diaChi.chiTiet,
        null, // Lưu ý về địa chỉ
        null, // Mã bưu chính
        tenHang,
        mon.quantity,
        mon.unitPrice,
        canNang,
        caiDat.dai,
        caiDat.rong,
        caiDat.cao,
        null, // Mã khách hàng
        don.total,
        "N", // Giao hàng một phần
        YN(caiDat.choThuHang),
        YN(caiDat.choXemHang),
        "N", // Thu phí từ chối nhận hàng
        null,
        "Y", // Thu COD — cả shop chỉ bán COD
        don.total,
        "N", // Bưu gửi giá trị cao
        "Người gửi trả",
        luuY || null,
      ]);
    });
  }

  return dong;
}

/** Trả về nội dung file .xlsx sẵn sàng cho tải lên spx.vn */
export function taoFileSPX(danhSachDon: DonDeXuat[], caiDat: CaiDatSPX) {
  return taoFileExcel([
    {
      ten: "Tạo đơn (địa chỉ mới)",
      cacDong: taoCacDongSPX(danhSachDon, caiDat),
      doRongCot: DO_RONG_COT,
    },
  ]);
}

/** Tên file gợi ý khi tải về: SPX-Chourmas-27-08-2026-8don.xlsx */
export function tenFileSPX(soDon: number) {
  const gio = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  })
    .format(new Date())
    .replace(/\//g, "-");
  return `SPX-Chourmas-${gio}-${soDon}don.xlsx`;
}
