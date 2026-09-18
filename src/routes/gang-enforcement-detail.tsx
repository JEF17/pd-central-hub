import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Gang Enforcement Detail / Gang Impact Team";
const description = "GED/GIT personeline özel rapor şablonları ve araçlar.";

const templates: GroupTemplate[] = [
  {
    slug: "cete-sorusturma-dosyasi",
    label: "Çete Soruşturma Dosyası Formu",
    description: "Çete dosyası, ilişkiler, dijital kayıtlar ve SanGang kayıtları için şablon.",
    to: "/add-cete-sorusturma-dosyasi",
  },
  {
    slug: "cete-takip-guncelleme",
    label: "Çete Soruşturma Dosyası Takip ve Durum Güncelleme Formu",
    description: "Çete dosyalarına ait takip ve durum güncellemesi metinleri için BBCode raporu.",
    to: "/add-cete-takip-guncelleme",
  },
];

export const Route = createFileRoute("/gang-enforcement-detail")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "ged_git" });
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
      subtitle="İlgili şablonlara buradan ulaşabilirsiniz."
      templates={templates}
    />
  ),
});