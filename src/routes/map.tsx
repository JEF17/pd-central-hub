import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Map — LS Panel" },
      { name: "description", content: "Interactive Map tools for GTA:W TR Roleplay police work." },
      { property: "og:title", content: "Interactive Map — LS Panel" },
      { property: "og:description", content: "Interactive Map tools for GTA:W TR Roleplay police work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PagePlaceholder title="Interactive Map" />
    </AppShell>
  );
}
