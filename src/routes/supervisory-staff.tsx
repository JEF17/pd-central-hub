import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Supervisory Staff";
const description = "Supervisory Staff personeline özel rapor şablonları ve araçlar.";

/** Supervisory Staff'a özel şablonlar. */
const templates: GroupTemplate[] = [
  {
    slug: "kategorik-guc-kullanimi-raporu",
    label: "Kategorik Güç Kullanımı Raporu (Form 06.11.33)",
    description: "Görev sırasında uygulanan güç kullanımının kategorik olarak raporlandığı form.",
    to: "/add-kategorik-guc-kullanimi-raporu",
  },
];


export const Route = createFileRoute("/supervisory-staff")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "supervisory_staff" });
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
      subtitle="Bu alan yalnızca Supervisory Staff yetkisi bulunan personele açıktır."
      templates={templates}
    />
  ),
});
