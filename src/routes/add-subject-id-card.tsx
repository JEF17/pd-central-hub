import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, IdCard } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { DraftBar } from "@/components/DraftBar";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DateField, FormSection as Section, TextField as Field } from "@/components/report-ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import {
  buildSubjectIdCardBBCode,
  buildSubjectIdCardTitle,
  emptySubjectIdCard,
  SUBJECT_CRITERIA,
  SUBJECT_ORIGINS,
  type SubjectIdCardData,
} from "@/lib/add-subject-id-card";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Subject Identification Card 12.16.09 (12/17)";
const description = "Şüpheli kimlik kartı şablonu";

export const Route = createFileRoute("/add-subject-id-card")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "ged_git" });
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

const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<SubjectIdCardData>(
    "add-subject-id-card",
    emptySubjectIdCard,
  );
  const [output, setOutput] = useState("");
  const profile = useOfficerProfile();
  const autoFilled = useRef(false);

  useEffect(() => {
    if (autoFilled.current || !profile || (!profile.name && !profile.serialNo)) return;
    autoFilled.current = true;
    setData((current) => ({
      ...current,
      officerName: current.officerName || profile.name.trim().toUpperCase(),
      officerSerial: current.officerSerial || profile.serialNo,
    }));
  }, [profile, setData]);

  const set = <K extends keyof SubjectIdCardData>(key: K, value: SubjectIdCardData[K]) =>
    setData((current) => ({ ...current, [key]: value }));

  const toggleCriterion = (label: string, checked: boolean) =>
    set(
      "criteria",
      checked
        ? [...data.criteria.filter((item) => item !== label), label]
        : data.criteria.filter((item) => item !== label),
    );

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const reportTitle = buildSubjectIdCardTitle(data);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-4 py-5 shadow-sm sm:px-6 sm:py-6">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/gang-enforcement-detail">
              <ArrowLeft className="size-3.5" />
              GED / GIT
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <IdCard className="size-5" />
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
          <Section title="Konu Başlığı" wide hint="AD SOYAD - 00/00/0000 (SI Kart)">
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">{reportTitle}</code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="press"
                onClick={() => copy(reportTitle, "Başlık")}
              >
                <ClipboardCopy className="size-3.5" /> Başlığı Kopyala
              </Button>
            </div>
          </Section>

          <Section title="Temel Bilgiler" wide>
            <Field label="Ad Soyad" value={data.name} onChange={(value) => set("name", value)} placeholder="AD SOYAD" />
            <DateField label="Tarih" value={data.cardDate} onChange={(value) => set("cardDate", value)} />
            <Field label="Takma Ad" value={data.alias} onChange={(value) => set("alias", value)} />
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Köken</Label>
              <select
                value={data.origin}
                onChange={(event) => set("origin", event.target.value)}
                className={selectClass}
              >
                {SUBJECT_ORIGINS.map((origin) => (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Yaş" value={data.age} onChange={(value) => set("age", value)} />
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Cinsiyet</Label>
              <select
                value={data.gender}
                onChange={(event) => set("gender", event.target.value)}
                className={selectClass}
              >
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>
            </div>
            <Field label="Adresi" value={data.address} onChange={(value) => set("address", value)} />
            <Field
              label="Telefon No."
              value={data.phone}
              onChange={(value) => set("phone", value)}
              placeholder="000-0000"
            />
          </Section>

          <Section title="Detaylar" wide>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Çete Bağlantısı
              </Label>
              <select
                value={data.gangAffiliation}
                onChange={(event) => set("gangAffiliation", event.target.value)}
                className={selectClass}
              >
                <option value="">Seçiniz</option>
                <option value="Üye">Üye</option>
                <option value="Bağlantılı">Bağlantılı</option>
              </select>
            </div>
            <Field label="Çete" value={data.gang} onChange={(value) => set("gang", value)} />
            <Field label="Klik (Varsa)" value={data.clique} onChange={(value) => set("clique", value)} />
            <div className="sm:col-span-2 grid gap-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Belirgin Özellikler (Yaralar, Dövmeler, Fiziksel Bilgiler)
              </Label>
              <Textarea
                rows={5}
                value={data.features}
                onChange={(event) => set("features", event.target.value)}
                placeholder="Dövmeler, yaralar, belirgin fiziksel özellikler..."
              />
            </div>
            <div className="sm:col-span-2 grid gap-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Olay Özeti
              </Label>
              <Textarea
                rows={7}
                value={data.summary}
                onChange={(event) => set("summary", event.target.value)}
                placeholder="Birincil bakış açısıyla yazın..."
              />
            </div>
          </Section>

          <Section title="SanGang Kaydı" wide>
            <Field
              label="SanGang Kayıt Numarası"
              value={data.sangangNo}
              onChange={(value) => set("sangangNo", value)}
              placeholder="00000"
            />
            <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
              {SUBJECT_CRITERIA.map((label) => (
                <label
                  key={label}
                  className="flex items-start gap-2 rounded-lg border border-border bg-background/40 p-3 text-xs leading-relaxed"
                >
                  <Checkbox
                    checked={data.criteria.includes(label)}
                    onCheckedChange={(checked) => toggleCriterion(label, checked === true)}
                  />
                  <span className="min-w-0">{label}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="FI Kartı Bilgisi" wide hint="İlk etkileşim başka bir personel tarafından yapıldıysa">
            <DateField
              label="Tarih ve Saat"
              value={data.fiDateTime}
              onChange={(value) => set("fiDateTime", value)}
              withTime
            />
            <Field
              label="FI Kartı Bağlantısı"
              value={data.fiCardNo}
              onChange={(value) => set("fiCardNo", value)}
              placeholder="https://..."
            />
            <Field
              label="Personel Adı Soyadı"
              value={data.fiOfficerName}
              onChange={(value) => set("fiOfficerName", value)}
            />
            <Field label="Seri No." value={data.fiOfficerSerial} onChange={(value) => set("fiOfficerSerial", value)} />
          </Section>

          <Section title="İdari Bilgiler" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(values) =>
                  setData((current) => ({ ...current, officerName: values.name, officerSerial: values.serialNo }))
                }
              />
            </div>
            <Field
              label="Personel Adı Soyadı"
              value={data.officerName}
              onChange={(value) => set("officerName", value)}
            />
            <Field label="Seri No." value={data.officerSerial} onChange={(value) => set("officerSerial", value)} />
            <Field
              label="Onaylayan Supervisor"
              value={data.supervisorName}
              onChange={(value) => set("supervisorName", value)}
            />
            <Field
              label="Supervisor Seri No."
              value={data.supervisorSerial}
              onChange={(value) => set("supervisorSerial", value)}
            />
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Detail</Label>
              <select
                value={data.detail}
                onChange={(event) => set("detail", event.target.value)}
                className={selectClass}
              >
                <option value="GED">GED</option>
                <option value="GIT">GIT</option>
                <option value="GIT, GED">GIT, GED</option>
              </select>
            </div>
            <Field
              label="Division"
              value={data.division}
              onChange={(value) => set("division", value)}
              placeholder="MISN"
            />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildSubjectIdCardBBCode(data))}>
            Raporu Oluştur
          </Button>
          {output ? (
            <Button variant="outline" className="press" onClick={() => copy(output, "BBCode")}>
              <ClipboardCopy className="size-4" /> Kopyala
            </Button>
          ) : null}
        </div>

        {output ? (
          <section className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="text-lg font-semibold">Çıktı</h2>
            <p className="mt-1 text-sm text-muted-foreground">Konu başlığı: {reportTitle}</p>
            <Textarea readOnly value={output} rows={24} className="mt-4 font-mono text-xs" />
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
