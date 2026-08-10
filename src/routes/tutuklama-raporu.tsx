import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Info, Plus, Trash2, ShieldAlert, } from "lucide-react";
import { notify } from "@/lib/notifications";

import { AppShell } from "@/components/AppShell";
import { useReportShortcuts } from "@/hooks/use-report-shortcuts";
import {
  ReportHeader,
  FormSection as Section,
  TextField as Field,
} from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { assignmentOptions, divisionOptions } from "@/lib/incident-report";
import {
  buildArrestReportHtml,
  emptyArrestReport,
  genderOptions,
  type ArrestReportData,
} from "@/lib/arrest-report-html";

export const Route = createFileRoute("/tutuklama-raporu")({
  head: () => ({
    meta: [
      { title: "Tutuklama Raporu Oluşturucu — LSPD Portal" },
      {
        name: "description",
        content:
          "LSPD tutuklama raporu formunu doldur, foruma hazır HTML çıktısını tek tıkla kopyala.",
      },
      { property: "og:title", content: "Tutuklama Raporu Oluşturucu — LSPD Portal" },
      {
        property: "og:description",
        content: "Şüpheli, tutuklama, personel ve kanıt alanlarını doldur, HTML raporu al.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<ArrestReportData>("tutuklama-raporu", emptyArrestReport);
  const [output, setOutput] = useState("");

  const set = <K extends keyof ArrestReportData>(key: K, value: ArrestReportData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  useReportShortcuts({
    generate: () => setOutput(buildArrestReportHtml(data)),
    output,
    outputLabel: "HTML",
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <ReportHeader
          title="Tutuklama Raporu"
          description="Bu rapor BBCode değil, HTML çıktısı üretir. Alanları doldur ve çıktıyı kopyala."
          format="HTML"
          icon={ShieldAlert}
        />

        <DraftBar
          savedAt={savedAt}
          onClear={() => {
            clearDraft();
            setOutput("");
            notify.success("Şablon temizlendi");
          }}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Section title="Şüpheli Bilgisi">
            <Field label="Adı Soyadı" value={data.suspectName} onChange={(v) => set("suspectName", v)} />
            <SelectField
              label="Cinsiyeti"
              value={data.suspectGender}
              onChange={(v) => set("suspectGender", v)}
              options={genderOptions.map((g) => ({ label: g, value: g }))}
            />
            <Field label="Yaş" value={data.suspectAge} onChange={(v) => set("suspectAge", v)} placeholder="00" />
            <Field label="Köken" value={data.suspectOrigin} onChange={(v) => set("suspectOrigin", v)} placeholder="Caucasian" />
          </Section>

          <Section title="Tutuklama Bilgisi">
            <div className="sm:col-span-2">
              <Field label="Konum" value={data.location} onChange={(v) => set("location", v)} placeholder="000 Palomino Avenue" />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Ceza Kanunu"
                value={data.penalCode}
                onChange={(v) => set("penalCode", v)}
                placeholder="204. Ölümcül Silahla Saldırı"
              />
            </div>
            <Field label="Tarih" value={data.date} onChange={(v) => set("date", v)} placeholder="GG/AA/YYYY" />
            <Field label="Saat" value={data.time} onChange={(v) => set("time", v)} placeholder="00:00" />
          </Section>

          <Section title="Personel Bilgisi" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) => {
              updateOfficer(0, { name: p.name, serialNo: p.serialNo, ...(p.division ? { division: p.division } : {}) });
                }}
              />
            </div>

            <div className="sm:col-span-2 space-y-4">
              {data.officers.map((o, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/20 p-4">
                  <span className="text-xs font-medium text-muted-foreground">Personel #{i + 1}</span>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      label="Adı Soyadı"
                      value={o.name}
                      onChange={(v) => updateOfficer(i, { name: v })}
                    />
                    <Field
                      label="Seri No."
                      value={o.serialNo}
                      onChange={(v) => updateOfficer(i, { serialNo: v })}
                      placeholder="00000"
                    />
                    <SelectField
                      label="Division"
                      value={o.division}
                      onChange={(v) => updateOfficer(i, { division: v })}
                      options={divisionOptions.map((d) => ({ label: d, value: d }))}
                    />
                    <SelectField
                      label="Görevlendirme"
                      value={o.assignment}
                      onChange={(v) => updateOfficer(i, { assignment: v })}
                      options={assignmentOptions}
                    />
                    <Field
                      label="Tarih"
                      value={o.date}
                      onChange={(v) => updateOfficer(i, { date: v })}
                      placeholder="GG/AA/YYYY"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Açıklama" wide>
            <div className="sm:col-span-2">
              <Label className="text-xs">Tanım</Label>
              <Textarea
                rows={10}
                className="mt-2"
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="08 Mart 2025 tarihi, 21:21 ve civarında Officer J. Doe (Seri No. 00000) olarak..."
              />
            </div>
          </Section>

          <Section title="Kanıtlar" wide>
            <div className="sm:col-span-2 space-y-3">
              <Alert className="border-primary/20 bg-primary/5">
                <Info className="size-4" />
                <AlertTitle>Not</AlertTitle>
                <AlertDescription>
                  <p>Başlık kullanımında aşağıdaki formatların dışına çıkmayın:</p>
                  <ul className="mt-2 space-y-1 font-mono text-xs leading-relaxed">
                    <li>OR — 00/00/2025 — 00000</li>
                    <li>IR — 00/00/2025 — 00000</li>
                    <li>EV-20250000-000</li>
                    <li>CCTV ID #000 — Konum — GG/AA/YYYY</li>
                    <li>DICVS Seri No. 00000 - GG/AA/YYYY</li>
                    <li>BWV A. Soyadı #00000 - GG/AA/YYYY</li>
                    <li>Trafik Kazası Fotoğrafları (Plaka)</li>
                    <li>Impound Report - Araç Modeli - Plaka</li>
                    <li>Tutuklama Raporu (Şüpheli Adı)</li>
                    <li>FSD Sillah Adı - Balistik İncelemesi</li>
                    <li>FSD Eşya Adı - Parmak İzi İncelemesi</li>
                    <li>FSD DNA İnceleme Raporu</li>
                    <li>APB - Şüpheli Adı (APB Numarası)</li>
                    <li>Coroner Raporu (Mağdur Adı)</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {data.evidence.map((e, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <Input
                    value={e.label}
                    placeholder="Başlık"
                    onChange={(ev) => updateEvidence(i, { label: ev.target.value })}
                  />
                  <Input
                    value={e.url}
                    placeholder="https://..."
                    onChange={(ev) => updateEvidence(i, { url: ev.target.value })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Kanıtı kaldır"
                    onClick={() =>
                      set(
                        "evidence",
                        data.evidence.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => set("evidence", [...data.evidence, { label: "", url: "" }])}
              >
                <Plus className="size-4" />
                Kanıt ekle
              </Button>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildArrestReportHtml(data))}>Raporu Oluştur</Button>
          {output ? (
            <Button variant="outline" onClick={() => copy(output, "HTML")}>
              <ClipboardCopy className="size-4" />
              HTML kopyala
            </Button>
          ) : null}
        </div>

        {output ? (
          <section className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">HTML Çıktısı</h2>
            <Textarea readOnly value={output} rows={22} className="mt-4 font-mono text-xs" />
          </section>
        ) : null}
      </div>
    </AppShell>
  );

  function updateOfficer(index: number, patch: Partial<ArrestReportData["officers"][number]>) {
    set(
      "officers",
      data.officers.map((o, i) => (i === index ? { ...o, ...patch } : o)),
    );
  }

  function updateEvidence(index: number, patch: Partial<ArrestReportData["evidence"][number]>) {
    set(
      "evidence",
      data.evidence.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  }
}



function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Seçiniz" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
