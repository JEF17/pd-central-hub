import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/caselaw")({
  head: () => ({
    meta: [
      { title: "Caselaw & Legal Resources — LS Panel" },
      { name: "description", content: "Caselaw & Legal Resources tools for GTA:W TR Roleplay police work." },
      { property: "og:title", content: "Caselaw & Legal Resources — LS Panel" },
      { property: "og:description", content: "Caselaw & Legal Resources tools for GTA:W TR Roleplay police work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PagePlaceholder title="Caselaw & Legal Resources" />
    </AppShell>
  );
}
