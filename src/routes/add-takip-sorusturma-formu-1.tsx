import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ClipboardCopy, FileSearch, Plus, Trash2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildFollowup1BBCode,
  buildFollowup1Title,
  caseFactorOptions,
  asEvidence,
  emptyEvidence,
  emptyFollowup1,
  emptyVictim,
  followupCaseTypes,
  incidentTypeOptions,
  otherFactorOptions,
  propertyTypeOptions,
  type Followup1Data,
  type FollowupVictim,
} from "@/lib/add-followup-1";

const title = "Takip Soruşturma Formu Birinci Sayfa";
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
  const [data, setData, clearDraft, savedAt] = useFormDraft<Followup1Data>(
    "add-takip-sorusturma-formu-1",
    emptyFollowup1,
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
    }));
  }, [profile, setData]);


  const set = <K extends keyof Followup1Data>(key: K, value: Followup1Data[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggle = (key: "incidentTypes" | "caseFactors" | "otherFactors", option: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(option) ? d[key].filter((x) => x !== option) : [...d[key], option],
    }));

  const victims = data.victims?.length ? data.victims : [emptyVictim()];

  const updateVictim = (index: number, patch: Partial<FollowupVictim>) =>
    setData((d) => {
      const list = d.victims?.length ? [...d.victims] : [emptyVictim()];
      list[index] = { ...(list[index] ?? emptyVictim()), ...patch };
      return { ...d, victims: list };
    });

  const addVictim = () =>
    setData((d) => ({ ...d, victims: [...(d.victims ?? []), emptyVictim()] }));

  const removeVictim = (index: number) =>
    setData((d) => {
      const list = (d.victims ?? []).filter((_, i) => i !== index);
      return { ...d, victims: list.length ? list : [emptyVictim()] };
    });

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const formTitle = buildFollowup1Title(data);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
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
              placeholder="0000"
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

          <Section title="Mağdur Bilgisi" wide hint={`${victims.length} mağdur`}>
            <div className="sm:col-span-2 space-y-4">
              {victims.map((vic, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background/40 p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                      Mağdur {i + 1}
                    </span>
                    {victims.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8 px-2 text-xs text-destructive hover:text-destructive"
                        onClick={() => removeVictim(i)}
                      >
                        <Trash2 className="size-3.5" />
                        Kaldır
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="Ad Soyadı (ya da İşletme Adı)"
                        value={vic.name}
                        onChange={(v) => updateVictim(i, { name: v })}
                      />
                    </div>
                    <Field label="Cinsiyet" value={vic.gender} onChange={(v) => updateVictim(i, { gender: v })} />
                    <Field
                      label="Etnik Grup"
                      value={vic.ethnicity}
                      onChange={(v) => updateVictim(i, { ethnicity: v })}
                    />
                    <Field label="Yaş" value={vic.age} onChange={(v) => updateVictim(i, { age: v })} />
                    <Field
                      label="İletişim Bilgisi"
                      value={vic.contact}
                      onChange={(v) => updateVictim(i, { contact: v })}
                    />
                    <div className="sm:col-span-2">
                      <Field label="Adres" value={vic.address} onChange={(v) => updateVictim(i, { address: v })} />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="press" onClick={addVictim}>
                <Plus className="size-4" />
                Mağdur Ekle
              </Button>
            </div>
          </Section>

          <Section title="Vaka Bilgisi" wide hint="Konum, tarihler ve maddi kayıp">
            <div className="sm:col-span-2">
              <Field label="Konum Bilgisi" value={data.location} onChange={(v) => set("location", v)} />
            </div>
            <DateField
              label="Meydana Gelme Tarihi"
              value={data.occurredAt}
              onChange={(v) => set("occurredAt", v)}
            />
            <DateField
              label="Bildirilme Tarihi"
              value={data.reportedAt}
              onChange={(v) => set("reportedAt", v)}
            />
            <div className="sm:col-span-2 grid gap-2">
              <Label
                htmlFor="property-type"
                className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Mülk Türü
              </Label>
              <select
                id="property-type"
                value={data.propertyType}
                onChange={(e) => set("propertyType", e.target.value)}
                className={cn(
                  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <option value="">Seçiniz</option>
                {propertyTypeOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Çalıntı/Kayıp ($)" value={data.lossAmount} onChange={(v) => set("lossAmount", v)} />
            <Field label="Geri Alınan ($)" value={data.recoveredAmount} onChange={(v) => set("recoveredAmount", v)} />
          </Section>

          <Section title="Detaylar" wide>
            <div className="sm:col-span-2 grid gap-5">
              <div className="grid gap-2">
                <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Olay Özeti
                </Label>
                <Textarea
                  rows={4}
                  value={data.summary}
                  onChange={(e) => set("summary", e.target.value)}
                  placeholder="Olayın kısa özeti..."
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Soruşturma
                </Label>
                <Textarea
                  rows={6}
                  value={data.investigation}
                  onChange={(e) => set("investigation", e.target.value)}
                  placeholder="Soruşturma süreci ve bulgular..."
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Kanıtlar
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setData((d) => ({ ...d, evidences: [...d.evidences, emptyEvidence()] }))}
                  >
                    <Plus className="mr-1 size-4" /> Kanıt Ekle
                  </Button>
                </div>
                <div className="grid gap-2">
                  {(data.evidences ?? [emptyEvidence()]).map((raw, i) => {
                    const ev = asEvidence(raw);
                    const update = (patch: Partial<typeof ev>) =>
                      setData((d) => ({
                        ...d,
                        evidences: d.evidences.map((x, j) => (j === i ? { ...asEvidence(x), ...patch } : x)),
                      }));
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <div className="grid flex-1 gap-2 sm:grid-cols-2">
                          <Input
                            value={ev.label}
                            onChange={(e) => update({ label: e.target.value })}
                            placeholder={`Kanıt ${i + 1} — görünecek ad`}
                          />
                          <Input
                            value={ev.url}
                            onChange={(e) => update({ url: e.target.value })}
                            placeholder="Bağlantı (https://...)"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Kanıtı sil"
                          disabled={(data.evidences ?? []).length <= 1}
                          onClick={() =>
                            setData((d) => ({ ...d, evidences: d.evidences.filter((_, j) => j !== i) }))
                          }
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
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
