import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Metropolitan Division";
const description = "Metropolitan Division personeline özel rapor şablonları ve araçlar.";

/** Metro'ya özel şablonlar buraya eklenecek. */
const templates: GroupTemplate[] = [];

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
