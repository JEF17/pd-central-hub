export type Announcement = {
  id: string;
  title: string;
  date: string;
  body: string;
  tag: "update" | "notice" | "fix";
};

export const announcements: Announcement[] = [
  {
    id: "2026-08-08",
    title: "Panel v1.0.0 yayında",
    date: "08.08.2026",
    body: "LS Panel ilk sürümü ile Arrest Calculator, Paperwork Generators, Penal Code ve Caselaw bölümleri kullanıma açıldı.",
    tag: "update",
  },
  {
    id: "2026-08-05",
    title: "Sayfa düzeni sadeleştirildi",
    date: "05.08.2026",
    body: "Legal Search, Arrest Report, Interactive Map ve Settings bölümleri kaldırıldı.",
    tag: "notice",
  },
  {
    id: "2026-08-01",
    title: "Kenar çubuğu iyileştirmeleri",
    date: "01.08.2026",
    body: "Daraltılabilir kenar çubuğu ve yeni LSPD rozetli marka alanı eklendi.",
    tag: "fix",
  },
];
