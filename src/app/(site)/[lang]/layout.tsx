import type { Metadata, Viewport } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import "@/app/globals.css";

import { CAC_NGON_NGU, laNgonNguHopLe, layBanDich } from "@/i18n";
import { layCaiDat } from "@/lib/du-lieu";
import { NhaCungCapGioHang } from "@/lib/gio-hang";
import { DauTrang } from "@/components/site/dau-trang";
import { ChanTrang } from "@/components/site/chan-trang";
import { NutZaloNoi } from "@/components/site/nut-zalo-noi";
import { NganGioHang } from "@/components/site/ngan-gio-hang";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export async function generateStaticParams() {
  return CAC_NGON_NGU.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const t = layBanDich(lang);
  const laViet = lang !== "en";

  const tieuDe = laViet
    ? "Khuôn bánh trung thu Chourmas — Độc quyền hoa văn Việt"
    : "Chourmas Mooncake Molds — Exclusive Vietnamese patterns";

  const moTa = laViet
    ? "Khuôn bánh trung thu lò xo hoa văn độc quyền. Miễn phí vận chuyển toàn quốc, nhận hàng kiểm tra rồi mới thanh toán. Đối tác phân phối chính thức khuôn Thạch Lan."
    : "Spring-loaded mooncake molds with exclusive Vietnamese patterns. Free nationwide delivery, inspect before you pay. Official distributor of Thach Lan molds.";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    title: { default: tieuDe, template: `%s — ${t.chung.tenShop}` },
    description: moTa,
    keywords: laViet
      ? [
          "khuôn bánh trung thu",
          "khuôn lò xo",
          "khuôn bánh trung thu độc quyền",
          "khuôn bánh 150g",
          "khuôn bánh 200g",
          "đồ làm bánh",
          "Chourmas",
          "Thạch Lan",
        ]
      : ["mooncake mold", "vietnamese mooncake mold", "baking tools", "Chourmas"],
    alternates: {
      canonical: `/${lang}`,
      languages: {
        vi: "/vi",
        en: "/en",
        // Máy tìm kiếm gặp ngôn ngữ nào không khớp thì đưa về bản tiếng Việt
        "x-default": "/vi",
      },
    },
    openGraph: {
      type: "website",
      locale: laViet ? "vi_VN" : "en_US",
      siteName: t.chung.tenShop,
      title: tieuDe,
      description: moTa,
      // Ảnh hiện ra khi dán link vào Messenger, Zalo, Facebook
      images: [
        {
          url: "/anh-chia-se.jpg",
          width: 1200,
          height: 630,
          alt: laViet
            ? "Khuôn bánh trung thu Chourmas — Độc quyền hoa văn Việt"
            : "Chourmas Mooncake Molds — Exclusive Vietnamese patterns",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tieuDe,
      description: moTa,
      images: ["/anh-chia-se.jpg"],
    },
    robots: { index: true, follow: true },
    manifest: "/manifest.webmanifest",
    // Màu thanh trạng thái điện thoại, cho khớp với dải đỏ trên đầu trang
    appleWebApp: {
      capable: true,
      title: "Chourmas",
      statusBarStyle: "black-translucent",
    },
  };
}

/** Màu thanh địa chỉ trên trình duyệt điện thoại */
export const viewport: Viewport = {
  themeColor: "#9E2B25",
  width: "device-width",
  initialScale: 1,
};

export default async function BoCucTrangChinh({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const t = layBanDich(lang);
  const caiDat = await layCaiDat();

  return (
    // suppressHydrationWarning vì đoạn mã ngay bên dưới gắn thêm lớp `js-cuon`
    // vào thẻ này trước khi React kịp so khớp. Chỉ áp dụng cho riêng thẻ html,
    // mọi phần bên trong vẫn được React kiểm tra bình thường.
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${playfair.variable} ${beVietnam.variable}`}
    >
      <head>
        {/*
          Bật hiệu ứng hiện dần khi cuộn. Chạy trước khi trang vẽ ra nên
          không bị nháy. Nếu JavaScript hỏng thì lớp này không được thêm,
          và mọi nội dung hiện bình thường — xem giải thích trong globals.css.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-cuon')`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <NhaCungCapGioHang>
          <DauTrang ngonNgu={lang} t={t} caiDat={caiDat} />
          <main className="flex-1">{children}</main>
          <ChanTrang ngonNgu={lang} t={t} caiDat={caiDat} />
          <NutZaloNoi zalo={caiDat.zalo} />
          <NganGioHang ngonNgu={lang} t={t} />
        </NhaCungCapGioHang>
      </body>
    </html>
  );
}
