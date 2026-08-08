import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/arrest-calculator")({
  head: () => ({
    meta: [
      { title: "Arrest Calculator — LS Panel" },
      { name: "description", content: "Arrest Calculator tools for GTA:W TR Roleplay police work." },
      { property: "og:title", content: "Arrest Calculator — LS Panel" },
      { property: "og:description", content: "Arrest Calculator tools for GTA:W TR Roleplay police work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PagePlaceholder title="Arrest Calculator" />
    </AppShell>
  );
}
