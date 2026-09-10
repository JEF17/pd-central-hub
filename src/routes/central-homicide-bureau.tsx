import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Central Homicide Bureau";
const description = "Central Homicide Bureau personeline özel rapor şablonları ve araçlar.";

/** CHB'ye özel şablonlar buraya eklenecek. */
const templates: GroupTemplate[] = [];

export const Route = createFileRoute("/central-homicide-bureau")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "central_homicide_bureau" });
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
      subtitle="Bu alan yalnızca Central Homicide Bureau yetkisi bulunan personele açıktır."
      templates={templates}
    />
  ),
});
