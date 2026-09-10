/** Area Detective Division — CCTV Kayıt Talepleri (BBCode). */

export interface CctvData {
  /** Pozisyon + adı soyadı, örn. "DETECTIVE II JOHN DOE" */
  officerName: string;
  officerSerial: string;

  /** Rapor bağlantıları */
  incidentReportLink: string;
  followupReportLink: string;
  arrestReportLink: string;

  /** CCTV talep bilgileri */
  requestDate: string;
  timeRange: string;
  /** Talep edilen kameralar */
  cameras: string[];
}

export const emptyCctv = (): CctvData => ({
  officerName: "",
  officerSerial: "",
  incidentReportLink: "",
  followupReportLink: "",
  arrestReportLink: "",
  requestDate: "",
  timeRange: "",
  cameras: [""],
});

const v = (s: string, fallback = "X") => (s.trim() ? s.trim() : fallback);

export function buildCctvBBCode(d: CctvData): string {
  const links = [
    `[*] [url=${v(d.incidentReportLink, " ")}]Olay Raporu[/url]`,
    `[*] [url=${v(d.followupReportLink, " ")}]Takip Soruşturması Raporu[/url]`,
    `[*] [url=${v(d.arrestReportLink, " ")}]Tutuklama Raporu (Varsa)[/url]`,
  ].join("\n");

  const cameras = d.cameras
    .filter((c) => c.trim())
    .map((c) => `[*] ${c.trim()}`)
    .join("\n");

  return `[divbox2=white]
[letterhead][/letterhead]
[br][/br][br][/br]
[size=110][b]PERSONEL BİLGİLERİ[/b][/size]

[size=95]Ben, [b]${v(d.officerName, "POZİSYON ADI SOYADI")}[/b], [b]${v(d.officerSerial, "SERİ NO")}[/b], olarak aşağıda belirtilen kamera kayıtlarına üstlendiğim soruşturma sorumluluğunu tamamlayabilmek ve resmi görevimi yerine getirebilmek adına erişim talep ediyorum. Bu kayıtları tamamen resmi görevim ve soruşturma sorumluluğumu yerine getirebilmek için kullanacağım ve hiçbir şekilde bu ayrıcalığı suistimal etmeyeceğim. Herhangi bir suistimal veya kötüye kullanım sonucunda disiplin cezasına ve aynı zamanda cezai soruşturmaya tabi tutulacağımı anlıyorum ve kabul ediyorum.[/size]

[b]DIVISION:[/b] Mission Row Area Detective Division
[b]RAPOR BAĞLANTILARI:[/b]
[list]
${links}
[/list]
[br][/br]

[hr][/hr]

[size=110][b]CCTV TALEP BİLGİLERİ[/b][/size]
[size=95]
[b]TARİH:[/b] ${v(d.requestDate, "GG/AA/YYYY")}
[b]SAAT ARALIĞI:[/b] ${v(d.timeRange, "SS:DD - SS:DD")}
[b]TALEP EDİLEN KAMERALAR:[/b]
[list] 
${cameras || "[*] "}
[/list][/size]

[size=75]Eğer paylaşılan kayıtlarda herhangi bir eksiklik, görüntü bozulması ve benzeri aksaklıklar tespit ederseniz sorumlu idare personeli ile iletişime geçin.[/size]
[/divbox2]`;
}
