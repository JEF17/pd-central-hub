import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Central Traffic Division";
const description = "Central Traffic Division personeline özel rapor şablonları ve araçlar.";

/** CTD'ye özel şablonlar. */
const templates: GroupTemplate[] = [
  {
    slug: "kaza-sorusturma-raporu",
    label: "Kaza Soruşturma Raporu Birinci Sayfa",
    description: "TRAFFIC COLLISION REPORT — SAHP 555 Page 1 (Rev. 2-25) OPI 060",
    to: "/add-kaza-sorusturma-raporu",
  },
  {
    slug: "kaza-sorusturma-raporu-2",
    label: "Kaza Soruşturma Raporu İkinci Sayfa",
    description: "FACTUAL DIAGRAM — SAHP 555 (Rev. 2-25) OPI 042",
    to: "/add-kaza-sorusturma-raporu-2",
  },
  {
    slug: "kaza-sorusturma-raporu-3",
    label: "Kaza Soruşturma Üçüncü Sayfa",
    description: "AÇIKLAMA/TAMAMLAYICI — SAHP 556 (Rev. 2-25) OPI 042",
    to: "/add-kaza-sorusturma-raporu-3",
  },
];

export const Route = createFileRoute("/central-traffic-division")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "central_traffic_division" });
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
      subtitle="Bu alan yalnızca Central Traffic Division yetkisi bulunan personele açıktır."
      note={
        <span>
          Rapor yönergelerini incelemeyi unutmayın:{" "}
          <a
            href="https://lspd-tr.gta.world/viewtopic.php?t=7488"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2 hover:text-primary/80"
          >
            Kaza Soruşturma Raporu Yönergeleri
          </a>
        </span>
      }
      templates={templates}
    />
  ),
});
