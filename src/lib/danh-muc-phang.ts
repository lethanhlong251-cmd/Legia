import "server-only";
import { prisma } from "./prisma";

/**
 * Trả về danh mục dạng danh sách phẳng, kèm cấp độ, để đổ vào ô chọn
 * trong trang quản trị. Danh mục con hiện thụt vào so với danh mục cha.
 */
export async function layDanhMucPhang() {
  const tatCa = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameVi: "asc" }],
  });

  const theoCha = new Map<string | null, typeof tatCa>();
  for (const dm of tatCa) {
    const khoa = dm.parentId ?? null;
    if (!theoCha.has(khoa)) theoCha.set(khoa, []);
    theoCha.get(khoa)!.push(dm);
  }

  const ketQua: { id: string; nameVi: string; capDo: number }[] = [];

  function duyet(cha: string | null, capDo: number) {
    for (const dm of theoCha.get(cha) ?? []) {
      ketQua.push({ id: dm.id, nameVi: dm.nameVi, capDo });
      duyet(dm.id, capDo + 1);
    }
  }
  duyet(null, 0);

  return ketQua;
}
