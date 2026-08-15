export type ChangelogEntry = {
  date: string;
  title: string;
  items: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    date: "15 Ağustos 2026",
    title: "v1.2.0 — Geliştirici günlükleri",
    items: [
      "Sol alt panel ikiye bölündü: Geliştirici Günlükleri ve Ayarlar ayrı alanlara taşındı.",
      "Geliştirici Günlükleri sayfası eklendi.",
      "Küçük arayüz düzenlemeleri yapıldı.",
    ],
  },
  {
    date: "12 Ağustos 2026",
    title: "v1.1.5 — Gözaltı kayıt formu",
    items: [
      "Gözaltı Kayıt Formu (GKF) şablonu eklendi.",
      "Araç El Koyma ve İhlal raporlarına çoklu ihlal seçimi getirildi.",
    ],
  },
  {
    date: "08 Ağustos 2026",
    title: "v1.1.0 — Rapor üreticisi güncellemeleri",
    items: [
      "Olay Raporu, İfade Raporu, Tutuklama Raporu ve APB şablonları iyileştirildi.",
      "Personel Profili ile rapor formları arasında otomatik doldurma bağlantısı kuruldu.",
      "Büyük harf kullanımı için bilgi notları eklendi.",
    ],
  },
  {
    date: "01 Ağustos 2026",
    title: "v1.0.0 — İlk sürüm",
    items: [
      "LSPD Toolkit yayına alındı.",
      "Ceza Kanunları, Süre Hesaplama ve temel rapor şablonları kullanıma sunuldu.",
    ],
  },
];
