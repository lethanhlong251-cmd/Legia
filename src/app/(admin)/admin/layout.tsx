import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "@/app/globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quản trị Chourmas",
  robots: { index: false, follow: false },
};

export default function BoCucQuanTri({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="min-h-dvh bg-kem-200 antialiased">{children}</body>
    </html>
  );
}
