import { useMemo, useState } from "react";
import { Copy, FileText, RotateCcw, Shield } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ReportForm } from "@/components/ReportForm";
import {
  generateBBCode,
  generateHtml,
  templates,
  type ReportValues,
} from "@/lib/report-templates";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LS Report Generator — GTA:W TR Roleplay Report Builder" },
      {
        name: "description",
        content:
          "Fill in the fields and instantly generate BBCode or HTML police reports for GTA:W TR Roleplay: incident reports, arrest reports and patrol logs.",
      },
      { property: "og:title", content: "LS Report Generator — Roleplay Report Builder" },
      {
        property: "og:description",
        content:
          "Build incident reports, arrest reports and use of force / patrol logs, then copy them as BBCode or HTML.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportGenerator,
});

type OutputTab = "bbcode" | "html" | "preview";

function ReportGenerator() {
  const [activeId, setActiveId] = useState(templates[0]!.id);
  const [allValues, setAllValues] = useState<Record<string, ReportValues>>({});
  const [outputTab, setOutputTab] = useState<OutputTab>("bbcode");

  const template = templates.find((t) => t.id === activeId)!;
  const values = allValues[activeId] ?? {};

  const bbcode = useMemo(() => generateBBCode(template, values), [template, values]);
  const html = useMemo(() => generateHtml(template, values), [template, values]);

  const setValue = (id: string, value: string) =>
    setAllValues((prev) => ({ ...prev, [activeId]: { ...(prev[activeId] ?? {}), [id]: value } }));

  const clearForm = () => {
    setAllValues((prev) => ({ ...prev, [activeId]: {} }));
    toast.success("Form cleared");
  };

  const copy = async () => {
    const text = outputTab === "bbcode" ? bbcode : html;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${outputTab === "bbcode" ? "BBCode" : "HTML"} copied to clipboard`);
    } catch {
      toast.error("Could not copy — select the text manually");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy text-paper">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/20 ring-1 ring-paper/20">
              <Shield className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold uppercase tracking-widest">
                LS Report Generator
              </h1>
              <p className="text-xs text-paper/60">
                GTA:W TR Roleplay — BBCode &amp; HTML report builder
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={cn(
                  "rounded-md px-4 py-2 font-display text-xs font-semibold uppercase tracking-widest transition-colors",
                  t.id === activeId
                    ? "bg-primary text-primary-foreground"
                    : "bg-paper/5 text-paper/70 ring-1 ring-paper/15 hover:bg-paper/10 hover:text-paper",
                )}
              >
                {t.tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="border-l-4 border-primary pl-4">
            <h2 className="font-display text-xl font-bold uppercase tracking-widest text-foreground">
              {template.title}
            </h2>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
          <Button variant="outline" onClick={clearForm}>
            <RotateCcw className="size-4" />
            Clear form
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <ReportForm template={template} values={values} onChange={setValue} />
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:sticky lg:top-6 lg:self-start">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest">
                Generated Output
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-1 rounded-md bg-muted p-1">
              {(["bbcode", "html", "preview"] as OutputTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setOutputTab(tab)}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                    outputTab === tab
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab === "bbcode" ? "BBCode" : tab === "html" ? "HTML" : "Preview"}
                </button>
              ))}
            </div>

            <div className="relative mt-4">
              {outputTab !== "preview" ? (
                <>
                  <Button
                    size="sm"
                    onClick={copy}
                    className="absolute right-3 top-3 z-10 shadow-sm"
                  >
                    <Copy className="size-3.5" />
                    Copy
                  </Button>
                  <pre className="h-[560px] overflow-auto rounded-md border border-border bg-muted/40 p-4 pr-24 text-xs leading-relaxed">
                    <code className="font-mono">{outputTab === "bbcode" ? bbcode : html}</code>
                  </pre>
                </>
              ) : (
                <div
                  className="h-[560px] overflow-auto rounded-md border border-border bg-muted/40 p-4"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
