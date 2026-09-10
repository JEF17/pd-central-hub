import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Map } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { FormSection as Section, TextField as Field, DateField } from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildCollisionPage2ReportNo,
  buildTrafficCollisionPage2BBCode,
  emptyTrafficCollisionPage2,
  type TrafficCollisionPage2Data,
} from "@/lib/add-traffic-collision-2";

const title = "Kaza Soruşturma Raporu İkinci Sayfa";
const description = "FACTUAL DIAGRAM — SAHP 555 (Rev. 2-25) OPI 042";

export const Route = createFileRoute("/add-kaza-sorusturma-raporu-2")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "central_traffic_division" });
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
  component: Page,
});

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<TrafficCollisionPage2Data>(
    "add-kaza-sorusturma-raporu-2",
    emptyTrafficCollisionPage2,
  );
  const [output, setOutput] = useState("");
  const profile = useOfficerProfile();
  const autoFilled = useRef(false);

  useEffect(() => {
    if (autoFilled.current || !profile) return;
    if (!profile.name && !profile.serialNo) return;
    autoFilled.current = true;
    setData((d) => ({
      ...d,
      officer: d.officer || profile.name.trim().toUpperCase(),
      serialNo: d.serialNo || profile.serialNo,
      division: d.division || "CTD",
    }));
  }, [profile, setData]);

  const set = <K extends keyof TrafficCollisionPage2Data>(
    key: K,
    value: TrafficCollisionPage2Data[K],
  ) => setData((d) => ({ ...d, [key]: value }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const reportNo = buildCollisionPage2ReportNo(data);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/central-traffic-division">
              <ArrowLeft className="size-3.5" />
              Central Traffic Division
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <Map className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </header>

        <DraftBar
          savedAt={savedAt}
          onClear={() => {
            clearDraft();
            setOutput("");
            notify.success("Şablon temizlendi");
          }}
        />

        <div className="mt-8 grid gap-6">
          <Section title="Olay Bilgileri" wide>
            <DateField label="Tarih" value={data.date} onChange={(v) => set("date", v)} />
            <Field
              label="Saat (2400)"
              value={data.time}
              onChange={(v) => set("time", v)}
              placeholder="1830"
            />
            <Field
              label="Olay Raporu No."
              value={data.incidentReportNo}
              onChange={(v) => set("incidentReportNo", v)}
              placeholder="00000"
            />
          </Section>

          <Section title="İdari Bilgiler" wide hint={reportNo}>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    officer: p.name.trim().toUpperCase(),
                    serialNo: p.serialNo,
                    division: "CTD",
                  }))
                }
              />
            </div>
            <Field
              label="Personel Adı Soyadı"
              value={data.officer}
              onChange={(v) => set("officer", v)}
              placeholder="JOHN DOE"
            />
            <Field
              label="Seri No."
              value={data.serialNo}
              onChange={(v) => set("serialNo", v)}
              placeholder="00000"
            />
            <Field
              label="Division"
              value={data.division}
              onChange={(v) => set("division", v)}
              placeholder="CTD"
            />
            <Field
              label="Rapor No. (TC — 26-000)"
              value={data.titleNo}
              onChange={(v) => set("titleNo", v)}
              placeholder="000"
            />
          </Section>

          <Section title="Kroki (Factual Diagram)" wide>
            <div className="sm:col-span-2">
              <Field
                label="Kroki Görsel Bağlantısı"
                value={data.diagramUrl}
                onChange={(v) => set("diagramUrl", v)}
                placeholder="https://i.imgur.com/..."
              />
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildTrafficCollisionPage2BBCode(data))}>
            Raporu Oluştur
          </Button>
          {output ? (
            <Button variant="outline" className="press" onClick={() => copy(output, "BBCode")}>
              <ClipboardCopy className="size-4" />
              Kopyala
            </Button>
          ) : null}
        </div>

        {output ? (
          <section className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Çıktı</h2>
            <Textarea readOnly value={output} rows={24} className="mt-4 font-mono text-xs" />
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
