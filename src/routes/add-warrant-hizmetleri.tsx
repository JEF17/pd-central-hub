import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ClipboardCopy,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { FormSection as Section, TextField as Field, DateField } from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { divisionCode } from "@/lib/officer-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildWarrantBBCode,
  buildWarrantTitle,
  emptyWarrant,
  WARRANT_DIRECTIVE_URL,
  warrantOpTypes,
  warrantRiskTypes,
  type WarrantData,
} from "@/lib/add-warrant";

const title = "Warrant Hizmetleri";
const description = "Tactical Operation Plan — Search / Arrest Warrant operasyon planı formu (BBCode).";

export const Route = createFileRoute("/add-warrant-hizmetleri")({
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

function OptionCard({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
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
      <span className="leading-snug">{label}</span>
    </button>
  );
}

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<WarrantData>(
    "add-warrant-hizmetleri",
    emptyWarrant,
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
    }));
  }, [profile, setData]);

  const set = <K extends keyof WarrantData>(key: K, value: WarrantData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const setListItem = (key: "locations" | "photoLinks", index: number, value: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].map((item, i) => (i === index ? value : item)),
    }));

  const addListItem = (key: "locations" | "photoLinks") =>
    setData((d) => ({ ...d, [key]: [...d[key], ""] }));

  const removeListItem = (key: "locations" | "photoLinks", index: number) =>
    setData((d) => {
      const next = d[key].filter((_, i) => i !== index);
      return { ...d, [key]: next.length ? next : [""] };
    });

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const formTitle = buildWarrantTitle(data);

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
              <ShieldAlert className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                İlgili yönetmeliği okumayı unutmayın!
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <a href={WARRANT_DIRECTIVE_URL} target="_blank" rel="noreferrer">
                <BookOpen className="size-4" />
                Warrant Hizmetleri Yönergesi
              </a>
            </Button>
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
          <Section title="Başlık" wide hint="TP — GG/AA/YYYY — 00000">
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

          <Section title="Temel Bilgiler" wide>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Operasyon Türü
              </Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {warrantOpTypes.map((o) => (
                  <OptionCard
                    key={o.label}
                    label={o.label}
                    active={data.opType === o.label}
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        opType: d.opType === o.label ? "" : o.label,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
            {data.opType ? (
              <Field
                label={`${data.opType} Bağlantısı`}
                value={data.opTypeLink}
                onChange={(v) => set("opTypeLink", v)}
                placeholder="https://..."
              />
            ) : null}
            <Field
              label="Op No."
              value={data.opNo}
              onChange={(v) => set("opNo", v)}
              placeholder="X"
            />
            <Field
              label="Briefing Konumu"
              value={data.briefingLocation}
              onChange={(v) => set("briefingLocation", v)}
            />
            <DateField
              label="Tarih ve Saat"
              value={data.dateTime}
              onChange={(v) => set("dateTime", v)}
              withTime
            />
            <Field
              label="Telsiz Frekansı"
              value={data.radioFrequency}
              onChange={(v) => set("radioFrequency", v)}
            />
          </Section>

          <Section title="Detaylar" wide>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Olay Özeti
              </Label>
              <Textarea
                rows={5}
                value={data.incidentSummary}
                onChange={(e) => set("incidentSummary", e.target.value)}
                placeholder="Kısa bir şekilde suçtan ve şüpheliden bahsedin. Kısa tutmaya çalışın."
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Operasyon Planı
              </Label>
              <Textarea
                rows={8}
                value={data.operationPlan}
                onChange={(e) => set("operationPlan", e.target.value)}
                placeholder="Operasyonun nasıl gerçekleşeceği, görevlendirmeler, hangi noktaların destekleneceği, kimin nerede yer alacağı veya ne yapacağı."
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Diğer
              </Label>
              <Textarea
                rows={4}
                value={data.other}
                onChange={(e) => set("other", e.target.value)}
                placeholder="Şüpheli bilgileri, kaç şüpheli var, bölgede çete var mı gibi detaylar."
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Risk Türü
              </Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {warrantRiskTypes.map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    active={data.riskType === o}
                    onClick={() => set("riskType", data.riskType === o ? "" : o)}
                  />
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Operasyon Konumu
              </Label>
              <div className="space-y-2">
                {data.locations.map((loc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      className="h-10 bg-background/60"
                      value={loc}
                      placeholder={`Konum ${i + 1}`}
                      onChange={(e) => setListItem("locations", i, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Konumu sil"
                      onClick={() => removeListItem("locations", i)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem("locations")}
                >
                  <Plus className="size-4" />
                  Konum Ekle
                </Button>
              </div>
            </div>
            <Field
              label="Mülk Fotoğrafı Bağlantısı"
              value={data.propertyPhotoLink}
              onChange={(v) => set("propertyPhotoLink", v)}
              placeholder="https://..."
            />
            <div className="space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Diğer Fotoğraflar
              </Label>
              <div className="space-y-2">
                {data.photoLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      className="h-10 bg-background/60"
                      value={link}
                      placeholder="https://..."
                      onChange={(e) => setListItem("photoLinks", i, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Fotoğrafı sil"
                      onClick={() => removeListItem("photoLinks", i)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem("photoLinks")}
                >
                  <Plus className="size-4" />
                  Fotoğraf Ekle
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Personel Bilgileri" wide>
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
            <Field label="Seri No." value={data.officerSerial} onChange={(v) => set("officerSerial", v)} placeholder="00000" />
            <Field label="Division" value={data.officerDivision} onChange={(v) => set("officerDivision", v)} />
            <Field label="Görevlendirme" value={data.officerAssignment} onChange={(v) => set("officerAssignment", v)} />
            <DateField label="Tarih" value={data.officerDate} onChange={(v) => set("officerDate", v)} />
          </Section>

          <Section title="Supervisor Bilgileri" wide>
            <Field label="Supervisor Bilgisi" value={data.supervisorName} onChange={(v) => set("supervisorName", v)} />
            <Field label="Seri No." value={data.supervisorSerial} onChange={(v) => set("supervisorSerial", v)} placeholder="00000" />
            <Field label="Division" value={data.supervisorDivision} onChange={(v) => set("supervisorDivision", v)} />
            <Field label="Görevlendirme" value={data.supervisorAssignment} onChange={(v) => set("supervisorAssignment", v)} />
            <DateField label="Tarih" value={data.supervisorDate} onChange={(v) => set("supervisorDate", v)} />
          </Section>

          <Section title="Commanding Officer" wide>
            <Field
              label="Commanding Officer"
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
            <Field
              label="Division"
              value={data.commandingOfficerDivision}
              onChange={(v) => set("commandingOfficerDivision", v)}
            />
            <DateField
              label="Tarih"
              value={data.commandingOfficerDate}
              onChange={(v) => set("commandingOfficerDate", v)}
            />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildWarrantBBCode(data))}>
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
