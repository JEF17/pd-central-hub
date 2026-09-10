import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ClipboardCopy, FileQuestion } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { FormSection as Section, TextField as Field, DateField } from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { divisionCode } from "@/lib/officer-profile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildInterrogationBBCode,
  buildInterrogationTitle,
  emptyInterrogation,
  genderOptions,
  interrogationIncidentTypes,
  legalRepOptions,
  mirandaOptions,
  type InterrogationData,
} from "@/lib/add-interrogation";

const title = "Sorgu Raporu";
const description = "Detective Portal sorgu raporu formu (BBCode).";

export const Route = createFileRoute("/add-sorgu-raporu")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "area_detective_division" });
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

function CheckGroup({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <div className="sm:col-span-2 space-y-2">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o)}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition-all",
                active
                  ? "border-primary/60 bg-primary/10 text-foreground shadow-sm"
                  : "border-border bg-background/50 text-muted-foreground hover:border-primary/40 hover:bg-background",
              )}
            >
              <span
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background group-hover:border-primary/50",
                )}
              >
                {active ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
              <span className="leading-snug">{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<InterrogationData>(
    "add-sorgu-raporu",
    emptyInterrogation,
  );
  const [output, setOutput] = useState("");
  const profile = useOfficerProfile();
  const autoFilled = useRef(false);

  useEffect(() => {
    if (autoFilled.current || !profile) return;
    if (!profile.name && !profile.serialNo && !profile.division) return;
    autoFilled.current = true;
    setData((d) => ({
      ...d,
      officerName: d.officerName || profile.name.toUpperCase(),
      officerSerial: d.officerSerial || profile.serialNo,
      officerDivision: d.officerDivision || divisionCode(profile.division),
      titleSerial: d.titleSerial || profile.serialNo,
      titleName: d.titleName || profile.name.toUpperCase(),
    }));
  }, [profile, setData]);

  const set = <K extends keyof InterrogationData>(key: K, value: InterrogationData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggle = (key: "miranda" | "legalRep" | "incidentTypes", option: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(option) ? d[key].filter((x) => x !== option) : [...d[key], option],
    }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const formTitle = buildInterrogationTitle(data);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/detective-portal">
              <ArrowLeft className="size-3.5" />
              Detective Portal
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <FileQuestion className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
              </p>
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
          <Section title="Başlık" wide hint="SR — GG/AA/YYYY — 00000 (ADI SOYADI)">
            <DateField
              label="Tarih"
              value={data.titleDate}
              onChange={(v) => set("titleDate", v)}
            />
            <Field
              label="Seri No."
              value={data.titleSerial}
              onChange={(v) => set("titleSerial", v)}
              placeholder="00000"
            />
            <Field
              label="Adı Soyadı"
              value={data.titleName}
              onChange={(v) => set("titleName", v)}
              placeholder="ADI SOYADI"
            />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                {formTitle}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="press"
                onClick={() => copy(formTitle, "Başlık")}
              >
                <ClipboardCopy className="size-3.5" />
                Başlığı Kopyala
              </Button>
            </div>
          </Section>

          <Section title="Sorguyu Alan Personel" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    officerName: p.name,
                    officerSerial: p.serialNo,
                    officerDivision: p.division,
                  }))
                }
              />
            </div>
            <Field label="Adı Soyadı" value={data.officerName} onChange={(v) => set("officerName", v)} />
            <Field label="Seri No." value={data.officerSerial} onChange={(v) => set("officerSerial", v)} />
            <Field label="Division" value={data.officerDivision} onChange={(v) => set("officerDivision", v)} />
            <Field
              label="Görevlendirme"
              value={data.officerAssignment}
              onChange={(v) => set("officerAssignment", v)}
            />
            <DateField label="Tarih" value={data.officerDate} onChange={(v) => set("officerDate", v)} />
          </Section>

          <Section title="Sorgu Bilgileri" wide>
            <Field
              label="Sorgusu Alınanın Adı ve Soyadı"
              value={data.suspectName}
              onChange={(v) => set("suspectName", v)}
            />
            <div className="space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Cinsiyeti
              </Label>
              <div className="grid gap-2 grid-cols-2">
                {genderOptions.map((o) => {
                  const active = data.suspectGender === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={active}
                      onClick={() => set("suspectGender", active ? "" : o)}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition-all",
                        active
                          ? "border-primary/60 bg-primary/10 text-foreground shadow-sm"
                          : "border-border bg-background/50 text-muted-foreground hover:border-primary/40 hover:bg-background",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background group-hover:border-primary/50",
                        )}
                      >
                        {active ? <Check className="size-3" strokeWidth={3} /> : null}
                      </span>
                      <span className="leading-snug">{o}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <Field
              label="Sorgu Alınan Konum"
              value={data.location}
              onChange={(v) => set("location", v)}
            />
            <DateField
              label="Sorgu Tarihi ve Saati"
              value={data.interrogationDateTime}
              onChange={(v) => set("interrogationDateTime", v)}
              withTime
            />
            <Field
              label="İletişim Bilgisi"
              value={data.contactInfo}
              onChange={(v) => set("contactInfo", v)}
            />
            <Field
              label="İkametgah Adresi"
              value={data.residenceAddress}
              onChange={(v) => set("residenceAddress", v)}
            />
            <CheckGroup
              label="Miranda Tavsiyeleri"
              options={mirandaOptions}
              values={data.miranda}
              onToggle={(o) => toggle("miranda", o)}
            />
            <CheckGroup
              label="Yasal Temsilci"
              options={legalRepOptions}
              values={data.legalRep}
              onToggle={(o) => toggle("legalRep", o)}
            />
          </Section>

          <Section title="Detaylar" wide>
            <CheckGroup
              label="Olay Türü"
              options={interrogationIncidentTypes}
              values={data.incidentTypes}
              onToggle={(o) => toggle("incidentTypes", o)}
            />
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Açıklama
              </Label>
              <Textarea
                rows={10}
                value={data.details}
                onChange={(e) => set("details", e.target.value)}
                placeholder="Sorguyu özetleyerek anlatın ve önemli noktalara değinin. Üçüncül bakış açısıyla açıklayın."
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Kanıtlar — Sorgu Kayıtları
              </Label>
              <Textarea
                rows={8}
                value={data.evidenceLog}
                onChange={(e) => set("evidenceLog", e.target.value)}
                placeholder="Chatlog halinde buraya yerleştirin ve saat bilgisi içersin."
                className="font-mono text-xs"
              />
            </div>
          </Section>

          <Section title="İdari Bilgiler" wide>
            <Field
              label="Case Supervisor İmzası"
              value={data.supervisorName}
              onChange={(v) => set("supervisorName", v)}
              placeholder="A. SOYADI"
            />
            <Field
              label="Seri No."
              value={data.supervisorSerial}
              onChange={(v) => set("supervisorSerial", v)}
              placeholder="00000"
            />
            <Field
              label="Detective Commanding Officer İmzası"
              value={data.commandingOfficerName}
              onChange={(v) => set("commandingOfficerName", v)}
              placeholder="A. SOYADI"
            />
            <Field
              label="Seri No."
              value={data.commandingOfficerSerial}
              onChange={(v) => set("commandingOfficerSerial", v)}
              placeholder="00000"
            />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildInterrogationBBCode(data))}>
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
