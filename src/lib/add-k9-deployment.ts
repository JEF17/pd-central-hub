/** Metropolitan Division — K9 Deployment Report (Metro K9 Unit). */

export interface K9Suspect {
  name: string;
  gender: string;
  k9Injury: string;
  k9Contact: string;
  charge: string;
  weapon: string;
  type: string;
}

export interface K9DeploymentData {
  /** Başlık: K9 Deployment Report — 00/00/0000 — 0000 */
  titleDate: string;
  titleNo: string;

  date: string;
  division: string;
  k9Contact: string;
  k9riNo: string;
  deploymentNo: string;

  deploymentType: string;
  address: string;
  knownGangMember: string;
  gangName: string;

  incidentCommander: string;
  icSerialNo: string;
  icPosition: string;
  k9Supervisor: string;
  supSerialNo: string;
  supPosition: string;
  atScene: string;

  handlerName: string;
  handlerSerialNo: string;
  handlerPosition: string;
  handlerDivision: string;
  dog: string;
  dogSerialNo: string;

  suspects: K9Suspect[];

  details: string;
  evidence: string[];
}

export const emptyK9Suspect = (): K9Suspect => ({
  name: "",
  gender: "",
  k9Injury: "",
  k9Contact: "",
  charge: "",
  weapon: "",
  type: "",
});

export const emptyK9Deployment = (): K9DeploymentData => ({
  titleDate: "",
  titleNo: "",
  date: "",
  division: "METRO",
  k9Contact: "",
  k9riNo: "",
  deploymentNo: "",
  deploymentType: "",
  address: "",
  knownGangMember: "",
  gangName: "",
  incidentCommander: "",
  icSerialNo: "",
  icPosition: "",
  k9Supervisor: "",
  supSerialNo: "",
  supPosition: "",
  atScene: "",
  handlerName: "",
  handlerSerialNo: "",
  handlerPosition: "",
  handlerDivision: "METRO",
  dog: "",
  dogSerialNo: "",
  suspects: [emptyK9Suspect()],
  details: "",
  evidence: [""],
});

const v = (s: string, fallback = "") => (s.trim() ? s.trim() : fallback);

export function buildK9DeploymentBBCode(d: K9DeploymentData): string {
  const suspects = d.suspects
    .filter((s) => Object.values(s).some((x) => x.trim()))
    .map(
      (s) => `[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]ŞÜPHELİ BİLGİSİ
${v(s.name)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]CİNSİYETİ[/size]
[size=85]${v(s.gender)}[/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]K-9 YARALAMASI[/size]
[size=85]${v(s.k9Injury)}[/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]K-9 TEMASI
${v(s.k9Contact)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SUÇLAMA
${v(s.charge)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SİLAH[/size]
[size=85]${v(s.weapon)}[/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,3][size=85][indent=2]TÜRÜ
${v(s.type)}[/indent][/size][/tdwidth][/table]`,
    )
    .join("\n");

  const evidence = d.evidence
    .map((e) => e.trim())
    .filter(Boolean)
    .map((e) => `[*][url=${e}]${e}[/url]`)
    .join("\n");

  return `[center][size=125]LOS SANTOS POLICE DEPARTMENT
[b]K9 DEPLOYMENT REPORT
METRO K9 UNIT [/b][/size][/center]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
${v(d.date)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${v(d.division, "METRO")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]K-9 TEMASI[/size]
[size=85]${v(d.k9Contact)}[/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]K9RI#
${v(d.k9riNo)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DEPLOYMENT NO.
${v(d.deploymentNo)}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]TÜRÜ (Suç, Kayıp, Delil, vb.)
${v(d.deploymentType)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]ADRES
${v(d.address)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]BİLİNEN ÇETE ÜYESİ[/size]
[size=85]${v(d.knownGangMember)}[/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]ÇETE ADI
${v(d.gangName)}[/indent][/size][/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]PERSONEL BİLGİSİ[/b][/size][/tdwidth][/table]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]INCIDENT COMMANDER
${v(d.incidentCommander)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${v(d.icSerialNo)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]POZİSYON
${v(d.icPosition)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]K-9 SUPERVISOR
${v(d.k9Supervisor)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${v(d.supSerialNo)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]POZİSYON
${v(d.supPosition)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]AT SCENE[/size]
[size=85]${v(d.atScene)}[/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]ARAMA/ŞÜPHELİ BİLGİSİ[/b][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]PERSONEL ADI SOYADI
${v(d.handlerName)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO
${v(d.handlerSerialNo)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]POZİSYON
${v(d.handlerPosition)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]DIVISION
${v(d.handlerDivision, "METRO")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]KÖPEK
${v(d.dog)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO
${v(d.dogSerialNo)}[/indent][/size][/tdwidth][/table]


${suspects}

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]DETAYLAR
${v(d.details)}



[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]KANITLAR
[list]
${evidence || "[*][url=][/url]"}
[/list]
[/indent][/size][/tdwidth][/table]`;
}
