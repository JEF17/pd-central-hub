import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, FileSearch, Plus, Trash2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { DraftBar } from "@/components/DraftBar";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DateField, FormSection as Section, TextField as Field } from "@/components/report-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import {
  buildGangInvestigationBBCode,
  buildGangInvestigationTitle,
  emptyDigitalRecord,
  emptyGangInvestigation,
  emptySanGangRecord,
  type DigitalRecord,
  type GangInvestigationData,
  type SanGangRecord,
} from "@/lib/add-gang-investigation";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Çete Soruşturma Dosyası Formu";
const description = " Çete soruşturma dosyası şablonu";

export const Route = createFileRoute("/add-cete-sorusturma-dosyasi")({
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

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<GangInvestigationData>(
    "add-cete-sorusturma-dosyasi",
    emptyGangInvestigation,
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

  const set = <K extends keyof GangInvestigationData>(key: K, value: GangInvestigationData[K]) =>
    setData((current) => ({ ...current, [key]: value }));

  const updateTextList = (key: "allies" | "enemies", index: number, value: string) =>
    set(key, data[key].map((item, itemIndex) => (itemIndex === index ? value : item)));

  const removeTextListItem = (key: "allies" | "enemies", index: number) => {
    const next = data[key].filter((_, itemIndex) => itemIndex !== index);
    set(key, next.length ? next : [""]);
  };

  const updateDigitalRecord = (index: number, patch: Partial<DigitalRecord>) =>
    set(
      "digitalRecords",
      data.digitalRecords.map((record, recordIndex) =>
        recordIndex === index ? { ...record, ...patch } : record,
      ),
    );

  const updateSanGangRecord = (index: number, patch: Partial<SanGangRecord>) =>
    set(
      "sanGangRecords",
      data.sanGangRecords.map((record, recordIndex) =>
        recordIndex === index ? { ...record, ...patch } : record,
      ),
    );

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const reportTitle = buildGangInvestigationTitle(data);

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
              <FileSearch className="size-5" />
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
          <Section title="Konu Başlığı" wide hint="ÇETE İSMİ / 26-000">
            <Field label="Çete İsmi" value={data.gangName} onChange={(value) => set("gangName", value)} placeholder="ÇETE İSMİ" />
            <Field label="Dosya No." value={data.fileNo} onChange={(value) => set("fileNo", value)} placeholder="000" />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">{reportTitle}</code>
              <Button type="button" variant="outline" size="sm" className="press" onClick={() => copy(reportTitle, "Başlık")}>
                <ClipboardCopy className="size-3.5" /> Başlığı Kopyala
              </Button>
            </div>
          </Section>

          <Section title="Temel Bilgiler" wide>
            <DateField label="Tarih" value={data.date} onChange={(value) => set("date", value)} />
            <div className="sm:col-span-2 grid gap-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Dosya Açıklaması</Label>
              <Textarea rows={6} value={data.description} onChange={(event) => set("description", event.target.value)} placeholder="Dosyanın açılmasına yönelik temel nedenleri açıklayın..." />
            </div>
          </Section>

          {(["allies", "enemies"] as const).map((key) => (
            <Section key={key} title={key === "allies" ? "Müttefikler" : "Düşmanlar"} wide>
              <div className="sm:col-span-2 space-y-2">
                {data[key].map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={item} onChange={(event) => updateTextList(key, index, event.target.value)} placeholder={`${key === "allies" ? "Müttefik" : "Düşman"} ${index + 1}`} />
                    <Button type="button" variant="ghost" size="icon" aria-label="Kaydı sil" onClick={() => removeTextListItem(key, index)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => set(key, [...data[key], ""])}>
                  <Plus className="size-4" /> Kayıt Ekle
                </Button>
              </div>
            </Section>
          ))}

          <Section title="Dijital Kayıtlar" wide hint={`${data.digitalRecords.length} kayıt`}>
            <div className="sm:col-span-2 space-y-4">
              {data.digitalRecords.map((record, index) => (
                <div key={index} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Kayıt {index + 1}</span>
                    <Button type="button" variant="ghost" size="icon" aria-label="Dijital kaydı sil" onClick={() => {
                      const next = data.digitalRecords.filter((_, recordIndex) => recordIndex !== index);
                      set("digitalRecords", next.length ? next : [emptyDigitalRecord()]);
                    }}><Trash2 className="size-4" /></Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DateField label="Tarih" value={record.date} onChange={(value) => updateDigitalRecord(index, { date: value })} />
                    <Field label="Adres" value={record.address} onChange={(value) => updateDigitalRecord(index, { address: value })} />
                    <div className="sm:col-span-2"><Field label="Kayıt Açıklaması" value={record.description} onChange={(value) => updateDigitalRecord(index, { description: value })} /></div>
                    <div className="sm:col-span-2"><Field label="Video / Fotoğraf Bağlantısı" value={record.media} onChange={(value) => updateDigitalRecord(index, { media: value })} placeholder="https://..." /></div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => set("digitalRecords", [...data.digitalRecords, emptyDigitalRecord()])}>
                <Plus className="size-4" /> Dijital Kayıt Ekle
              </Button>
            </div>
          </Section>

          <Section title="SanGang Kayıtları" wide hint={`${data.sanGangRecords.length} kayıt`}>
            <div className="sm:col-span-2 space-y-4">
              {data.sanGangRecords.map((record, index) => (
                <div key={index} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">SanGang Kaydı {index + 1}</span>
                    <Button type="button" variant="ghost" size="icon" aria-label="SanGang kaydını sil" onClick={() => {
                      const next = data.sanGangRecords.filter((_, recordIndex) => recordIndex !== index);
                      set("sanGangRecords", next.length ? next : [emptySanGangRecord()]);
                    }}><Trash2 className="size-4" /></Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Ad Soyadı" value={record.name} onChange={(value) => updateSanGangRecord(index, { name: value })} />
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Cinsiyet</Label>
                      <select value={record.gender} onChange={(event) => updateSanGangRecord(index, { gender: event.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="">Seçiniz</option><option value="Erkek">Erkek</option><option value="Kadın">Kadın</option>
                      </select>
                    </div>
                    <Field label="Yaş" value={record.age} onChange={(value) => updateSanGangRecord(index, { age: value })} />
                    <Field label="SanGang Kayıt Numarası" value={record.recordNo} onChange={(value) => updateSanGangRecord(index, { recordNo: value })} />
                    <div className="sm:col-span-2"><Field label="SanGang Bağlantısı" value={record.url} onChange={(value) => updateSanGangRecord(index, { url: value })} placeholder="https://..." /></div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => set("sanGangRecords", [...data.sanGangRecords, emptySanGangRecord()])}>
                <Plus className="size-4" /> SanGang Kaydı Ekle
              </Button>
            </div>
          </Section>

          <Section title="İdari Bilgiler" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton onFill={(values) => setData((current) => ({ ...current, officerName: values.name, officerSerial: values.serialNo }))} />
            </div>
            <Field label="Personel Adı Soyadı" value={data.officerName} onChange={(value) => set("officerName", value)} />
            <Field label="Seri No." value={data.officerSerial} onChange={(value) => set("officerSerial", value)} />
            <Field label="Onaylayan Supervisor" value={data.supervisorName} onChange={(value) => set("supervisorName", value)} />
            <Field label="Supervisor Seri No." value={data.supervisorSerial} onChange={(value) => set("supervisorSerial", value)} />
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Detail</Label>
              <select value={data.detail} onChange={(event) => set("detail", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="GED">GED</option><option value="GIT">GIT</option>
              </select>
            </div>
            <Field label="Division" value={data.division} onChange={(value) => set("division", value)} placeholder="MISN" />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildGangInvestigationBBCode(data))}>Raporu Oluştur</Button>
          {output ? <Button variant="outline" className="press" onClick={() => copy(output, "BBCode")}><ClipboardCopy className="size-4" /> Kopyala</Button> : null}
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