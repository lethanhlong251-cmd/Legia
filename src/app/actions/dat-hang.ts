"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { LoiKho, NGUONG_SAP_HET, truKho } from "@/lib/ton-kho";
import { laSoDienThoaiVN, taoMaDonHang } from "@/lib/dinh-dang";
import { guiThongBaoDonHang } from "@/lib/telegram";
import { guiEmailDonHang } from "@/lib/email";
import { layBanDich, theoNgonNgu, type NgonNgu } from "@/i18n";

/**
 * XỬ LÝ ĐẶT HÀNG
 * --------------
 * QUAN TRỌNG: giá tiền LUÔN được đọc lại từ cơ sở dữ liệu, không bao giờ
 * tin giá do trình duyệt gửi lên. Nếu tin, người khác có thể sửa giá
 * trong trình duyệt rồi đặt hàng giá 0 đồng.
 *
 * TỒN KHO: cỡ nào có theo dõi kho thì được trừ ngay lúc lưu đơn, trong
 * cùng một giao dịch. Không đủ hàng thì cả đơn không được lưu và khách
 * được báo cỡ nào vừa hết, để bỏ ra khỏi giỏ hoặc giảm số lượng.
 */

const MonHangGui = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

const DonHangGui = z.object({
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(9).max(20),
  address: z.string().trim().min(5).max(500),
  province: z.string().trim().max(120).optional(),
  note: z.string().trim().max(1000).optional(),
  items: z.array(MonHangGui).min(1).max(50),
  lang: z.enum(["vi", "en"]).default("vi"),
});

export type KetQuaDatHang =
  | { thanhCong: true; maDon: string }
  | { thanhCong: false; loi: string };

export async function datHang(duLieuTho: unknown): Promise<KetQuaDatHang> {
  const phanTich = DonHangGui.safeParse(duLieuTho);

  if (!phanTich.success) {
    return { thanhCong: false, loi: layBanDich("vi").datHang.loiChung };
  }

  const duLieu = phanTich.data;
  const t = layBanDich(duLieu.lang as NgonNgu);

  if (!laSoDienThoaiVN(duLieu.phone)) {
    return { thanhCong: false, loi: t.datHang.loiSaiSdt };
  }

  // Đọc lại giá thật từ cơ sở dữ liệu
  const cacBienThe = await prisma.productVariant.findMany({
    where: { id: { in: duLieu.items.map((m) => m.variantId) } },
    include: {
      product: { include: { images: { orderBy: { sortOrder: "asc" } } } },
    },
  });

  const banDoBienThe = new Map(cacBienThe.map((b) => [b.id, b]));

  // Gộp số lượng theo từng cỡ, phòng khi giỏ có hai dòng trùng một cỡ
  const tongTheoCo = new Map<string, number>();
  for (const mon of duLieu.items) {
    tongTheoCo.set(mon.variantId, (tongTheoCo.get(mon.variantId) ?? 0) + mon.quantity);
  }

  const tenHienThi = (variantId: string) => {
    const b = banDoBienThe.get(variantId);
    if (!b) return "";
    return `${theoNgonNgu(duLieu.lang, b.product.nameVi, b.product.nameEn)} — ${theoNgonNgu(duLieu.lang, b.labelVi, b.labelEn)}`;
  };
  const baoLoiKho = (variantId: string, loai: "het" | "khongDu") =>
    (loai === "het" ? t.datHang.loiHetHang : t.datHang.loiKhongDu).replace(
      "{ten}",
      tenHienThi(variantId),
    );

  // Kiểm tra sơ bộ trước, để báo lỗi rõ ràng mà không phải mở giao dịch
  for (const [variantId, soLuong] of tongTheoCo) {
    const b = banDoBienThe.get(variantId);
    if (!b || !b.product.isActive) continue;
    if (!b.inStock || !b.product.inStock || (b.stock !== null && b.stock <= 0)) {
      return { thanhCong: false, loi: baoLoiKho(variantId, "het") };
    }
    if (b.stock !== null && b.stock < soLuong) {
      return { thanhCong: false, loi: baoLoiKho(variantId, "khongDu") };
    }
  }

  const monHang = duLieu.items.flatMap((mon) => {
    const bienThe = banDoBienThe.get(mon.variantId);
    // Sản phẩm đã bị xoá hoặc tắt sau khi khách cho vào giỏ → bỏ qua
    if (!bienThe || !bienThe.product.isActive) return [];

    const anh =
      bienThe.product.images.find((a) => a.isMain) ?? bienThe.product.images[0];

    return [
      {
        variantId: bienThe.id,
        productName: bienThe.product.nameVi,
        variantLabel: bienThe.labelVi,
        sku: bienThe.product.sku,
        imageUrl: anh?.url ?? null,
        unitPrice: bienThe.price,
        quantity: mon.quantity,
        lineTotal: bienThe.price * mon.quantity,
        stockDeducted: bienThe.stock !== null ? mon.quantity : 0,
      },
    ];
  });

  if (monHang.length === 0) {
    return { thanhCong: false, loi: t.datHang.loiGioTrong };
  }

  const subtotal = monHang.reduce((tong, m) => tong + m.lineTotal, 0);

  try {
    const { don, conLaiSauDat } = await prisma.$transaction(async (tx) => {
      // Trừ kho trước. Hết hàng giữa chừng thì ném lỗi, cả giao dịch huỷ,
      // không có đơn nào được lưu và kho không bị trừ sót.
      const conLaiSauDat = new Map<string, number>();
      for (const [variantId, soLuong] of tongTheoCo) {
        const b = banDoBienThe.get(variantId);
        if (!b || !b.product.isActive) continue;
        const conLai = await truKho(tx, variantId, soLuong);
        if (conLai !== null) conLaiSauDat.set(variantId, conLai);
      }

      // Sinh mã đơn theo số thứ tự trong ngày
      const dauNgay = new Date();
      dauNgay.setHours(0, 0, 0, 0);
      const soDonHomNay = await tx.order.count({
        where: { createdAt: { gte: dauNgay } },
      });

      const don = await tx.order.create({
        data: {
          code: taoMaDonHang(soDonHomNay + 1),
          customerName: duLieu.customerName,
          phone: duLieu.phone,
          address: duLieu.address,
          province: duLieu.province || null,
          note: duLieu.note || null,
          subtotal,
          shippingFee: 0, // Chính sách miễn phí vận chuyển toàn quốc
          total: subtotal,
          items: { create: monHang },
        },
        include: { items: true },
      });

      for (const [variantId, conLai] of conLaiSauDat) {
        await tx.stockMovement.create({
          data: {
            variantId,
            change: -(tongTheoCo.get(variantId) ?? 0),
            stockAfter: conLai,
            reason: "ORDER",
            orderId: don.id,
            orderCode: don.code,
          },
        });
      }

      return { don, conLaiSauDat };
    });

    // Kho vừa thay đổi thì làm mới website, để cỡ nào vừa hết là khách
    // khác thấy "Tạm hết hàng" ngay
    if (conLaiSauDat.size > 0) {
      try {
        revalidatePath("/", "layout");
      } catch (loi) {
        console.error("Không làm mới được trang sau khi trừ kho:", loi);
      }
    }

    // Nhắc shop những cỡ sắp hết hoặc vừa hết sau đơn này
    const canhBaoKho = [...conLaiSauDat]
      .filter(([, conLai]) => conLai <= NGUONG_SAP_HET)
      .map(([variantId, conLai]) => {
        const b = banDoBienThe.get(variantId)!;
        return `${b.product.nameVi} — ${b.labelVi}: ${conLai <= 0 ? "ĐÃ HẾT" : `còn ${conLai}`}`;
      });

    // Báo cho shop qua cả hai kênh. Telegram nhanh nhưng nhà mạng Việt Nam
    // thỉnh thoảng chặn, nên có email dự phòng.
    //
    // Đơn đã lưu xong rồi, nên từ đây trở đi mọi lỗi đều phải nuốt: gửi
    // thông báo hỏng thì shop tự vào /admin xem, tuyệt đối không được báo
    // lỗi cho khách và khiến khách đặt lại thành hai đơn.
    await Promise.allSettled([
      guiThongBaoDonHang({
        code: don.code,
        customerName: don.customerName,
        phone: don.phone,
        address: don.address,
        note: don.note,
        total: don.total,
        items: don.items,
        canhBaoKho,
      }),
      guiEmailDonHang({
        code: don.code,
        customerName: don.customerName,
        phone: don.phone,
        address: don.address,
        province: don.province,
        note: don.note,
        total: don.total,
        items: don.items,
      }),
    ]);

    return { thanhCong: true, maDon: don.code };
  } catch (loi) {
    if (loi instanceof LoiKho) {
      return { thanhCong: false, loi: baoLoiKho(loi.variantId, loi.loai) };
    }
    console.error("Lỗi khi lưu đơn hàng:", loi);
    return { thanhCong: false, loi: t.datHang.loiChung };
  }
}
