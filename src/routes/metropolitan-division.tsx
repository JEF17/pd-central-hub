import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Metropolitan Division";
const description = "Metropolitan Division personeline özel rapor şablonları ve araçlar.";

const templates: GroupTemplate[] = [
  {
    slug: "gunluk-aktivite-raporu",
    label: "Metropolitan Division Günlük Aktivite Raporu",
    description: "METROPOLITAN DIVISION GÜNLÜK AKTİVİTE RAPORU — 15.52.04 (12/25)",
    to: "/add-metro-gunluk-aktivite-raporu",
  },
  {
    slug: "k9-deployment-raporu",
    label: "K-9 Deployment Report",
    description: "K9 DEPLOYMENT REPORT",
    to: "/add-k9-deployment-raporu",
  },
];

export const Route = createFileRoute("/metropolitan-division")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "metropolitan_division" });
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
      subtitle="Bu alan yalnızca Metropolitan Division yetkisi bulunan personele açıktır."
      templates={templates}
    />
  ),
});
