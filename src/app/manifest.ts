import type { MetadataRoute } from "next";

/**
 * THÔNG TIN KHI KHÁCH LƯU WEBSITE RA MÀN HÌNH CHÍNH ĐIỆN THOẠI
 * ------------------------------------------------------------
 * Khách bấm "Thêm vào màn hình chính" sẽ có một biểu tượng Chourmas đàng
 * hoàng thay vì ô trắng, và mở ra không có thanh địa chỉ trình duyệt —
 * nhìn gần giống một ứng dụng.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khuôn bánh trung thu Chourmas",
    short_name: "Chourmas",
    description:
      "Khuôn bánh trung thu lò xo hoa văn độc quyền. Miễn phí vận chuyển, nhận hàng kiểm tra rồi mới thanh toán.",
    start_url: "/vi",
    display: "standalone",
    background_color: "#FAF6EF",
    theme_color: "#9E2B25",
    lang: "vi",
    categories: ["shopping", "food"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
