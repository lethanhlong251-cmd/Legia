import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * AVIF nhỏ hơn WebP khoảng 20% với cùng chất lượng. Trình duyệt nào
     * không hiểu AVIF thì tự động nhận WebP. Với khách ở tỉnh dùng 3G,
     * mỗi phần trăm dung lượng tiết kiệm được đều đáng.
     */
    formats: ["image/avif", "image/webp"],

    /**
     * Giữ ảnh đã nén trong bộ nhớ đệm 30 ngày thay vì 4 tiếng như mặc định.
     * Ảnh sản phẩm gần như không đổi, nên nén đi nén lại chỉ tổ tốn sức máy
     * chủ. VPS gói nhỏ rất cần điều này.
     *
     * Tải ảnh mới lên qua admin vẫn hiện ngay, vì ảnh mới có tên file khác.
     */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
