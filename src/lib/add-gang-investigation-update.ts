/** GED/GIT — Çete Soruşturma Dosyası Takip ve Durum Güncelleme Formu (BBCode). */

export interface GangUpdateData {
  csdNo: string;
  gangName: string;
  background: string;
  details: string;
  evidences: string[];
  officerName: string;
  officerRank: string;
  phone: string;
  email: string;
}

export const emptyGangUpdate = (): GangUpdateData => ({
  csdNo: "",
  gangName: "",
  background: "",
  details: "",
  evidences: [""],
  officerName: "",
  officerRank: "Police Officer II",
  phone: "",
  email: "",
});

const value = (input: string, fallback: string) => input.trim() || fallback;

export function buildGangUpdateTitle(data: GangUpdateData): string {
  return `${value(data.gangName, "ÇETE İSMİ")} / 25-${value(data.csdNo, "000")} Güncelleme`;
}

export function buildGangUpdateBBCode(data: GangUpdateData): string {
  const populated = data.evidences.map((item) => item.trim()).filter(Boolean);
  const evidences = (populated.length ? populated : [""]).map((item) => `[* ]${item}`).join("\n");

  return `[divbox2=transparent][divbox3=black,0,black,0,2,0][/divbox3]
[size=85]Çete Soruşturma Dosyası, ÇSD No. 25-${value(data.csdNo, "000")}[/size][br][/br]

[b]ÇETE ADI:[/b] [size=95]${value(data.gangName, "BURAYA")}[/size]

[b]ARKA PLAN:[/b] [size=95]${value(data.background, "BURAYA")}[/size]

[b]DETAYLAR:[/b] [size=95]${value(data.details, "BURAYA")}[/size]

[b]KANITLAR:[/b]
[list=1]
${evidences}
[/list]





${value(data.officerName, "Adı Soyadı")}, ${value(data.officerRank, "Police Officer II")}
Gang Officer, Misison Row Area Gang Enforcement Detail
Los Santos Police Department
[color=#4080FF]${value(data.phone, "(000) 00-000")}[/color]
${value(data.email, "00000@lspd.online")}[/divbox2]`;
}
