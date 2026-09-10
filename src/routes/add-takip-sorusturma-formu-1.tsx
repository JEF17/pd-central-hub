import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, FileSearch } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { FormSection as Section, TextField as Field, DateField } from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildFollowup1BBCode,
  buildFollowup1Title,
  caseFactorOptions,
  emptyFollowup1,
  followupCaseTypes,
  incidentTypeOptions,
  otherFactorOptions,
  type Followup1Data,
} from "@/lib/add-followup-1";

const title = "Takip Soruşturma Formu 1";
const description = "Area Detective Division takip soruşturma raporu (BBCode).";

export const Route = createFileRoute("/add-takip-sorusturma-formu-1")({
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
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                active
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border bg-background/60 text-muted-foreground hover:border-primary/30",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<Followup1Data>(
    "add-takip-sorusturma-formu-1",
    emptyFollowup1,
  );
  const [output, setOutput] = useState("");

  const set = <K extends keyof Followup1Data>(key: K, value: Followup1Data[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggle = (key: "incidentTypes" | "caseFactors" | "otherFactors", option: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(option) ? d[key].filter((x) => x !== option) : [...d[key], option],
    }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const formTitle = buildFollowup1Title(data);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/area-detective-division">
              <ArrowLeft className="size-3.5" />
              Area Detective Division
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <FileSearch className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Alanları doldur; konu başlığı ve BBCode çıktısı otomatik oluşsun.
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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Section title="Konu Başlığı" wide>
            <div className="grid gap-2">
              <Label htmlFor="case-type" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Başlık Türü
              </Label>
              <select
                id="case-type"
                value={data.caseType}
                onChange={(e) => set("caseType", e.target.value as Followup1Data["caseType"])}
                className={cn(
                  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <option value="">Seçiniz</option>
                {followupCaseTypes.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label} (02-{t.code})
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Rapor No."
              value={data.titleNo}
              onChange={(v) => set("titleNo", v)}
              placeholder="0000 veya 26-0000"
            />
            <DateField
              label="Tarih"
              value={data.titleDate}
              onChange={(v) => set("titleDate", v)}
            />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <span className="font-mono text-sm">{formTitle}</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="ml-auto press"
                onClick={() => copy(formTitle, "Başlık")}
              >
                <ClipboardCopy className="size-4" />
                Başlığı Kopyala
              </Button>
            </div>
          </Section>

          <Section title="Olay Bilgisi" wide>
            <Field
              label="Olay Raporu No."
              value={data.incidentReportNo}
              onChange={(v) => set("incidentReportNo", v)}
            />
            <Field
              label="Soruşturma Rapor No."
              value={data.investigationReportNo}
              onChange={(v) => set("investigationReportNo", v)}
            />
            <CheckGroup
              label="Olay Türü"
              options={incidentTypeOptions}
              values={data.incidentTypes}
              onToggle={(o) => toggle("incidentTypes", o)}
            />
          </Section>

          <Section title="Mağdur Bilgisi">
            <div className="sm:col-span-2">
              <Field
                label="Ad Soyadı (ya da İşletme Adı)"
                value={data.victimName}
                onChange={(v) => set("victimName", v)}
              />
            </div>
            <Field label="Cinsiyet" value={data.victimGender} onChange={(v) => set("victimGender", v)} />
            <Field label="Etnik Grup" value={data.victimEthnicity} onChange={(v) => set("victimEthnicity", v)} />
            <Field label="Yaş" value={data.victimAge} onChange={(v) => set("victimAge", v)} />
            <Field label="İletişim Bilgisi" value={data.victimContact} onChange={(v) => set("victimContact", v)} />
            <div className="sm:col-span-2">
              <Field label="Adres" value={data.victimAddress} onChange={(v) => set("victimAddress", v)} />
            </div>
          </Section>

          <Section title="Vaka Bilgisi">
            <div className="sm:col-span-2">
              <Field label="Konum Bilgisi" value={data.location} onChange={(v) => set("location", v)} />
            </div>
            <DateField
              label="Meydana Gelme Tarihi"
              value={data.occurredAt}
              onChange={(v) => set("occurredAt", v)}
              withTime
            />
            <DateField
              label="Bildirilme Tarihi"
              value={data.reportedAt}
              onChange={(v) => set("reportedAt", v)}
              withTime
            />
            <div className="sm:col-span-2">
              <Field
                label="Çalıntı/Kayıp/Hasarlı Mülk Türü"
                value={data.propertyType}
                onChange={(v) => set("propertyType", v)}
              />
            </div>
            <Field label="Çalıntı/Kayıp ($)" value={data.lossAmount} onChange={(v) => set("lossAmount", v)} />
            <Field label="Geri Alınan ($)" value={data.recoveredAmount} onChange={(v) => set("recoveredAmount", v)} />
          </Section>

          <Section title="Detaylar" wide>
            <div className="sm:col-span-2">
              <Textarea
                rows={9}
                value={data.details}
                onChange={(e) => set("details", e.target.value)}
                placeholder="Soruşturmanın detaylı açıklaması..."
              />
            </div>
            <CheckGroup
              label="Vaka Faktörleri"
              options={caseFactorOptions}
              values={data.caseFactors}
              onToggle={(o) => toggle("caseFactors", o)}
            />
            <CheckGroup
              label="Diğer"
              options={otherFactorOptions}
              values={data.otherFactors}
              onToggle={(o) => toggle("otherFactors", o)}
            />
          </Section>

          <Section title="İdari Bilgiler" wide>
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
            <Field label="Personel Bilgisi" value={data.officerName} onChange={(v) => set("officerName", v)} />
            <Field label="Seri No." value={data.officerSerial} onChange={(v) => set("officerSerial", v)} />
            <Field label="Division" value={data.officerDivision} onChange={(v) => set("officerDivision", v)} />
            <DateField
              label="Tarih ve Saat"
              value={data.officerDateTime}
              onChange={(v) => set("officerDateTime", v)}
              withTime
            />
            <Field label="Supervisor Bilgisi" value={data.supervisorName} onChange={(v) => set("supervisorName", v)} />
            <Field label="Supervisor Seri No." value={data.supervisorSerial} onChange={(v) => set("supervisorSerial", v)} />
            <Field
              label="Supervisor Division"
              value={data.supervisorDivision}
              onChange={(v) => set("supervisorDivision", v)}
            />
            <DateField
              label="Supervisor Tarih ve Saat"
              value={data.supervisorDateTime}
              onChange={(v) => set("supervisorDateTime", v)}
              withTime
            />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildFollowup1BBCode(data))}>
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
            <p className="mt-1 text-sm text-muted-foreground">Konu başlığı: {formTitle}</p>
            <Textarea readOnly value={output} rows={24} className="mt-4 font-mono text-xs" />
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
