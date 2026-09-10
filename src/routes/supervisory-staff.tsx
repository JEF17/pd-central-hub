import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Supervisory Staff";
const description = "Supervisory Staff personeline özel rapor şablonları ve araçlar.";

/** Supervisory Staff'a özel şablonlar buraya eklenecek. */
const templates: GroupTemplate[] = [];

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
