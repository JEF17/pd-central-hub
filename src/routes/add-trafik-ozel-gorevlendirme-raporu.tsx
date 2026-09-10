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
  buildTrafficSpecialDutyBBCode,
  dutyTypeOptions,
  emptyDutyNarrative,
  emptyTrafficSpecialDuty,
  type DutyNarrativeItem,
  type TrafficSpecialDutyData,
} from "@/lib/add-traffic-special-duty";

const title = "Trafik Özel Görevlendirme Raporu";
const description = "TRAFİK ÖZEL GÖREVLENDİRME RAPORU — 22.10.33 (2/26)";

export const Route = createFileRoute("/add-trafik-ozel-gorevlendirme-raporu")({
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
  const [data, setData, clearDraft, savedAt] = useFormDraft<TrafficSpecialDutyData>(
    "add-trafik-ozel-gorevlendirme-raporu",
    emptyTrafficSpecialDuty,
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
      officerName: d.officerName || profile.name.trim().toUpperCase(),
      adminOfficer: d.adminOfficer || profile.name.trim().toUpperCase(),
      adminSerialNo: d.adminSerialNo || profile.serialNo,
      division: d.division || "CTD",
      adminDivision: d.adminDivision || "CTD",
    }));
  }, [profile, setData]);

  const set = <K extends keyof TrafficSpecialDutyData>(key: K, value: TrafficSpecialDutyData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updateNarrative = (i: number, patch: Partial<DutyNarrativeItem>) =>
    set(
      "narratives",
      data.narratives.map((x, xi) => (xi === i ? { ...x, ...patch } : x)),
    );

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const reportTitle = `TÖGR 26-${data.titleNo.trim() || "0000"} - ${data.date.trim() || "GG/AA/YYYY"}`;

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
          <Section title="Başlık" wide hint="TÖGR 26-0000 - GG/AA/YYYY">
            <Field
              label="Rapor No."
              value={data.titleNo}
              onChange={(v) => set("titleNo", v)}
              placeholder="0000"
            />
            <DateField label="Tarih" value={data.date} onChange={(v) => set("date", v)} />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                {reportTitle}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="press"
                onClick={() => copy(reportTitle, "Başlık")}
              >
                <ClipboardCopy className="size-3.5" />
                Başlığı Kopyala
              </Button>
            </div>
          </Section>

          <Section title="Temel Bilgiler" wide>
            <Field
              label="Personel Adı Soyadı"
              value={data.officerName}
              onChange={(v) => set("officerName", v)}
              placeholder="JOHN DOE"
            />
            <Field
              label="Pozisyon"
              value={data.position}
              onChange={(v) => set("position", v)}
              placeholder="X"
            />
            <Field
              label="Görevlendirme"
              value={data.assignment}
              onChange={(v) => set("assignment", v)}
              placeholder="E"
            />
            <Field
              label="Division"
              value={data.division}
              onChange={(v) => set("division", v)}
              placeholder="CTD"
            />
          </Section>

          <Section title="Görevlendirme Türü" wide>
            <div className="sm:col-span-2 grid gap-2 sm:grid-cols-2">
              {dutyTypeOptions.map((o) => {
                const checked = !!data.dutyTypes[o.key];
                return (
                  <button
                    key={o.key}
                    type="button"
                    aria-pressed={checked}
                    onClick={() =>
                      set("dutyTypes", { ...data.dutyTypes, [o.key]: !checked })
                    }
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      checked
                        ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30"
                        : "border-border/70 bg-background/40 hover:border-border"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded border text-[10px] font-bold ${
                        checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-sm">
                      <span className="font-semibold">({o.key})</span> {o.label}
                    </span>
                  </button>
                );
              })}
            </div>
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
                      placeholder={`A: 2235`}
                      onChange={(e) => updateNarrative(i, { tag: e.target.value })}
                    />
                    <Textarea
                      rows={4}
                      className="bg-background/60"
                      value={item.text}
                      placeholder="Görevlendirme açıklaması"
                      onChange={(e) => updateNarrative(i, { text: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Açıklama maddesini sil"
                      onClick={() => {
                        const next = data.narratives.filter((_, xi) => xi !== i);
                        set("narratives", next.length ? next : [emptyDutyNarrative()]);
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
                  onClick={() => set("narratives", [...data.narratives, emptyDutyNarrative()])}
                >
                  <Plus className="size-4" />
                  Açıklama Ekle
                </Button>
              </div>
            </div>
          </Section>

          <Section title="İdari Bilgiler" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    officerName: p.name.trim().toUpperCase(),
                    adminOfficer: p.name.trim().toUpperCase(),
                    adminSerialNo: p.serialNo,
                    division: "CTD",
                    adminDivision: "CTD",
                  }))
                }
              />
            </div>
            <Field
              label="Personel Bilgisi"
              value={data.adminOfficer}
              onChange={(v) => set("adminOfficer", v)}
              placeholder="A. SOYADI"
            />
            <Field
              label="Seri No."
              value={data.adminSerialNo}
              onChange={(v) => set("adminSerialNo", v)}
              placeholder="00000"
            />
            <Field
              label="Division"
              value={data.adminDivision}
              onChange={(v) => set("adminDivision", v)}
              placeholder="CTD"
            />
          </Section>

        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildTrafficSpecialDutyBBCode(data))}>
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
