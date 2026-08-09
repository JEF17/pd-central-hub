export interface EmailData {
  from: string;
  date: string;
  time: string;
  meridiem: "AM" | "PM";
  to: string;
  cc: string;
  subject: string;
  body: string;
}

export const emptyEmail = (): EmailData => ({
  from: "",
  date: "",
  time: "",
  meridiem: "AM",
  to: "",
  cc: "",
  subject: "",
  body: "",
});

const val = (v: string, fallback: string) => (v.trim() ? v.trim() : fallback);

const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

/** "2026-08-09" -> "9 Ağustos 2026" */
export function formatEmailDate(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return value.trim();
  const [, y, mo, d] = m;
  return `${Number(d)} ${MONTHS_TR[Number(mo) - 1]} ${y}`;
}

export function buildEmailBBCode(data: EmailData) {
  const time = data.time.trim() ? `${data.time.trim()} ${data.meridiem}` : "SA:DK AM/PM";
  const dateLine = `${val(formatEmailDate(data.date), "Gün, Ay, Yıl")} ${time}`;

  return `[divbox3=black,0,black,0,4,0][/divbox3]

[font=Arial][color=black]
[b]Kimden:[/b] ${val(data.from, "Gönderen")}
[b]Gönderme Tarihi:[/b] ${dateLine}
[b]Kime:[/b] ${val(data.to, "Alıcı")}
[b]Cc:[/b] ${val(data.cc, "—")} 
[b]Konu:[/b] ${val(data.subject, "Başlık")}

${val(data.body, "Yazı.")}
[/color][/font]`;
}
