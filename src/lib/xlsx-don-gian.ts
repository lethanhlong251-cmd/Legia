import "server-only";
import { deflateRawSync } from "node:zlib";

/**
 * Bộ tạo file Excel (.xlsx) tối giản, không cần cài thêm thư viện.
 *
 * File .xlsx thực chất chỉ là một file .zip chứa vài file XML. Ở đây ta tự
 * gói lấy, vừa nhẹ vừa không phụ thuộc gói ngoài — cả trang web chỉ dùng nó
 * cho mỗi việc xuất đơn sang SPX nên không cần tính năng gì cao siêu.
 *
 * Chữ được ghi thẳng vào ô (inline string) nên số điện thoại giữ nguyên
 * số 0 ở đầu, không bị Excel nuốt mất.
 */

/** Một ô: chuỗi, số, hoặc bỏ trống */
export type OExcel = string | number | null | undefined;

// ---------------------------------------------------------------
// Phần XML
// ---------------------------------------------------------------

/** Excel không chịu được ký tự điều khiển, gặp thì bỏ luôn cho lành */
const KY_TU_DIEU_KHIEN = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]",
  "g",
);

function thoatXml(chu: string) {
  return chu
    .replace(KY_TU_DIEU_KHIEN, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 0 → "A", 25 → "Z", 26 → "AA" */
function tenCot(chiSo: number) {
  let ten = "";
  let n = chiSo;
  while (n >= 0) {
    ten = String.fromCharCode(65 + (n % 26)) + ten;
    n = Math.floor(n / 26) - 1;
  }
  return ten;
}

function xmlMotDong(cacO: OExcel[], soDong: number) {
  const o = cacO
    .map((giaTri, i) => {
      if (giaTri === null || giaTri === undefined || giaTri === "") return "";
      const diaChi = `${tenCot(i)}${soDong}`;
      if (typeof giaTri === "number" && Number.isFinite(giaTri)) {
        return `<c r="${diaChi}"><v>${giaTri}</v></c>`;
      }
      return `<c r="${diaChi}" t="inlineStr"><is><t xml:space="preserve">${thoatXml(
        String(giaTri),
      )}</t></is></c>`;
    })
    .join("");
  return `<row r="${soDong}">${o}</row>`;
}

const KHAI_BAO = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS_CHINH = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const NS_QUAN_HE =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

function xmlTrang(cacDong: OExcel[][], doRongCot: number[]) {
  const cot = doRongCot.length
    ? `<cols>${doRongCot
        .map(
          (rong, i) =>
            `<col min="${i + 1}" max="${i + 1}" width="${rong}" customWidth="1"/>`,
        )
        .join("")}</cols>`
    : "";

  const dong = cacDong.map((d, i) => xmlMotDong(d, i + 1)).join("");

  return `${KHAI_BAO}
<worksheet xmlns="${NS_CHINH}" xmlns:r="${NS_QUAN_HE}">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
${cot}
<sheetData>${dong}</sheetData>
</worksheet>`;
}

/** Chỉ khai báo kiểu chữ mặc định — không tô vẽ gì để SPX đọc cho chắc */
const XML_KIEU_CHU = `${KHAI_BAO}
<styleSheet xmlns="${NS_CHINH}">
<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
</styleSheet>`;

// ---------------------------------------------------------------
// Phần đóng gói .zip
// ---------------------------------------------------------------

const BANG_CRC = (() => {
  const bang = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    bang[i] = c >>> 0;
  }
  return bang;
})();

function tinhCrc32(du: Buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < du.length; i++) {
    c = BANG_CRC[(c ^ du[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

type MucTrongZip = { ten: string; noiDung: Buffer };

function dongGoiZip(cacMuc: MucTrongZip[]) {
  const phanDau: Buffer[] = [];
  const phanMucLuc: Buffer[] = [];
  let viTri = 0;

  for (const muc of cacMuc) {
    const ten = Buffer.from(muc.ten, "utf8");
    const nen = deflateRawSync(muc.noiDung, { level: 6 });
    const crc = tinhCrc32(muc.noiDung);

    const dau = Buffer.alloc(30);
    dau.writeUInt32LE(0x04034b50, 0); // chữ ký đầu mục
    dau.writeUInt16LE(20, 4); // cần phiên bản 2.0 để giải nén
    dau.writeUInt16LE(0x0800, 6); // cờ: tên file mã UTF-8
    dau.writeUInt16LE(8, 8); // cách nén: deflate
    dau.writeUInt16LE(0, 10); // giờ sửa
    dau.writeUInt16LE(0x21, 12); // ngày sửa — để cố định 1980-01-01
    dau.writeUInt32LE(crc, 14);
    dau.writeUInt32LE(nen.length, 18);
    dau.writeUInt32LE(muc.noiDung.length, 22);
    dau.writeUInt16LE(ten.length, 26);
    dau.writeUInt16LE(0, 28);
    phanDau.push(dau, ten, nen);

    const ml = Buffer.alloc(46);
    ml.writeUInt32LE(0x02014b50, 0); // chữ ký mục lục
    ml.writeUInt16LE(20, 4);
    ml.writeUInt16LE(20, 6);
    ml.writeUInt16LE(0x0800, 8);
    ml.writeUInt16LE(8, 10);
    ml.writeUInt16LE(0, 12);
    ml.writeUInt16LE(0x21, 14);
    ml.writeUInt32LE(crc, 16);
    ml.writeUInt32LE(nen.length, 20);
    ml.writeUInt32LE(muc.noiDung.length, 24);
    ml.writeUInt16LE(ten.length, 28);
    ml.writeUInt32LE(viTri, 42);
    phanMucLuc.push(ml, ten);

    viTri += dau.length + ten.length + nen.length;
  }

  const mucLuc = Buffer.concat(phanMucLuc);
  const ketThuc = Buffer.alloc(22);
  ketThuc.writeUInt32LE(0x06054b50, 0); // chữ ký kết thúc
  ketThuc.writeUInt16LE(cacMuc.length, 8);
  ketThuc.writeUInt16LE(cacMuc.length, 10);
  ketThuc.writeUInt32LE(mucLuc.length, 12);
  ketThuc.writeUInt32LE(viTri, 16);

  return Buffer.concat([...phanDau, mucLuc, ketThuc]);
}

// ---------------------------------------------------------------

export type TrangExcel = {
  /** Tên hiện ở tab dưới đáy Excel, tối đa 31 ký tự */
  ten: string;
  /** Dòng đầu tiên nên là dòng tiêu đề */
  cacDong: OExcel[][];
  /** Độ rộng từng cột, để trống thì Excel tự canh */
  doRongCot?: number[];
};

/** Gộp các trang thành một file .xlsx hoàn chỉnh */
export function taoFileExcel(cacTrang: TrangExcel[]): Buffer {
  const muc: MucTrongZip[] = [];
  const them = (ten: string, chu: string) =>
    muc.push({ ten, noiDung: Buffer.from(chu, "utf8") });

  them(
    "[Content_Types].xml",
    `${KHAI_BAO}
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
${cacTrang
  .map(
    (_, i) =>
      `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
  )
  .join("\n")}
</Types>`,
  );

  them(
    "_rels/.rels",
    `${KHAI_BAO}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="${NS_QUAN_HE}/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
  );

  them(
    "xl/workbook.xml",
    `${KHAI_BAO}
<workbook xmlns="${NS_CHINH}" xmlns:r="${NS_QUAN_HE}">
<sheets>
${cacTrang
  .map(
    (t, i) =>
      `<sheet name="${thoatXml(t.ten.slice(0, 31))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`,
  )
  .join("\n")}
</sheets>
</workbook>`,
  );

  them(
    "xl/_rels/workbook.xml.rels",
    `${KHAI_BAO}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${cacTrang
  .map(
    (_, i) =>
      `<Relationship Id="rId${i + 1}" Type="${NS_QUAN_HE}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`,
  )
  .join("\n")}
<Relationship Id="rId${cacTrang.length + 1}" Type="${NS_QUAN_HE}/styles" Target="styles.xml"/>
</Relationships>`,
  );

  them("xl/styles.xml", XML_KIEU_CHU);

  cacTrang.forEach((t, i) => {
    them(
      `xl/worksheets/sheet${i + 1}.xml`,
      xmlTrang(t.cacDong, t.doRongCot ?? []),
    );
  });

  return dongGoiZip(muc);
}
