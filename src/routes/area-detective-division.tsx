import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Area Detective Division";
const description = "Area Detective Division personeline özel rapor şablonları ve araçlar.";

/** ADD'a özel şablonlar. */
const templates: GroupTemplate[] = [
  {
    slug: "takip-sorusturma-formu-1",
    label: "Takip Soruşturma Formu Birinci Sayfa",
    description: "Devam eden soruşturmalarda ilk takip ve gelişme kayıtlarının raporlandığı form.",
    to: "/add-takip-sorusturma-formu-1",
  },
  {
    slug: "takip-sorusturma-formu-2",
    label: "Takip Soruşturma Formu İkinci Sayfa",
    description: "Soruşturmanın ilerleyen aşamalarındaki ek takip ve bulgu kayıtlarının raporlandığı form.",
    to: "/add-takip-sorusturma-formu-2",
  },
  {
    slug: "sorgu-raporu",
    label: "Sorgu Raporu",
    description: "Şüpheli veya tanıkların sorgulanmasına ilişkin detayların raporlandığı form.",
    to: "/add-sorgu-raporu",
  },
  {
    slug: "warrant-hizmetleri",
    label: "Warrant Hizmetleri",
    description: "Arama ve tutuklama emirlerinin icrasına ilişkin raporlama şablonu.",
  },
  {
    slug: "cctv-kayit-talepleri",
    label: "CCTV Kayıt Talepleri",
    description: "Güvenlik kamerası kayıtlarının talep edilmesi ve belgelenmesi için kullanılan form.",
  },
];

export const Route = createFileRoute("/area-detective-division")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "area_detective_division" });
  },
  head: () => ({
    meta: [
      { title: `${title} — LSPD - Toolkit` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — LSPD - Toolkit` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <GroupAreaPage
      title={title}
      subtitle="Bu alan yalnızca Area Detective Division yetkisi bulunan personele açıktır."
      templates={templates}
    />
  ),
});
