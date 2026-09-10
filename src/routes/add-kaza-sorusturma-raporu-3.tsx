import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Car, ClipboardCopy, Plus, Trash2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { FormSection as Section, TextField as Field, DateField } from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildTrafficCollisionPage3BBCode,
  emptyCollisionNarrativeItem,
  emptyTrafficCollisionPage3,
  type CollisionNarrativeItem,
  type TrafficCollisionPage3Data,
} from "@/lib/add-traffic-collision-3";

const title = "Kaza Soruşturma Üçüncü Sayfa";
const description = "AÇIKLAMA/TAMAMLAYICI — SAHP 556 (Rev. 2-25) OPI 042";

export const Route = createFileRoute("/add-kaza-sorusturma-raporu-3")({
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

/** Etiketli (P-1, P-2) çok satırlı madde listesi. */
function NarrativeListField({
  label,
  addLabel,
  items,
  onChange,
}: {
  label: string;
  addLabel: string;
  items: CollisionNarrativeItem[];
  onChange: (items: CollisionNarrativeItem[]) => void;
}) {
  const update = (i: number, patch: Partial<CollisionNarrativeItem>) =>
    onChange(items.map((x, xi) => (xi === i ? { ...x, ...patch } : x)));
  return (
    <div className="sm:col-span-2 space-y-2">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-[7rem_minmax(0,1fr)_auto] items-start gap-2 rounded-xl border border-border/70 bg-background/40 p-3"
          >
            <Input
              className="h-10 bg-background/60"
              value={item.tag}
              placeholder={`P-${i + 1}`}
              onChange={(e) => update(i, { tag: e.target.value })}
            />
            <Textarea
              rows={3}
              className="bg-background/60"
              value={item.text}
              placeholder="Madde açıklaması"
              onChange={(e) => update(i, { text: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`${label} maddesini sil`}
              onClick={() => {
                const next = items.filter((_, xi) => xi !== i);
                onChange(next.length ? next : [emptyCollisionNarrativeItem()]);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, emptyCollisionNarrativeItem()])}
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

function LongText({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="sm:col-span-2 space-y-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Textarea
        rows={5}
        className="bg-background/60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<TrafficCollisionPage3Data>(
    "add-kaza-sorusturma-raporu-3",
    emptyTrafficCollisionPage3,
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

  const set = <K extends keyof TrafficCollisionPage3Data>(
    key: K,
    value: TrafficCollisionPage3Data[K],
  ) => setData((d) => ({ ...d, [key]: value }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const reportNo = `TC — 26-${data.titleNo.trim() || "000"}`;

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
              <Car className="size-5" />
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
          <Section title="Başlık" wide hint="TC — 26-000">
            <Field
              label="Rapor No."
              value={data.titleNo}
              onChange={(v) => set("titleNo", v)}
              placeholder="000"
            />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                {reportNo}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="press"
                onClick={() => copy(reportNo, "Rapor No.")}
              >
                <ClipboardCopy className="size-3.5" />
                Rapor No. Kopyala
              </Button>
            </div>
          </Section>

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
            <Field
              label="Konum Bilgisi"
              value={data.location}
              onChange={(v) => set("location", v)}
              placeholder="CADDE / BÖLGE"
            />
          </Section>

          <Section title="İdari Bilgiler" wide>
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
          </Section>

          <Section title="Açıklama" wide>
            <LongText
              label="Soruşturma Sorumluluğu"
              value={data.responsibility}
              onChange={(v) => set("responsibility", v)}
              placeholder="Soruşturma görevlendirmesi ve inceleme kapsamı"
            />
            <LongText
              label="Kaza Özeti"
              value={data.summary}
              onChange={(v) => set("summary", v)}
              placeholder="Kazanın kısa özeti"
            />
            <NarrativeListField
              label="Parti"
              addLabel="Parti Ekle"
              items={data.parties}
              onChange={(items) => set("parties", items)}
            />
            <NarrativeListField
              label="Hasarlar"
              addLabel="Hasar Ekle"
              items={data.damages}
              onChange={(items) => set("damages", items)}
            />
            <LongText
              label="Soruşturmacı Notları"
              value={data.notes}
              onChange={(v) => set("notes", v)}
              placeholder="İnceleme bulguları ve değerlendirmeler"
            />
            <LongText
              label="Neden"
              value={data.cause}
              onChange={(v) => set("cause", v)}
              placeholder="Kazanın meydana gelme sebebi"
            />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildTrafficCollisionPage3BBCode(data))}>
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
