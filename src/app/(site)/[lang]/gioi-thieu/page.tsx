import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { layBanDich, laNgonNguHopLe } from "@/i18n";
import { BieuTuongKhuon } from "@/components/logo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/gioi-thieu">): Promise<Metadata> {
  const { lang } = await params;
  const t = layBanDich(lang);
  return {
    title: t.dieuHuong.gioiThieu,
    description: t.chanTrang.gioiThieuNgan,
    alternates: { canonical: `/${lang}/gioi-thieu` },
  };
}

export default async function TrangGioiThieu({
  params,
}: PageProps<"/[lang]/gioi-thieu">) {
  const { lang } = await params;
  if (!laNgonNguHopLe(lang)) notFound();

  const t = layBanDich(lang);
  const vi = lang === "vi";

  const camKet = [
    { icon: ShieldCheck, ...t.camKet.khongChuyenKhoan },
    { icon: Truck, ...t.camKet.mienShip },
    { icon: PackageCheck, ...t.camKet.kiemTraHang },
    { icon: BadgeCheck, ...t.camKet.docQuyen },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-muc-900">
        <div className="hoa-van-luoi absolute inset-0 opacity-50" />
        <div className="khung relative flex flex-col items-center py-16 text-center sm:py-20">
          <BieuTuongKhuon
            className="h-14 w-14"
            mauChinh="#FAF6EF"
            mauNhan="#C8A24A"
          />
          <h1 className="mt-6 font-display text-3xl text-kem-50 sm:text-4xl">
            {t.trangChu.cauChuyenTieuDe}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-kem-300">
            {t.chung.doiTac}
          </p>
        </div>
      </section>

      <article className="khung max-w-3xl py-14 sm:py-20">
        <div className="space-y-6 text-[16px] leading-[1.85] text-muc-700">
          {vi ? (
            <>
              <p className="font-display text-xl leading-relaxed text-muc-900">
                Chourmas bắt đầu từ một điều rất giản dị: một chiếc bánh trung
                thu đẹp phải bắt đầu từ một chiếc khuôn đủ sắc nét.
              </p>
              <p>
                Ai từng đóng bánh đều biết cảm giác ấy — bột đã nhồi kỹ, nhân đã
                sên đúng độ, vậy mà chiếc bánh lấy ra khỏi khuôn lại nhoè nhoẹt,
                cánh hoa không rõ, chữ không đọc được. Vấn đề gần như luôn nằm ở
                chiếc khuôn: hoa văn khắc quá nông, lò xo yếu, mặt khuôn không
                phẳng.
              </p>
              <p>
                Vì vậy chúng tôi chọn đi cùng{" "}
                <strong className="text-muc-900">Thạch Lan</strong> — người thiết
                kế ra những bộ hoa văn sen tứ quý, mẫu đơn, cúc, cá đôi, thần
                tài mà bạn thấy trên website này. Chourmas là{" "}
                <strong className="text-muc-900">
                  đối tác phân phối chính thức
                </strong>{" "}
                các mẫu khuôn ấy. Mỗi hoa văn là một thiết kế riêng, không sản
                xuất đại trà, và bạn sẽ không tìm thấy chúng ở nơi nào khác.
              </p>
              <p>
                Chúng tôi cũng biết chuyện mua hàng qua mạng không phải lúc nào
                cũng dễ chịu. Đã có quá nhiều người chuyển khoản rồi nhận về một
                thứ khác hẳn với ảnh. Nên Chourmas làm ngược lại:{" "}
                <strong className="text-muc-900">
                  chúng tôi không bao giờ yêu cầu bạn chuyển khoản trước
                </strong>
                . Hàng đến tay, bạn mở hộp, cầm chiếc khuôn lên xem hoa văn có
                sâu và sắc như ảnh không — rồi mới trả tiền cho shipper. Phí vận
                chuyển đã nằm trong giá niêm yết, bạn không phải trả thêm đồng
                nào.
              </p>
              <p>
                Trước mắt Chourmas tập trung vào khuôn bánh trung thu. Nhưng
                chúng tôi đang chuẩn bị để mang thêm về những dụng cụ và nguyên
                liệu làm bánh khác — vẫn với đúng cách làm này: chọn kỹ, nói
                thật, và để bạn kiểm tra trước khi trả tiền.
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-xl leading-relaxed text-muc-900">
                Chourmas began with something very simple: a beautiful mooncake
                has to start with a mold sharp enough to make one.
              </p>
              <p>
                Anyone who has pressed mooncakes knows the feeling — the dough
                was kneaded properly, the filling cooked just right, and yet the
                cake comes out of the mold smudged, petals blurred, characters
                unreadable. The fault is almost always the mold: patterns cut too
                shallow, a weak spring, a face that is not quite flat.
              </p>
              <p>
                So we chose to work with{" "}
                <strong className="text-muc-900">Thach Lan</strong>, the designer
                behind the lotus, peony, chrysanthemum, twin fish and fortune
                patterns you see on this site. Chourmas is the{" "}
                <strong className="text-muc-900">official distributor</strong> of
                those molds. Each pattern is an exclusive design, never mass
                produced, and you will not find them anywhere else.
              </p>
              <p>
                We also know that buying online is not always comfortable. Too
                many people have transferred money and received something quite
                unlike the photo. So Chourmas does it the other way round:{" "}
                <strong className="text-muc-900">
                  we never ask you to pay in advance
                </strong>
                . The parcel arrives, you open it, you pick up the mold and check
                whether the pattern really is as deep and crisp as the photo —
                and only then do you pay the courier. Delivery is already
                included in the listed price.
              </p>
              <p>
                For now Chourmas focuses on mooncake molds. But we are preparing
                to bring in other baking tools and ingredients — in exactly the
                same way: chosen carefully, described honestly, and yours to
                inspect before you pay.
              </p>
            </>
          )}
        </div>

        {/* Cam kết */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {camKet.map(({ icon: Icon, tieuDe, moTa }) => (
            <div
              key={tieuDe}
              className="flex gap-3.5 rounded-lg border border-kem-300 bg-white p-5"
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-son-700"
                strokeWidth={1.7}
              />
              <div>
                <p className="font-display text-[15px] text-muc-900">
                  {tieuDe}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muc-600">
                  {moTa}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`/${lang}/san-pham`} className="nut-chinh">
            {t.trangChu.heroNutChinh}
          </Link>
          <Link href={`/${lang}/lien-he`} className="nut-phu">
            {t.dieuHuong.lienHe}
          </Link>
        </div>
      </article>
    </>
  );
}
