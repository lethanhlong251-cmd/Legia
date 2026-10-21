import type { Prisma } from "@/generated/prisma/client";
import type { OrderStatus } from "@/generated/prisma/enums";

/**
 * TỒN KHO
 * -------
 * Mỗi cỡ (biến thể) có một con số `stock`:
 *   - null  → không theo dõi kho, chỉ dựa vào công tắc "Còn hàng" như cũ
 *   - số    → khách đặt tự trừ, huỷ đơn tự cộng lại, về 0 thì tự hết hàng
 *
 * Mọi thay đổi số lượng đều đi qua các hàm trong file này và đều ghi một
 * dòng vào bảng StockMovement, để lúc nào cũng tra lại được vì sao kho
 * còn đúng con số đó.
 */

/** Còn từ ngần này chiếc trở xuống thì coi là sắp hết */
export const NGUONG_SAP_HET = 5;

type Tx = Prisma.TransactionClient;

/** Cỡ này khách có đặt được không */
export function bienTheConBan(b: { inStock: boolean; stock: number | null }) {
  return b.inStock && (b.stock === null || b.stock > 0);
}

/**
 * Tính lại trạng thái còn hàng thực tế cho phần website khách xem, rồi bỏ
 * hẳn con số tồn kho đi để nó không bao giờ bị gửi xuống trình duyệt.
 */
export function apDungTonKho<
  SP extends {
    inStock: boolean;
    variants: { inStock: boolean; stock: number | null }[];
  },
>(
  sp: SP,
): Omit<SP, "variants"> & {
  variants: Omit<SP["variants"][number], "stock">[];
} {
  type V = Omit<SP["variants"][number], "stock">;
  const variants = sp.variants.map(({ stock, ...con }) => ({
    ...con,
    inStock: bienTheConBan({ inStock: con.inStock, stock }),
  })) as V[];
  return {
    ...sp,
    // Sản phẩm vẫn "còn hàng" khi ít nhất một cỡ còn đặt được
    inStock:
      sp.inStock &&
      (variants.length === 0 || variants.some((b) => b.inStock)),
    variants,
  };
}

export class LoiKho extends Error {
  constructor(
    public variantId: string,
    public loai: "het" | "khongDu",
    message?: string,
  ) {
    super(message ?? `Kho không đủ cho ${variantId}`);
  }
}

/**
 * Trừ kho cho một cỡ, CHỈ khi còn đủ hàng. Kiểm tra và trừ diễn ra trong
 * cùng một câu lệnh, nên hai khách bấm đặt cùng lúc món cuối cùng thì chỉ
 * một người đặt được, không bao giờ bán lố.
 * Trả về số còn lại, hoặc null nếu cỡ này không theo dõi kho.
 */
export async function truKho(
  tx: Tx,
  variantId: string,
  soLuong: number,
): Promise<number | null> {
  const bienThe = await tx.productVariant.findUnique({
    where: { id: variantId },
    select: { stock: true },
  });
  if (!bienThe || bienThe.stock === null) return null;

  const kq = await tx.productVariant.updateMany({
    where: { id: variantId, stock: { gte: soLuong } },
    data: { stock: { decrement: soLuong } },
  });
  if (kq.count === 0) {
    throw new LoiKho(variantId, bienThe.stock <= 0 ? "het" : "khongDu");
  }

  const sau = await tx.productVariant.findUniqueOrThrow({
    where: { id: variantId },
    select: { stock: true },
  });
  return sau.stock;
}

export type ThayDoiKho = {
  variantId: string;
  stockAfter: number;
};

/**
 * Đồng bộ kho khi đơn đổi trạng thái:
 *   - chuyển sang Đã huỷ   → cộng lại đúng số đã trừ
 *   - mở lại đơn đã huỷ    → trừ kho lại (không đủ hàng thì báo lỗi)
 * Các trạng thái khác (xác nhận, đang giao, đã giao) không đụng tới kho,
 * vì hàng đã được giữ cho khách ngay từ lúc đặt.
 */
export async function dongBoKhoKhiDoiTrangThai(
  tx: Tx,
  idDon: string,
  trangThaiMoi: OrderStatus,
): Promise<ThayDoiKho[]> {
  const don = await tx.order.findUnique({
    where: { id: idDon },
    include: { items: { include: { variant: true } } },
  });
  if (!don) return [];

  const huyDon = don.status !== "CANCELLED" && trangThaiMoi === "CANCELLED";
  const moLai = don.status === "CANCELLED" && trangThaiMoi !== "CANCELLED";
  const thayDoi: ThayDoiKho[] = [];

  if (huyDon) {
    for (const mon of don.items) {
      if (mon.stockDeducted <= 0) continue;
      // Cỡ đã bị xoá hoặc đã tắt theo dõi kho thì không còn gì để cộng
      if (mon.variant && mon.variant.stock !== null) {
        const sau = await tx.productVariant.update({
          where: { id: mon.variant.id },
          data: { stock: { increment: mon.stockDeducted } },
        });
        await tx.stockMovement.create({
          data: {
            variantId: mon.variant.id,
            change: mon.stockDeducted,
            stockAfter: sau.stock ?? 0,
            reason: "CANCEL",
            orderId: don.id,
            orderCode: don.code,
          },
        });
        thayDoi.push({ variantId: mon.variant.id, stockAfter: sau.stock ?? 0 });
      }
      await tx.orderItem.update({
        where: { id: mon.id },
        data: { stockDeducted: 0 },
      });
    }
  }

  if (moLai) {
    for (const mon of don.items) {
      if (!mon.variant || mon.variant.stock === null) continue;
      let conLai: number | null;
      try {
        conLai = await truKho(tx, mon.variant.id, mon.quantity);
      } catch (loi) {
        if (loi instanceof LoiKho) {
          throw new LoiKho(
            mon.variant.id,
            loi.loai,
            `Không mở lại được đơn ${don.code}: kho "${mon.productName} — ${mon.variantLabel}" chỉ còn ${mon.variant.stock}, đơn cần ${mon.quantity}. Hãy nhập thêm hàng ở trang Tồn kho trước.`,
          );
        }
        throw loi;
      }
      if (conLai === null) continue;
      await tx.stockMovement.create({
        data: {
          variantId: mon.variant.id,
          change: -mon.quantity,
          stockAfter: conLai,
          reason: "REOPEN",
          orderId: don.id,
          orderCode: don.code,
        },
      });
      await tx.orderItem.update({
        where: { id: mon.id },
        data: { stockDeducted: mon.quantity },
      });
      thayDoi.push({ variantId: mon.variant.id, stockAfter: conLai });
    }
  }

  return thayDoi;
}

export const TEN_LY_DO: Record<string, string> = {
  IMPORT: "Nhập hàng",
  ADJUST: "Kiểm kho",
  ORDER: "Khách đặt",
  CANCEL: "Huỷ đơn, hoàn kho",
  REOPEN: "Mở lại đơn",
};
