import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { paperworkTypes } from "@/lib/paperwork-types";

export const Route = createFileRoute("/paperwork-generators")({
  head: () => ({
    meta: [
      { title: "Paperwork Generators — LS Panel" },
      {
        name: "description",
        content:
          "Olay, ifade, ihlal, araç el koyma, tutuklama raporları, APB, Field Interview kartı ve e-posta şablonları.",
      },
      { property: "og:title", content: "Paperwork Generators — LS Panel" },
      {
        property: "og:description",
        content: "GTA:W TR Roleplay için LSPD evrak ve rapor şablonu üreticileri.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Paperwork Generators</h1>
        <p className="mt-2 text-muted-foreground">
          Doldurmak istediğin evrak türünü seç.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paperworkTypes.map((t) => {
            const content = (
              <>
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
                  <t.icon className="size-5" />
                </div>
                <h2 className="mt-4 flex items-center gap-1 font-semibold">
                  {t.label}
                  <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </>
            );
            const cls =
              "group rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 hover:bg-accent/40";
            if (t.slug === "olay-raporu") {
              return (
                <Link key={t.slug} to="/olay-raporu" className={cls}>
                  {content}
                </Link>
              );
            }
            if (t.slug === "ifade-raporu") {
              return (
                <Link key={t.slug} to="/ifade-raporu" className={cls}>
                  {content}
                </Link>
              );
            }
            if (t.slug === "field-interview-karti") {
              return (
                <Link key={t.slug} to="/field-interview-karti" className={cls}>
                  {content}
                </Link>
              );
            }


            return (
              <button key={t.slug} type="button" className={cls}>
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
