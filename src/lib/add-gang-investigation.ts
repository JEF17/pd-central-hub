/** GED/GIT — Çete Soruşturma Dosyası Formu (BBCode). */

export interface DigitalRecord {
  date: string;
  address: string;
  description: string;
  media: string;
}

export interface SanGangRecord {
  url: string;
  name: string;
  gender: string;
  age: string;
  recordNo: string;
}

export interface GangInvestigationData {
  gangName: string;
  fileNo: string;
  date: string;
  description: string;
  allies: string[];
  enemies: string[];
  digitalRecords: DigitalRecord[];
  sanGangRecords: SanGangRecord[];
  officerName: string;
  officerSerial: string;
  supervisorName: string;
  supervisorSerial: string;
  detail: string;
  division: string;
}

export const emptyDigitalRecord = (): DigitalRecord => ({
  date: "",
  address: "",
  description: "",
  media: "",
});

export const emptySanGangRecord = (): SanGangRecord => ({
  url: "",
  name: "",
  gender: "",
  age: "",
  recordNo: "",
});

export const emptyGangInvestigation = (): GangInvestigationData => ({
  gangName: "",
  fileNo: "",
  date: "",
  description: "",
  allies: [""],
  enemies: [""],
  digitalRecords: [emptyDigitalRecord()],
  sanGangRecords: [emptySanGangRecord()],
  officerName: "",
  officerSerial: "",
  supervisorName: "",
  supervisorSerial: "",
  detail: "GED",
  division: "MISN",
});

const value = (input: string, fallback: string) => input.trim() || fallback;

export function buildGangInvestigationTitle(data: GangInvestigationData): string {
  return `${value(data.gangName, "ÇETE İSMİ")} / 26-${value(data.fileNo, "000")}`;
}

const list = (items: string[], fallback = "") => {
  const populated = items.map((item) => item.trim()).filter(Boolean);
  return `[list]${(populated.length ? populated : [fallback]).map((item) => `[*]${item}`).join("\n")}`;
};

export function buildGangInvestigationBBCode(data: GangInvestigationData): string {
  const digitalRecords = data.digitalRecords
    .filter((record) => record.date.trim() || record.address.trim() || record.description.trim() || record.media.trim())
    .map(
      (record) =>
        `[*][altspoiler2=${value(record.date, "GG/AA/YYYY")} - ${value(record.address, "ADRES")} - ${value(record.description, "KAYIT AÇIKLAMASI")}]${value(record.media, "VİDEO KAYDI/FOTOĞRAF BURAYA")}[/altspoiler2]`,
    );

  const sanGangRecords = data.sanGangRecords
    .filter((record) =>
      [record.url, record.name, record.gender, record.age, record.recordNo].some((item) => item.trim()),
    )
    .map(
      (record) =>
        `[*][url=${value(record.url, "SanGang Bağlantısı")}]${value(record.name, "John Doe")}, ${value(record.gender, "Erkek")}, ${value(record.age, "18")}, ${value(record.recordNo, "SanGang Kayıt Numarası")}[/url]`,
    );

  return `[size=95]LOS SANTOS POLICE DEPARTMENT[/size]
[b][size=115]ÇETE SORUŞTURMA DOSYASI FORMU[/size][/b]



[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,7,1][indent=2][b]TEMEL BİLGİLER[/b][/indent]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]DOSYA ADI[/b]
${value(data.gangName, "ABC 12")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]TARİH[/b]
${value(data.date, "GG/AA/YYYY")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]DOSYA NO.[/b]
26-${value(data.fileNo, "000")}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]DOSYA AÇIKLAMASI[/b]
${value(data.description, "Dosyanın açılmasına yönelik temel nedenleri açıklayın. Tarih, zaman, konum ve kişiler gibi bilgileri eksiksiz sağlayın. Bu bölüme yalnızca diğer kutucuklarda bulunmayan bilgileri yazın.")}
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]MÜTTEFİKLER[/b]
${list(data.allies)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]DÜŞMANLAR[/b]
${list(data.enemies)}[/indent][/size][/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]DİJİTAL KAYITLAR[/b]
[list]
${digitalRecords.length ? digitalRecords.join("\n") : "[*][altspoiler2=GG/AA/YYYY - ADRES - KAYIT AÇIKLAMASI]VİDEO KAYDI/FOTOĞRAF BURAYA[/altspoiler2]"}
[/indent][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]SANGANG KAYITLARI[/b]
[list]${sanGangRecords.length ? sanGangRecords.join("\n") : "[*][url=SanGang Bağlantısı]John Doe, Erkek, 18, SanGang Kayıt Numarası[/url]"}
[/indent][/size][/tdwidth][/table]
[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,7,1][indent=2][b]İDARİ BİLGİLER[/b][/indent]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]PERSONEL ADI SOYADI
${value(data.officerName, "BURAYA")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO
${value(data.officerSerial, "00000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]ONAYLAYAN SUPERVISOR
${value(data.supervisorName, "BURAYA")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO
${value(data.supervisorSerial, "00000")}[/indent][/size][/tdwidth]
[/table]


[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]DETAIL
${value(data.detail, "GED")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]DIVISION
${value(data.division, "MISN")}[/indent][/size][/tdwidth]
[/table]
[/tdwidth][/table]`;
}