import { createFileRoute } from "@tanstack/react-router";

import { GroupAreaPage, type GroupTemplate } from "@/components/GroupAreaPage";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Güç Kullanım Raporları";
const description = "Kategorik güç kullanımı ve tamamlayıcı rapor şablonları.";

const templates: GroupTemplate[] = [
  {
    slug: "kategorik-guc-kullanimi-raporu",
    label: "Kategorik Güç Kullanımı Raporu (Form 06.11.33)",
    description: "Görev sırasında uygulanan güç kullanımının kategorik olarak raporlandığı form.",
    to: "/add-kategorik-guc-kullanimi-raporu",
  },
  {
    slug: "kategorik-guc-kullanimi-tamamlayici-raporu",
    label: "Kategorik Güç Kullanımı Tamamlayıcı Raporu (Form 06.11.34)",
    description: "Kategorik güç kullanımı raporuna ek olarak düzenlenen tamamlayıcı bilgi formu.",
    to: "/add-kategorik-guc-kullanimi-tamamlayici-raporu",
  },
  {
    slug: "guc-kullanimi-sorusturmasi-yonergeleri",
    label: "(( Güç Kullanımı Soruşturması Yönergeleri ))",
    description: "Güç kullanımı soruşturmalarına ilişkin resmi yönergeye buradan ulaşabilirsiniz.",
    href: "https://lspd-tr.gta.world/viewtopic.php?t=1831#p3972",
    actionLabel: "Yönergeyi aç",
  },
];

export const Route = createFileRoute("/guc-kullanim-raporlari")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href);
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
      subtitle="Güç kullanımına ilişkin raporlar"
      templates={templates}
    />
  ),
});
