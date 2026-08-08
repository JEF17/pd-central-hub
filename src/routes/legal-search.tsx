import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/legal-search")({
  head: () => ({
    meta: [
      { title: "Legal Search — LS Panel" },
      { name: "description", content: "Legal Search tools for GTA:W TR Roleplay police work." },
      { property: "og:title", content: "Legal Search — LS Panel" },
      { property: "og:description", content: "Legal Search tools for GTA:W TR Roleplay police work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PagePlaceholder title="Legal Search" />
    </AppShell>
  );
}
