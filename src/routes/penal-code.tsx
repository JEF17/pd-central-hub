import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/penal-code")({
  head: () => ({
    meta: [
      { title: "Penal Code — LS Panel" },
      { name: "description", content: "Penal Code tools for GTA:W TR Roleplay police work." },
      { property: "og:title", content: "Penal Code — LS Panel" },
      { property: "og:description", content: "Penal Code tools for GTA:W TR Roleplay police work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PagePlaceholder title="Penal Code" />
    </AppShell>
  );
}
