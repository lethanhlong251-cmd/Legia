import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { layBanDich, laNgonNguHopLe } from "@/i18n";
import { layCaiDat } from "@/lib/du-lieu";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/huong-dan">): Promise<Metadata> {
  const { lang } = await params;
  const t = layBanDich(lang);
  return {
    title: t.huongDan.tieuDe,
    description: t.huongDan.moTa,
    alternates: { canonical: `/${lang}/huong-dan` },
  };
}

/**
 * Nội dung hướng dẫn nằm ngay trong file này để dễ sửa.
 * Muốn thêm một mục hỏi đáp: thêm một phần tử vào mảng bên dưới.
 */
const NOI_DUNG = {
  vi: {
    chonCo: {
      tieuDe: "Chọn cỡ khuôn cho đúng",
      cacY: [
        "Cỡ khuôn ghi trên sản phẩm là trọng lượng bánh, không phải trọng lượng khuôn. Khuôn 150g đóng bánh nặng khoảng 150g.",
        "Khuôn 150g đựng vừa khay số 9. Khuôn 200g đựng vừa khay số 10. Nếu bạn đã có sẵn khay, cứ theo số khay mà chọn.",
        "Mỗi cỡ khuôn có khoảng co giãn nhất định — ví dụ khuôn 150g đóng được bánh 150 đến 180g. Nhồi quá nhiều bột, bánh sẽ bị chân cao và mất nét.",
        "Làm bánh biếu tặng thì nên chọn cỡ 150g hoặc 200g. Cỡ 75g hợp làm bánh cho trẻ con hoặc bán theo hộp nhiều chiếc.",
      ],
    },
    dongBanh: {
      tieuDe: "Đóng bánh sắc nét",
      cacY: [
        "Trước lần đóng đầu tiên, rửa khuôn bằng nước ấm và lau thật khô. Khuôn còn ẩm sẽ làm bột dính.",
        "Rắc một lớp bột áo thật mỏng vào lòng khuôn rồi dốc ngược cho rơi hết phần thừa. Bột áo dày sẽ lấp mất các nét khắc nhỏ.",
        "Vê bột thành khối tròn nhỏ hơn lòng khuôn một chút rồi mới cho vào. Nhét khối bột quá to sẽ làm bột tràn ra mép.",
        "Nhấn dứt khoát một lần, giữ khoảng 2 đến 3 giây rồi mới nhả. Nhấn rồi nhả liên tục nhiều lần sẽ làm hoa văn bị nhoè.",
        "Nhấc khuôn lên theo phương thẳng đứng, không nghiêng hay xoay.",
      ],
    },
    giuBen: {
      tieuDe: "Giữ khuôn bền lâu",
      cacY: [
        "Rửa ngay sau khi dùng bằng nước ấm và bàn chải mềm. Bột khô cứng lại trong khe hoa văn rất khó lấy ra.",
        "Không ngâm khuôn trong nước lâu, không rửa bằng nước quá nóng và không cho vào máy rửa bát.",
        "Lau khô hoàn toàn, đặc biệt là phần lò xo, rồi mới cất. Cất khi còn ẩm sẽ làm lò xo kém đàn hồi.",
        "Cất nơi khô ráo, tránh ánh nắng trực tiếp và tránh để vật nặng đè lên mặt khuôn.",
      ],
    },
    hoiDap: {
      tieuDe: "Câu hỏi thường gặp",
      cacY: [
        "Khuôn có dùng cho bánh dẻo được không? Được. Bánh dẻo mềm nên còn ra nét đẹp hơn cả bánh nướng.",
        "Có đóng được xôi đậu, bánh in, rau câu không? Được, nhiều khách vẫn dùng khuôn cho những món này, nhất là các bộ cỡ lớn 300g.",
        "Bánh bị dính khuôn phải làm sao? Gần như luôn do quên bột áo hoặc khuôn còn ẩm. Rắc bột áo mỏng và lau khuôn thật khô là hết.",
        "Có thể thay mặt hoa văn giữa các bộ khuôn khác nhau không? Không. Mỗi mặt chỉ lắp vừa đúng thân khuôn của bộ đó.",
      ],
    },
  },
  en: {
    chonCo: {
      tieuDe: "Choosing the right size",
      cacY: [
        "The size printed on a mold is the weight of the cake, not of the mold. A 150g mold presses a cake of roughly 150g.",
        "A 150g mold fits a No. 9 tray; a 200g mold fits a No. 10 tray. If you already own trays, choose by tray number.",
        "Each size has some room to move — a 150g mold handles cakes from 150 to 180g. Overfill it and the cake gets a tall foot and loses definition.",
        "For gift cakes, pick 150g or 200g. The 75g size suits cakes for children or boxes with many small pieces.",
      ],
    },
    dongBanh: {
      tieuDe: "Pressing a crisp pattern",
      cacY: [
        "Before the first use, wash the mold in warm water and dry it completely. A damp mold makes dough stick.",
        "Dust the cavity with a very thin layer of flour, then tip it upside down to shed the excess. Too much flour fills in the fine cuts.",
        "Roll the dough into a ball slightly smaller than the cavity before inserting it. Too large and the dough squeezes out at the rim.",
        "Press firmly once, hold for two or three seconds, then release. Repeated pumping blurs the pattern.",
        "Lift the mold straight up, without tilting or twisting.",
      ],
    },
    giuBen: {
      tieuDe: "Making your mold last",
      cacY: [
        "Wash it right after use with warm water and a soft brush. Dough that dries inside the pattern grooves is very hard to remove.",
        "Do not soak the mold, do not use very hot water, and never put it in a dishwasher.",
        "Dry it completely, especially the spring, before storing. Storing it damp weakens the spring.",
        "Keep it somewhere dry, out of direct sunlight, with nothing heavy resting on the pattern face.",
      ],
    },
    hoiDap: {
      tieuDe: "Frequently asked questions",
      cacY: [
        "Can I use it for snow-skin mooncakes? Yes. The softer dough often takes the pattern even better than baked dough.",
        "Does it work for sticky rice, pressed cakes or jelly? Yes, many customers use them for exactly that, especially the large 300g sets.",
        "The cake sticks to the mold — what now? Almost always a missing dusting of flour, or a mold that was still damp. A thin dusting and a properly dried mold fixes it.",
        "Can I swap pattern faces between different sets? No. Each face only fits the body it was made for.",
      ],
    },
  },
} as const;

export default async function TrangHuongDan({
  params,
}: PageProps<"/[lang]/huong-dan">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const t = layBanDich(lang);
  const caiDat = await layCaiDat();
  const noiDung = NOI_DUNG[lang];
  const cacPhan = [
    noiDung.chonCo,
    noiDung.dongBanh,
    noiDung.giuBen,
    noiDung.hoiDap,
  ];

  return (
    <div className="khung max-w-3xl py-12 sm:py-16">
      <h1 className="font-display text-3xl text-muc-900 sm:text-4xl">
        {t.huongDan.tieuDe}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muc-600">
        {t.huongDan.moTa}
      </p>

      <div className="duong-vien-dong mt-6 h-px w-full opacity-50" />

      <div className="mt-10 space-y-11">
        {cacPhan.map((phan, i) => (
          <section key={phan.tieuDe}>
            <h2 className="flex items-baseline gap-3 font-display text-xl text-muc-900">
              <span className="font-display text-2xl text-dong-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              {phan.tieuDe}
            </h2>
            <ul className="mt-4 space-y-3">
              {phan.cacY.map((y) => (
                <li
                  key={y}
                  className="flex gap-3 text-[15px] leading-relaxed text-muc-600"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dong-500" />
                  {y}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-lg border border-dong-300 bg-dong-50 p-6">
        <p className="font-display text-lg text-muc-900">
          {lang === "vi" ? "Vẫn chưa rõ chỗ nào?" : "Still not sure?"}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muc-600">
          {lang === "vi"
            ? "Nhắn Zalo cho shop kèm ảnh chiếc bánh bạn vừa đóng, shop xem và chỉ chỗ cần sửa."
            : "Send us a photo of the cake you just pressed on Zalo and we will tell you what to adjust."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`https://zalo.me/${caiDat.zalo.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nut-chinh"
          >
            {t.trangChu.heroNutPhu}
          </a>
          <Link href={`/${lang}/san-pham`} className="nut-phu">
            {t.trangChu.tatCaSanPham}
          </Link>
        </div>
      </div>
    </div>
  );
}
