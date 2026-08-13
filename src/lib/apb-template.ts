export interface ApbData {
  heading: string;
  imageUrl: string;
  date: string;
  time: string;
  reportNo: string;
  location: string;
  suspect: string;
  details: string;
  officerName: string;
  officerRank: string;
  phone: string;
}

export const DEFAULT_APB_IMAGE = "https://mdc-tr.gta.world/img/persons/No-Avatar.png";

export const emptyApb = (): ApbData => ({
  heading: "",
  imageUrl: "",
  date: "",
  time: "",
  reportNo: "",
  location: "",
  suspect: "",
  details: "",
  officerName: "",
  officerRank: "",
  phone: "",
});

/** Rütbeden APB'de kullanılacak unvanı çıkarır: "Detective II" -> "DETECTIVE" */
export function rankTitle(rank: string): string {
  const r = rank.trim().toUpperCase();
  if (!r) return "OFFICER";
  if (r.includes("CHIEF")) return "CHIEF";
  if (r.includes("COMMANDER")) return "COMMANDER";
  if (r.includes("CAPTAIN")) return "CAPTAIN";
  if (r.includes("LIEUTENANT")) return "LIEUTENANT";
  if (r.includes("SERGEANT")) return "SERGEANT";
  if (r.includes("DETECTIVE")) return "DETECTIVE";
  if (r.includes("OFFICER")) return "OFFICER";
  return r;
}

const val = (v: string, fallback = "—") => (v.trim() ? v.trim() : fallback);

/** Rapor No. gövdede "26-00000" biçiminde görünür. */
function formatReportNo(reportNo: string) {
  const raw = reportNo.trim();
  if (!raw) return "00-00000";
  if (raw.includes("-")) return raw;
  return `26-${raw}`;
}

export function buildApbBBCode(data: ApbData) {
  const dateTime = `${val(data.date, "GG/AA/YYYY")} — ${val(data.time, "00:00")}`;

  return `[divbox2=white][center][img]https://i.imgur.com/TJtJzUr.png[/img][/center]
[indent=53][indent2=65][divbox3=black,15,black,15,3,15][/divbox3]
[table=white,white][tr]
[tdwidth=white,#ffffff,top,center,4,4][size=200][b][color=#ff0000][font=Arial]${val(
    data.heading,
    "BAŞLIK (KANUNUN NUMARASINI YAZMAYIN)",
  ).toUpperCase()}[/color][/font][/b][/size][/tdwidth][/table][divbox3=black,5,black,5,3,5][/divbox3][br][/br][table=white,white][tr]
[tdwidth=white,white,top,left,1,4][center][imgsize=250,250]${val(
    data.imageUrl,
    DEFAULT_APB_IMAGE,
  )}[/imgsize][/center][/tdwidth]
[tdwidth=white,white,top,left,5,4][indent=15][b][u]TARİH:[/u][/b] ${dateTime}

[b][u]OR:[/u][/b] ${formatReportNo(data.reportNo)}

[b][u]KONUM:[/u][/b] ${val(data.location, "000 Adres, Bölge")}

[b][u]ŞÜPHELİ:[/u][/b] ${val(data.suspect, "Yaş, Tanım")}[/tdwidth]
[/table]




[table=white,white][tr]
[tdwidth=white,white,top,left,5,4][b][u]DETAYLAR:[/u][/b] ${val(
    data.details,
    "Olayın ve şüphelinin detaylı tanımı.",
  )}[/tdwidth]
[/table]




[br][/br][center]
[size=85][b]DAHA FAZLA BİLGİ İÇİN ${rankTitle(data.officerRank)} ${val(
    data.officerName,
    "ADI SOYADI",
  ).toUpperCase()} İLE ${val(data.phone, "1234567")} NUMARASINDAN İLETİŞİME GEÇEBİLİRSİNİZ.[/b][/size][/center]
[divbox3=black,15,black,15,3,15][/divbox3]
[center][size=95][b][color=#0a5394]SADECE KOLLUK KUVVETLERİNİN KULLANIMI İÇİNDİR. KAMUYA DAĞITMAYINIZ.[/color][/b][/size][/center]
[/indent][/indent2]
[/divbox2]`;
}
