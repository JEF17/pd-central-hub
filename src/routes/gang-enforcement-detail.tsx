import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Gang Enforcement Detail / Gang Impact Team";
const description = "GED/GIT personeline özel rapor şablonları ve araçlar.";

const templates: GroupTemplate[] = [];

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