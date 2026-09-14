import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Plus, Shield, Trash2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildMetroDailyActivityBBCode,
  emptyMetroDailyActivity,
  emptyMetroNarrative,
  emptyMetroPersonnel,
  type MetroDailyActivityData,
  type MetroNarrativeItem,
  type MetroPersonnel,
} from "@/lib/add-metro-daily-activity";

const title = "Metropolitan Division Günlük Aktivite Raporu";
const description = "METROPOLITAN DIVISION GÜNLÜK AKTİVİTE RAPORU — 15.52.04 (12/25)";

export const Route = createFileRoute("/add-metro-gunluk-aktivite-raporu")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "metropolitan_division" });
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
  const [data, setData, clearDraft, savedAt] = useFormDraft<MetroDailyActivityData>(
    "add-metro-gunluk-aktivite-raporu",
    emptyMetroDailyActivity,
  );
  const [output, setOutput] = useState("");
  const profile = useOfficerProfile();
  const autoFilled = useRef(false);

  useEffect(() => {
    if (autoFilled.current || !profile) return;
    if (!profile.name && !profile.serialNo) return;
    autoFilled.current = true;
    setData((d) => {
      const personnel = d.personnel.length ? [...d.personnel] : [emptyMetroPersonnel()];
      const first = personnel[0] ?? emptyMetroPersonnel();
      personnel[0] = {
        name: first.name || profile.name.trim().toUpperCase(),
        serialNo: first.serialNo || profile.serialNo,
        rank: first.rank || profile.rank.trim().toUpperCase(),
      };
      return { ...d, personnel };
    });
  }, [profile, setData]);

  const set = <K extends keyof MetroDailyActivityData>(key: K, value: MetroDailyActivityData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updatePersonnel = (i: number, patch: Partial<MetroPersonnel>) =>
    set(
      "personnel",
      data.personnel.map((x, xi) => (xi === i ? { ...x, ...patch } : x)),
    );

  const updateNarrative = (i: number, patch: Partial<MetroNarrativeItem>) =>
    set(
      "narratives",
      data.narratives.map((x, xi) => (xi === i ? { ...x, ...patch } : x)),
    );

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const activityFields: { key: keyof MetroDailyActivityData; label: string }[] = [
    { key: "felonyArrests", label: "Felony Tutuklaması" },
    { key: "misdemeanorArrests", label: "Misd. Tutuklaması" },
    { key: "trafficStops", label: "Trafik Durdurması" },
    { key: "weaponsNarcotics", label: "Silah & Narkotik" },
    { key: "fiCards", label: "FI Kart" },
    { key: "citations", label: "İhlal Cezası" },
    { key: "vehicleImpounds", label: "Araç Çekimi" },
    { key: "apbWarrants", label: "APB & Warrant" },
    { key: "paroleProbation", label: "Parole & Probation" },
    { key: "pursuits", label: "Araç & Yaya Takibi" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/metropolitan-division">
              <ArrowLeft className="size-3.5" />
              Metropolitan Division
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <Shield className="size-5" />
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
          <Section title="Rapor Bilgileri" wide>
            <DateField label="Tarih" value={data.date} onChange={(v) => set("date", v)} />
            <Field
              label="Gün"
              value={data.day}
              onChange={(v) => set("day", v)}
              placeholder="PAZARTESİ"
            />
            <Field
              label="Birim"
              value={data.unit}
              onChange={(v) => set("unit", v)}
              placeholder="—"
            />
            <Field
              label="Area"
              value={data.area}
              onChange={(v) => set("area", v)}
              placeholder="CITYWIDE"
            />
            <div className="sm:col-span-2">
              <Field
                label="Onaylayan Supervisor"
                value={data.supervisor}
                onChange={(v) => set("supervisor", v)}
                placeholder="A. SOYADI"
              />
            </div>
          </Section>

          <Section title="Personel Bilgileri" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => {
                    const personnel = d.personnel.length ? [...d.personnel] : [emptyMetroPersonnel()];
                    personnel[0] = {
                      name: p.name.trim().toUpperCase(),
                      serialNo: p.serialNo,
                      rank: p.rank.trim().toUpperCase(),
                    };
                    return { ...d, personnel };
                  })
                }
              />
            </div>
            <div className="sm:col-span-2 space-y-3">
              {data.personnel.map((p, i) => (
                <div
                  key={i}
                  className="grid gap-3 rounded-xl border border-border/70 bg-background/40 p-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
                >
                  <Field
                    label={`Personel ${i + 1} — Adı Soyadı`}
                    value={p.name}
                    onChange={(v) => updatePersonnel(i, { name: v })}
                    placeholder="JOHN DOE"
                  />
                  <Field
                    label="Seri No."
                    value={p.serialNo}
                    onChange={(v) => updatePersonnel(i, { serialNo: v })}
                    placeholder="00000"
                  />
                  <Field
                    label="Rütbe"
                    value={p.rank}
                    onChange={(v) => updatePersonnel(i, { rank: v })}
                    placeholder="POLICE OFFICER III"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Personeli sil"
                    onClick={() => {
                      const next = data.personnel.filter((_, xi) => xi !== i);
                      set("personnel", next.length ? next : [emptyMetroPersonnel()]);
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
                onClick={() => set("personnel", [...data.personnel, emptyMetroPersonnel()])}
              >
                <Plus className="size-4" />
                Personel Ekle
              </Button>
            </div>
          </Section>

          <Section title="Aktivite Bilgileri" wide hint="Rapor dönemindeki aktivite sayıları.">
            {activityFields.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                value={String(data[f.key] ?? "")}
                onChange={(v) => set(f.key, v as MetroDailyActivityData[typeof f.key])}
                placeholder="0"
              />
            ))}
          </Section>

          <Section title="Açıklama" wide>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Açıklama Maddeleri
              </Label>
              <div className="space-y-2">
                {data.narratives.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[7rem_minmax(0,1fr)_auto] items-start gap-2 rounded-xl border border-border/70 bg-background/40 p-3"
                  >
                    <Input
                      className="h-10 bg-background/60"
                      value={item.tag}
                      placeholder="B: 22:35"
                      onChange={(e) => updateNarrative(i, { tag: e.target.value })}
                    />
                    <Textarea
                      rows={3}
                      className="bg-background/60"
                      value={item.text}
                      placeholder="Aktivite açıklaması"
                      onChange={(e) => updateNarrative(i, { text: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Açıklama maddesini sil"
                      onClick={() => {
                        const next = data.narratives.filter((_, xi) => xi !== i);
                        set("narratives", next.length ? next : [emptyMetroNarrative()]);
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
                  onClick={() => set("narratives", [...data.narratives, emptyMetroNarrative()])}
                >
                  <Plus className="size-4" />
                  Açıklama Ekle
                </Button>
              </div>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildMetroDailyActivityBBCode(data))}>
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
