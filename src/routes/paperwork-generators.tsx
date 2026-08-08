import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/paperwork-generators")({
  head: () => ({
    meta: [
      { title: "Paperwork Generators — LS Panel" },
      { name: "description", content: "Paperwork Generators tools for GTA:W TR Roleplay police work." },
      { property: "og:title", content: "Paperwork Generators — LS Panel" },
      { property: "og:description", content: "Paperwork Generators tools for GTA:W TR Roleplay police work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PagePlaceholder title="Paperwork Generators" />
    </AppShell>
  );
}
