/**
 * NỘI DUNG CÁC TRANG CHÍNH SÁCH
 * =============================
 *
 * ⚠️  CẦN BẠN DUYỆT LẠI
 * Những nội dung dưới đây được soạn theo thông lệ chung của thương mại
 * điện tử Việt Nam, KHÔNG phải theo cách vận hành thực tế của bạn.
 * Hãy đọc kỹ và sửa cho khớp — đặc biệt là số ngày đổi trả và ai chịu
 * phí ship khi đổi hàng.
 *
 * Cách sửa: đổi thẳng chữ trong dấu nháy. Muốn thêm một ý, thêm một dòng
 * mới vào mảng `cacY`. Muốn thêm cả một mục, sao chép một khối `{ tieuDe,
 * cacY }` rồi sửa nội dung.
 */

type PhanNoiDung = { tieuDe: string; cacY: string[] };
type TrangChinhSach = { tieuDe: string; cacPhan: PhanNoiDung[] };

export const CHINH_SACH: Record<
  string,
  { vi: TrangChinhSach; en: TrangChinhSach }
> = {
  // ==========================================================
  "van-chuyen": {
    vi: {
      tieuDe: "Chính sách vận chuyển",
      cacPhan: [
        {
          tieuDe: "Phí vận chuyển",
          cacY: [
            "Chourmas miễn phí vận chuyển toàn quốc cho mọi đơn hàng. Giá niêm yết trên website đã bao gồm phí vận chuyển, bạn không phải trả thêm khoản nào cho shipper ngoài giá trị đơn hàng.",
            "Chính sách này áp dụng cho tất cả các tỉnh thành, không phân biệt nội thành hay vùng xa.",
          ],
        },
        {
          tieuDe: "Thời gian giao hàng",
          cacY: [
            "Đơn hàng được xác nhận qua điện thoại trong vòng vài giờ sau khi bạn đặt. Đơn đặt vào buổi tối sẽ được gọi xác nhận vào sáng hôm sau.",
            "Sau khi xác nhận, hàng được gửi đi trong vòng 24 giờ làm việc.",
            "Thời gian giao dự kiến: 2 đến 3 ngày với các tỉnh thành lớn, 3 đến 5 ngày với các khu vực còn lại.", // ⚠️ SỬA CHO ĐÚNG THỰC TẾ
            "Một số mẫu khuôn ghi rõ thời gian chờ hàng riêng ngay trong trang sản phẩm. Trường hợp đó, thời gian chờ được tính thêm vào thời gian giao.",
          ],
        },
        {
          tieuDe: "Đơn vị vận chuyển",
          cacY: [
            "Chourmas gửi hàng qua các đơn vị chuyển phát nhanh có thu hộ (COD).", // ⚠️ ĐIỀN TÊN ĐƠN VỊ BẠN ĐANG DÙNG
            "Bạn sẽ nhận được số điện thoại của shipper trước khi hàng đến.",
          ],
        },
        {
          tieuDe: "Nhận hàng và thanh toán",
          cacY: [
            "Chourmas không yêu cầu chuyển khoản trước dưới bất kỳ hình thức nào.",
            "Bạn được mở hộp kiểm tra hàng trước khi thanh toán cho shipper.",
            "Nếu hàng không đúng như mô tả trên website, bạn có quyền từ chối nhận và không phải trả bất kỳ khoản phí nào.",
          ],
        },
      ],
    },
    en: {
      tieuDe: "Shipping policy",
      cacPhan: [
        {
          tieuDe: "Shipping cost",
          cacY: [
            "Chourmas ships free of charge anywhere in Vietnam. Listed prices already include delivery, so you pay the courier nothing beyond the order value.",
            "This applies to every province, city and rural area alike.",
          ],
        },
        {
          tieuDe: "Delivery time",
          cacY: [
            "We confirm every order by phone within a few hours. Orders placed at night are confirmed the following morning.",
            "Once confirmed, the parcel is dispatched within 24 working hours.",
            "Estimated delivery: 2 to 3 days to major cities, 3 to 5 days elsewhere.",
            "A few molds state their own lead time on the product page. In that case the wait is added to the delivery time.",
          ],
        },
        {
          tieuDe: "Courier",
          cacY: [
            "Chourmas ships through express couriers offering cash on delivery.",
            "You will receive the courier's phone number before the parcel arrives.",
          ],
        },
        {
          tieuDe: "Receiving and paying",
          cacY: [
            "Chourmas never asks for an advance bank transfer of any kind.",
            "You may open and inspect the parcel before paying the courier.",
            "If the goods do not match the description on this website, you may refuse the parcel and owe nothing.",
          ],
        },
      ],
    },
  },

  // ==========================================================
  "doi-tra": {
    vi: {
      tieuDe: "Chính sách đổi trả",
      cacPhan: [
        {
          tieuDe: "Trường hợp được đổi trả",
          cacY: [
            "Khuôn bị nứt, vỡ, gãy lò xo hoặc lỗi kỹ thuật khiến không sử dụng được.",
            "Giao sai mẫu, sai cỡ so với đơn hàng đã xác nhận.",
            "Thiếu mặt khuôn hoặc thiếu phụ kiện so với mô tả trên trang sản phẩm.",
          ],
        },
        {
          tieuDe: "Thời hạn đổi trả",
          cacY: [
            "Trong vòng 7 ngày kể từ ngày nhận hàng.", // ⚠️ SỬA SỐ NGÀY CHO ĐÚNG
            "Vui lòng quay video lúc mở hộp. Video mở hộp giúp shop xử lý cho bạn nhanh hơn rất nhiều khi có lỗi.",
          ],
        },
        {
          tieuDe: "Điều kiện đổi trả",
          cacY: [
            "Khuôn còn nguyên vẹn, chưa qua sử dụng để đóng bánh.",
            "Còn đầy đủ hộp và phụ kiện đi kèm.",
            "Không áp dụng cho khuôn đã dùng rồi mới báo lỗi do va đập hoặc do vệ sinh sai cách.",
          ],
        },
        {
          tieuDe: "Phí đổi trả",
          cacY: [
            "Lỗi từ phía Chourmas (giao sai, thiếu, hàng lỗi): Chourmas chịu toàn bộ phí vận chuyển hai chiều.", // ⚠️ XÁC NHẬN LẠI
            "Đổi vì bạn chọn nhầm cỡ hoặc đổi sang mẫu khác: bạn chịu phí vận chuyển chiều gửi trả.", // ⚠️ XÁC NHẬN LẠI
          ],
        },
        {
          tieuDe: "Cách thực hiện",
          cacY: [
            "Gọi hoặc nhắn Zalo cho Chourmas kèm mã đơn hàng và ảnh hoặc video phần lỗi.",
            "Shop xác nhận và hướng dẫn bạn gửi hàng về trong vòng 24 giờ.",
            "Hàng đổi được gửi đi ngay khi shop nhận được hàng trả.",
          ],
        },
      ],
    },
    en: {
      tieuDe: "Return policy",
      cacPhan: [
        {
          tieuDe: "When a return applies",
          cacY: [
            "The mold is cracked, broken, has a failed spring, or a defect that makes it unusable.",
            "The wrong design or wrong size was delivered against your confirmed order.",
            "A pattern face or accessory described on the product page is missing.",
          ],
        },
        {
          tieuDe: "Time limit",
          cacY: [
            "Within 7 days of receiving the parcel.",
            "Please film the unboxing. An unboxing video lets us resolve any fault far more quickly.",
          ],
        },
        {
          tieuDe: "Conditions",
          cacY: [
            "The mold is intact and has not been used to press cakes.",
            "The box and all accessories are complete.",
            "Not applicable where a fault is reported after use and stems from impact damage or incorrect cleaning.",
          ],
        },
        {
          tieuDe: "Who pays",
          cacY: [
            "Our fault (wrong item, missing part, defect): Chourmas covers shipping both ways.",
            "You chose the wrong size or want a different design: you cover the return shipping.",
          ],
        },
        {
          tieuDe: "How to proceed",
          cacY: [
            "Call or message us on Zalo with your order code and a photo or video of the problem.",
            "We confirm and send return instructions within 24 hours.",
            "The replacement is dispatched as soon as we receive the returned item.",
          ],
        },
      ],
    },
  },

  // ==========================================================
  "bao-mat": {
    vi: {
      tieuDe: "Chính sách bảo mật",
      cacPhan: [
        {
          tieuDe: "Thông tin Chourmas thu thập",
          cacY: [
            "Khi bạn đặt hàng, Chourmas chỉ thu thập những thông tin cần thiết để giao hàng: họ tên, số điện thoại, địa chỉ nhận hàng và ghi chú của bạn.",
            "Chourmas không thu thập thông tin thẻ ngân hàng, vì website không có chức năng thanh toán trực tuyến. Bạn trả tiền mặt trực tiếp cho shipper.",
            "Giỏ hàng của bạn được lưu ngay trong trình duyệt của bạn, không gửi về máy chủ cho tới khi bạn bấm xác nhận đặt hàng.",
          ],
        },
        {
          tieuDe: "Mục đích sử dụng",
          cacY: [
            "Thông tin của bạn chỉ dùng để xác nhận đơn, đóng gói và giao hàng.",
            "Số điện thoại có thể được dùng để gọi xác nhận đơn hoặc báo tình trạng giao hàng.",
            "Chourmas không dùng thông tin của bạn để gửi tin nhắn quảng cáo nếu bạn không đồng ý.",
          ],
        },
        {
          tieuDe: "Chia sẻ thông tin",
          cacY: [
            "Chourmas chỉ chia sẻ tên, số điện thoại và địa chỉ của bạn cho đơn vị vận chuyển, ở mức tối thiểu cần để giao được hàng.",
            "Chourmas không bán, không trao đổi thông tin khách hàng cho bất kỳ bên thứ ba nào khác.",
          ],
        },
        {
          tieuDe: "Quyền của bạn",
          cacY: [
            "Bạn có quyền yêu cầu Chourmas cung cấp, sửa hoặc xoá thông tin cá nhân của bạn trong hệ thống.",
            "Chỉ cần gọi hoặc nhắn Zalo tới số hotline của shop kèm mã đơn hàng.",
          ],
        },
      ],
    },
    en: {
      tieuDe: "Privacy policy",
      cacPhan: [
        {
          tieuDe: "What we collect",
          cacY: [
            "When you order, we collect only what is needed to deliver: your name, phone number, delivery address and any note you add.",
            "We collect no card details, because this website has no online payment. You pay the courier in cash.",
            "Your cart is stored in your own browser and is not sent to our server until you confirm the order.",
          ],
        },
        {
          tieuDe: "How we use it",
          cacY: [
            "Your details are used to confirm, pack and deliver your order.",
            "Your phone number may be used to confirm the order or update you on delivery.",
            "We do not send marketing messages without your consent.",
          ],
        },
        {
          tieuDe: "Who we share it with",
          cacY: [
            "We pass your name, phone number and address to the courier, limited to what delivery requires.",
            "We never sell or trade customer information with any other third party.",
          ],
        },
        {
          tieuDe: "Your rights",
          cacY: [
            "You may ask us to show, correct or delete your personal information held in our system.",
            "Simply call or message our hotline on Zalo with your order code.",
          ],
        },
      ],
    },
  },
};

export type MaChinhSach = keyof typeof CHINH_SACH;
