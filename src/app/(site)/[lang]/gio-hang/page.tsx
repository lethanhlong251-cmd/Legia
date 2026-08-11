import { notFound } from "next/navigation";
import { layBanDich, laNgonNguHopLe } from "@/i18n";
import { NoiDungGioHang } from "@/components/site/noi-dung-gio-hang";

export default async function TrangGioHang({
  params,
}: PageProps<"/[lang]/gio-hang">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();
  const t = layBanDich(lang);

  return (
    <div className="khung py-10 sm:py-14">
      <h1 className="font-display text-3xl text-muc-900">{t.gioHang.tieuDe}</h1>
      <div className="duong-vien-dong mt-4 h-px w-full opacity-50" />
      <NoiDungGioHang ngonNgu={lang} t={t} />
    </div>
  );
}
