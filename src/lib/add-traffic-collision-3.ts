/** Central Traffic Division — Açıklama/Tamamlayıcı (SAHP 556, Kaza Soruşturma 3. Sayfa). */

export interface CollisionNarrativeItem {
  /** Örn. P-1, P-2 */
  tag: string;
  text: string;
}

export interface TrafficCollisionPage3Data {
  date: string;
  time: string;
  /** Olay Raporu No.: OR — 00000 */
  incidentReportNo: string;

  officer: string;
  serialNo: string;
  division: string;
  /** Rapor No. son üç hane: TC — 26-000 */
  titleNo: string;

  location: string;

  /** [b]SORUŞTURMA SORUMLULUĞU:[/b] */
  responsibility: string;
  /** [b]KAZA ÖZETİ:[/b] */
  summary: string;
  /** [b]PARTİ:[/b] listesi */
  parties: CollisionNarrativeItem[];
  /** [b]HASARLAR:[/b] listesi */
  damages: CollisionNarrativeItem[];
  /** [b]SORUŞTURMACI NOTLARI:[/b] */
  notes: string;
  /** [b]NEDEN:[/b] */
  cause: string;
}

export const emptyCollisionNarrativeItem = (): CollisionNarrativeItem => ({ tag: "", text: "" });

export const emptyTrafficCollisionPage3 = (): TrafficCollisionPage3Data => ({
  date: "",
  time: "",
  incidentReportNo: "",
  officer: "",
  serialNo: "",
  division: "CTD",
  titleNo: "",
  location: "",
  responsibility: "",
  summary: "",
  parties: [emptyCollisionNarrativeItem()],
  damages: [emptyCollisionNarrativeItem()],
  notes: "",
  cause: "",
});

const v = (s: string, fallback = "") => (s.trim() ? s.trim() : fallback);

/** İlk madde [*] almaz; sonrakiler [*] ile başlar (şablona uygun). */
function narrativeList(items: CollisionNarrativeItem[]): string {
  const filled = items.filter((i) => i.tag.trim() || i.text.trim());
  if (!filled.length) return "[list]\n[ * ]\n[/list]";
  const body = filled
    .map((i, idx) => {
      const tag = i.tag.trim() ? `[b]${i.tag.trim()}[/b]` : "";
      const line = [tag, i.text.trim()].filter(Boolean).join(tag ? ", " : "");
      return idx === 0 ? line : `[*]${line}`;
    })
    .join("\n");
  return `[list]${body}[/list]`;
}

function section(label: string, content: string): string {
  const t = content.trim();
  return `[b]${label}:[/b]${t ? ` ${t}` : ""}`;
}

export function buildTrafficCollisionPage3BBCode(d: TrafficCollisionPage3Data): string {
  const incidentNo = `OR — ${v(d.incidentReportNo, "00000")}`;
  const reportNo = `TC — 26-${v(d.titleNo, "000")}`;

  const explanation = [
    section("SORUŞTURMA SORUMLULUĞU", d.responsibility),
    section("KAZA ÖZETİ", d.summary),
    `[b]PARTİ:[/b]\n${narrativeList(d.parties)}`,
    `[b]HASARLAR:[/b]\n${narrativeList(d.damages)}`,
    section("SORUŞTURMACI NOTLARI", d.notes),
    section("NEDEN", d.cause),
  ].join("\n\n");

  return `[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,15,10]
[left]STATE OF SAN ANDREAS
DEPARTMENT OF SAN ANDREAS HIGHWAY PATROL
[b][size=130]AÇIKLAMA/TAMAMLAYICI[/size][/b]
SAHP 556 (Rev. 2-25) OPI 042[/left]
[/tdwidth][/table]

[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,0,0]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
${v(d.date)}
[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SAAT (2400)
${v(d.time)}
[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]OLAY RAPORU NO.
${incidentNo}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]PERSONEL ADI SOYADI
${v(d.officer)}
[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${v(d.serialNo)}
[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${v(d.division, "CTD")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]RAPOR NO.
${reportNo}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]KONUM
${v(d.location)}
[/indent][/size][/tdwidth][/table][/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]AÇIKLAMA
${explanation}
[/indent][/size][/tdwidth][/table]`;
}
