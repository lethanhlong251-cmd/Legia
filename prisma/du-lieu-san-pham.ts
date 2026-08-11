/**
 * DỮ LIỆU 13 SẢN PHẨM BAN ĐẦU
 * ---------------------------
 * File này chỉ dùng để nạp dữ liệu lần đầu (`npm run nap-du-lieu`).
 * Sau khi website chạy, hãy sửa sản phẩm trong trang /admin,
 * KHÔNG sửa file này nữa — sửa ở đây sẽ không có tác dụng.
 *
 * Giá đã bao gồm phí vận chuyển (chính sách miễn ship toàn quốc).
 * `giaGach` là giá gạch ngang hiển thị bên cạnh, để trống nếu không muốn hiện.
 */

export type BienTheNap = {
  labelVi: string;
  labelEn: string;
  price: number;
  comparePrice?: number;
  noteVi?: string;
  noteEn?: string;
};

export type SanPhamNap = {
  sku: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  chuaDatTen?: boolean;
  shortDescVi: string;
  shortDescEn: string;
  descVi: string;
  descEn: string;
  faceCount?: number;
  diameter?: string;
  noteVi?: string;
  noteEn?: string;
  isFeatured?: boolean;
  inStock?: boolean;
  variants: BienTheNap[];
};

/** Giá gạch ngang = giá bán làm tròn lên khoảng 25% */
const gach = (gia: number) => Math.round((gia * 1.25) / 10000) * 10000;

const MO_TA_CHUNG_VI = `Khuôn lò xo nhấn tay, thao tác nhẹ và dứt khoát, hoa văn nổi rõ từng chi tiết ngay ở lần nhấn đầu tiên.

Mẫu hoa văn do Thạch Lan thiết kế riêng và Chourmas là đơn vị phân phối chính thức — bạn sẽ không tìm thấy bộ hoa văn này ở nơi nào khác.

Ngoài bánh trung thu, khuôn còn dùng được cho bánh dẻo, xôi đậu, bánh in và rau câu.`;

const MO_TA_CHUNG_EN = `A hand-press spring mold: one firm push and the pattern comes out sharp on the very first try.

The patterns are designed by Thach Lan, and Chourmas is the official distributor — you will not find this set anywhere else.

Beyond baked mooncakes, the mold also works for snow-skin mooncakes, sticky rice cakes, pressed cakes and jelly.`;

export const SAN_PHAM: SanPhamNap[] = [
  {
    sku: "LX-001/4",
    slug: "sen-tu-quy",
    nameVi: "Sen tứ quý",
    nameEn: "Four Seasons Lotus",
    shortDescVi: "Khuôn lò xo 1 nhấn 4 mặt hoa",
    shortDescEn: "Spring mold, one press, four floral faces",
    descVi: `Bộ Sen tứ quý gồm một thân khuôn lò xo và bốn mặt hoa văn hoa sen — mẫu bán chạy nhất của Chourmas.

${MO_TA_CHUNG_VI}`,
    descEn: `The Four Seasons Lotus set pairs one spring-loaded body with four lotus pattern faces — the best seller at Chourmas.

${MO_TA_CHUNG_EN}`,
    faceCount: 4,
    noteVi:
      "Cỡ 150g đựng vừa khay số 9, cỡ 200g đựng vừa khay số 10. Mỗi bộ gồm 1 nhấn lò xo 4 mặt hoa.",
    noteEn:
      "The 150g size fits a No. 9 tray, the 200g size fits a No. 10 tray. Each set includes one spring press with four floral faces.",
    isFeatured: true,
    variants: [
      { labelVi: "Cỡ 75g", labelEn: "75g", price: 159000, comparePrice: gach(159000) },
      {
        labelVi: "Cỡ 150g",
        labelEn: "150g",
        price: 229000,
        comparePrice: gach(229000),
        noteVi: "Đựng vừa khay số 9",
        noteEn: "Fits a No. 9 tray",
      },
      {
        labelVi: "Cỡ 200g",
        labelEn: "200g",
        price: 259000,
        comparePrice: gach(259000),
        noteVi: "Đựng vừa khay số 10",
        noteEn: "Fits a No. 10 tray",
      },
    ],
  },

  {
    sku: "LX-002/4",
    slug: "lx-002-4",
    nameVi: "Khuôn lò xo LX-002/4",
    nameEn: "Spring Mold LX-002/4",
    chuaDatTen: true,
    shortDescVi: "Thân khuôn 300g kèm 4 mặt rời thay được",
    shortDescEn: "300g body with four interchangeable faces",
    descVi: `Bộ khuôn cỡ lớn 300g, đường kính khoảng 13cm. Điểm khác biệt: bốn mặt hoa văn tháo rời và thay được trên cùng một thân khuôn, nên chỉ với một bộ bạn đã có bốn kiểu bánh.

${MO_TA_CHUNG_VI}`,
    descEn: `A large 300g mold, roughly 13cm across. What sets it apart: the four pattern faces detach and swap onto a single body, so one set gives you four different cakes.

${MO_TA_CHUNG_EN}`,
    faceCount: 4,
    diameter: "khoảng 13 cm",
    noteVi:
      "Gồm 1 thân khuôn lò xo và 4 mặt rời để thay, không bán lẻ từng mặt. Hàng về sau 10 ngày kể từ khi đặt.",
    noteEn:
      "Includes one spring body and four swappable faces; faces are not sold separately. Ships about 10 days after ordering.",
    variants: [
      {
        labelVi: "Bộ đầy đủ — cỡ 300g",
        labelEn: "Full set — 300g",
        price: 390000,
        comparePrice: gach(390000),
        noteVi: "1 thân khuôn + 4 mặt rời",
        noteEn: "One body + four faces",
      },
    ],
  },

  {
    sku: "LX-003/4",
    slug: "ca-doi-vuong",
    nameVi: "Cá đôi vuông",
    nameEn: "Twin Fish Square",
    shortDescVi: "Khuôn vuông 4 mặt, có mặt cá đôi cầu may",
    shortDescEn: "Square mold, four faces, including the lucky twin fish",
    descVi: `Khuôn vuông bốn mặt, nổi bật với mặt cá đôi — hình tượng cầu tài lộc và sung túc quen thuộc trong văn hoá Việt. Ba mặt còn lại là hoa mẫu đơn, hoa cúc và hoa thị.

${MO_TA_CHUNG_VI}`,
    descEn: `A square four-face mold led by its twin fish plate — a familiar Vietnamese emblem of prosperity and abundance. The other three faces carry peony, chrysanthemum and star-flower patterns.

${MO_TA_CHUNG_EN}`,
    faceCount: 4,
    isFeatured: true,
    variants: [
      { labelVi: "Cỡ 150g", labelEn: "150g", price: 165000, comparePrice: gach(165000) },
      { labelVi: "Cỡ 200g", labelEn: "200g", price: 175000, comparePrice: gach(175000) },
    ],
  },

  {
    sku: "LX-04/2",
    slug: "heo-cute",
    nameVi: "Heo Cute",
    nameEn: "Cute Piglet",
    shortDescVi: "Khuôn 2 mặt hình heo, trẻ con rất thích",
    shortDescEn: "Two-face piglet mold that children adore",
    descVi: `Mẫu khuôn hai mặt hình chú heo bụ bẫm, đường nét tròn trịa dễ thương. Đây là mẫu được các mẹ chọn nhiều nhất khi làm bánh cho con.

${MO_TA_CHUNG_VI}`,
    descEn: `A two-face mold shaped as a plump little piglet, all round and friendly lines. This is the design parents pick most often when baking for their children.

${MO_TA_CHUNG_EN}`,
    faceCount: 2,
    variants: [
      { labelVi: "Cỡ 75g", labelEn: "75g", price: 150000, comparePrice: gach(150000) },
      { labelVi: "Cỡ 150g", labelEn: "150g", price: 200000, comparePrice: gach(200000) },
      {
        labelVi: "Combo 150g + 75g",
        labelEn: "Bundle 150g + 75g",
        price: 335000,
        comparePrice: 350000,
        noteVi: "Tiết kiệm hơn mua lẻ hai cỡ",
        noteEn: "Cheaper than buying both sizes separately",
      },
    ],
  },

  {
    sku: "LX-05/5",
    slug: "vuong-sen",
    nameVi: "Vuông Sen",
    nameEn: "Lotus Square",
    shortDescVi: "Khuôn vuông 5 mặt hoa sen",
    shortDescEn: "Square mold with five lotus faces",
    descVi: `Năm mặt hoa văn sen trên một thân khuôn vuông. Hoa sen được khắc sâu, cánh rõ nét kể cả khi đóng bánh dẻo mềm.

${MO_TA_CHUNG_VI}`,
    descEn: `Five lotus faces on one square body. The lotus is cut deep, so the petals stay crisp even with soft snow-skin dough.

${MO_TA_CHUNG_EN}`,
    faceCount: 5,
    isFeatured: true,
    noteVi:
      "Cỡ 150g đóng được bánh 150-180g. Cỡ 200g đóng được bánh 200-220g. Đóng nặng hơn 250g bánh sẽ bị chân cao, không đẹp.",
    noteEn:
      "The 150g size presses cakes of 150-180g; the 200g size presses 200-220g. Going over 250g leaves the cake with a tall foot and spoils the shape.",
    variants: [
      {
        labelVi: "Cỡ 150g",
        labelEn: "150g",
        price: 239000,
        comparePrice: gach(239000),
        noteVi: "Đóng bánh 150-180g",
        noteEn: "For cakes of 150-180g",
      },
      {
        labelVi: "Cỡ 200g",
        labelEn: "200g",
        price: 259000,
        comparePrice: gach(259000),
        noteVi: "Đóng bánh 200-220g",
        noteEn: "For cakes of 200-220g",
      },
    ],
  },

  {
    sku: "LX-06/3",
    slug: "mau-don-sen-cuc",
    nameVi: "Mẫu đơn – Sen – Cúc",
    nameEn: "Peony – Lotus – Chrysanthemum",
    shortDescVi: "Bộ 3 mặt cỡ đại 300g, đường kính 12,8cm",
    shortDescEn: "Three-face set, large 300g size, 12.8cm across",
    descVi: `Bộ khuôn cỡ đại ba mặt: mẫu đơn tượng trưng cho phú quý, sen cho thanh cao, cúc cho trường thọ. Đường kính 12,8cm, đóng được bánh 300-400g.

Ngoài bánh trung thu, nhiều khách dùng bộ này để đóng xôi đậu và bánh in — mặt khuôn rộng nên xôi ra rất đẹp.

${MO_TA_CHUNG_VI}`,
    descEn: `A large three-face set: peony for prosperity, lotus for grace, chrysanthemum for long life. It measures 12.8cm across and presses cakes of 300-400g.

Many customers also use this set for sticky rice and pressed cakes — the wide face gives a beautiful result.

${MO_TA_CHUNG_EN}`,
    faceCount: 3,
    diameter: "khoảng 12,8 cm",
    noteVi:
      "Mặt cúc bán lẻ chỉ dành cho khách đã có sẵn bộ 2 mặt sen và mẫu đơn. Mặt cúc KHÔNG lắp vừa các thân khuôn lò xo khác.",
    noteEn:
      "The single chrysanthemum face is only for customers who already own the two-face lotus and peony set. It does NOT fit other spring mold bodies.",
    variants: [
      {
        labelVi: "Bộ đầy đủ 3 mặt — cỡ 300g",
        labelEn: "Full three-face set — 300g",
        price: 450000,
        comparePrice: gach(450000),
      },
      {
        labelVi: "Mua lẻ mặt cúc",
        labelEn: "Chrysanthemum face only",
        price: 73000,
        noteVi: "Chỉ dành cho khách đã có bộ 2 mặt",
        noteEn: "Only for customers who own the two-face set",
      },
    ],
  },

  {
    sku: "LX-07/4",
    slug: "lx-007-4",
    nameVi: "Khuôn lò xo LX-007/4",
    nameEn: "Spring Mold LX-007/4",
    chuaDatTen: true,
    shortDescVi: "Khuôn lò xo 1 nhấn 4 mặt hoa văn",
    shortDescEn: "Spring mold, one press, four pattern faces",
    descVi: `Bộ khuôn lò xo bốn mặt hoa văn, thao tác một nhấn.

${MO_TA_CHUNG_VI}`,
    descEn: `A four-face spring mold worked with a single press.

${MO_TA_CHUNG_EN}`,
    faceCount: 4,
    variants: [
      { labelVi: "Cỡ 150g", labelEn: "150g", price: 239000, comparePrice: gach(239000) },
      { labelVi: "Cỡ 200g", labelEn: "200g", price: 259000, comparePrice: gach(259000) },
    ],
  },

  {
    sku: "LX-08/5",
    slug: "thach-lan",
    nameVi: "Thạch Lan",
    nameEn: "Thach Lan",
    shortDescVi: "Bộ 5 mặt mang tên nhà thiết kế",
    shortDescEn: "The five-face set that carries the designer's name",
    descVi: `Bộ khuôn năm mặt mang chính tên nhà thiết kế Thạch Lan — mẫu được xem là đại diện cho phong cách hoa văn của xưởng.

${MO_TA_CHUNG_VI}`,
    descEn: `A five-face set carrying the name of designer Thach Lan — the design regarded as the signature of the workshop's style.

${MO_TA_CHUNG_EN}`,
    faceCount: 5,
    isFeatured: true,
    variants: [
      { labelVi: "Cỡ 75g", labelEn: "75g", price: 199000, comparePrice: gach(199000) },
      { labelVi: "Cỡ 150g", labelEn: "150g", price: 259000, comparePrice: gach(259000) },
    ],
  },

  {
    sku: "LX-09/5",
    slug: "lx-009-5",
    nameVi: "Khuôn lò xo LX-009/5",
    nameEn: "Spring Mold LX-009/5",
    chuaDatTen: true,
    shortDescVi: "Khuôn lò xo 1 nhấn 5 mặt hoa văn",
    shortDescEn: "Spring mold, one press, five pattern faces",
    descVi: `Bộ khuôn lò xo năm mặt hoa văn, thao tác một nhấn.

${MO_TA_CHUNG_VI}`,
    descEn: `A five-face spring mold worked with a single press.

${MO_TA_CHUNG_EN}`,
    faceCount: 5,
    variants: [
      { labelVi: "Cỡ 150g", labelEn: "150g", price: 239000, comparePrice: gach(239000) },
    ],
  },

  {
    sku: "LX-10/4",
    slug: "bo-than-tai",
    nameVi: "Bộ thần tài",
    nameEn: "God of Fortune Set",
    shortDescVi: "Khuôn 4 mặt chủ đề tài lộc",
    shortDescEn: "Four-face mold on a prosperity theme",
    descVi: `Bộ bốn mặt chủ đề tài lộc — mẫu được đặt nhiều nhất để làm bánh biếu tặng dịp Trung thu, đặc biệt là quà tặng đối tác làm ăn.

${MO_TA_CHUNG_VI}`,
    descEn: `A four-face set on a fortune theme — the design most often ordered for gift cakes at Mid-Autumn, especially gifts for business partners.

${MO_TA_CHUNG_EN}`,
    faceCount: 4,
    variants: [
      { labelVi: "Cỡ 150g", labelEn: "150g", price: 239000, comparePrice: gach(239000) },
      { labelVi: "Cỡ 200g", labelEn: "200g", price: 259000, comparePrice: gach(259000) },
    ],
  },

  {
    sku: "LX-11/7",
    slug: "lx-011-7",
    nameVi: "Khuôn lò xo LX-011/7",
    nameEn: "Spring Mold LX-011/7",
    chuaDatTen: true,
    shortDescVi: "Bộ nhiều mặt nhất — 7 mặt hoa văn",
    shortDescEn: "The largest set — seven pattern faces",
    descVi: `Bộ khuôn có nhiều mặt nhất tại Chourmas: bảy mặt hoa văn khác nhau trên cùng một thân khuôn, từ hoa cúc, hoa sen, mẫu đơn, chữ Thọ, tre trúc, mặt cười cho tới chim công.

Nếu bạn làm bánh bán hoặc muốn một mâm bánh mỗi chiếc một kiểu, đây là bộ đáng đầu tư nhất.

${MO_TA_CHUNG_VI}`,
    descEn: `The largest set at Chourmas: seven different pattern faces on one body — chrysanthemum, lotus, peony, the Longevity character, bamboo, a smiling face, and a peacock.

If you bake to sell, or want a tray where no two cakes look alike, this is the set worth investing in.

${MO_TA_CHUNG_EN}`,
    faceCount: 7,
    isFeatured: true,
    variants: [
      { labelVi: "Cỡ 150g", labelEn: "150g", price: 279000, comparePrice: gach(279000) },
      { labelVi: "Cỡ 200g", labelEn: "200g", price: 299000, comparePrice: gach(299000) },
    ],
  },

  {
    sku: "LX-12/05",
    slug: "bo-ngu-hoa",
    nameVi: "Bộ ngũ hoa",
    nameEn: "Five Flowers Set",
    shortDescVi: "5 mặt, mỗi mặt một loài hoa",
    shortDescEn: "Five faces, one flower on each",
    descVi: `Năm mặt hoa văn, mỗi mặt một loài hoa khác nhau. Một bộ là đủ cho cả mâm bánh đa dạng mà không cần mua thêm khuôn.

${MO_TA_CHUNG_VI}`,
    descEn: `Five pattern faces, a different flower on each. One set is enough for a varied tray without buying another mold.

${MO_TA_CHUNG_EN}`,
    faceCount: 5,
    variants: [
      { labelVi: "Cỡ 150g", labelEn: "150g", price: 249000, comparePrice: gach(249000) },
      { labelVi: "Cỡ 200g", labelEn: "200g", price: 269000, comparePrice: gach(269000) },
    ],
  },

  {
    sku: "PHO-VN/5",
    slug: "pho-viet-nam",
    nameVi: "Phở Việt Nam",
    nameEn: "Vietnamese Pho",
    shortDescVi: "Bộ 5 mặt chủ đề phở — số lượng có hạn",
    shortDescEn: "Five-face set on a pho theme — limited quantity",
    descVi: `Bộ khuôn độc đáo nhất trong bộ sưu tập: hoa văn lấy cảm hứng từ phở — món ăn đại diện cho ẩm thực Việt Nam trên bản đồ thế giới.

Khuôn cỡ 300g, đường kính 12,8cm. Đây là mẫu giới hạn, số lượng có hạn và không sản xuất thêm.

${MO_TA_CHUNG_VI}`,
    descEn: `The most unusual set in the collection: patterns drawn from pho — the dish that put Vietnamese cooking on the world map.

A 300g mold, 12.8cm across. This is a limited design; quantities are finite and no more will be made.

${MO_TA_CHUNG_EN}`,
    faceCount: 5,
    diameter: "12,8 cm",
    noteVi: "Mẫu giới hạn, số lượng có hạn.",
    noteEn: "Limited design, finite quantity.",
    isFeatured: true,
    variants: [
      {
        labelVi: "Bộ đầy đủ — cỡ 300g",
        labelEn: "Full set — 300g",
        price: 400000,
        comparePrice: gach(400000),
        noteVi: "Gồm thùng khuôn và 5 mặt",
        noteEn: "Includes the body and all five faces",
      },
      {
        labelVi: "Chỉ 5 mặt rời",
        labelEn: "Five faces only",
        price: 300000,
        noteVi: "Không kèm thùng khuôn — dành cho khách đã có sẵn thân khuôn",
        noteEn: "No body included — for customers who already own one",
      },
    ],
  },
];
