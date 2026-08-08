import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LS Panel" },
      { name: "description", content: "Settings tools for GTA:W TR Roleplay police work." },
      { property: "og:title", content: "Settings — LS Panel" },
      { property: "og:description", content: "Settings tools for GTA:W TR Roleplay police work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PagePlaceholder title="Settings" />
    </AppShell>
  );
}
