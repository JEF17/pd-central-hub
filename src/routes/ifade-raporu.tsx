import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Plus, Trash2, MessageSquareQuote, } from "lucide-react";
import { notify } from "@/lib/notifications";

import { AppShell } from "@/components/AppShell";
import {
  ReportHeader,
  FormSection as Section,
  TextField as Field,
} from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  assignmentOptions,
  buildStatementBBCode,
  buildStatementTitle,
  divisionOptions,
  emptyStatementReport,
  mirandaOptions,
  statementIncidentTypeOptions,
  type StatementReportData,
} from "@/lib/statement-report";

export const Route = createFileRoute("/ifade-raporu")({
  head: () => ({
    meta: [
      { title: "İfade Raporu Oluşturucu — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "İfade Raporu Oluşturucu — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<StatementReportData>("ifade-raporu", emptyStatementReport);
  const [output, setOutput] = useState<string>("");

  const set = <K extends keyof StatementReportData>(key: K, value: StatementReportData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggle = (key: "incidentTypes" | "miranda", value: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const title = useMemo(() => buildStatementTitle(data), [data]);

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };


  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <ReportHeader
          title="İfade Raporu"
          description="Alanları doldur, alt kısımda foruma yapıştırabileceğin BBCode çıktısı oluşsun."
          format="BBCode"
          icon={MessageSquareQuote}
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
          <Section title="Rapor">
            <Field label="Rapor No." value={data.reportNo} onChange={(v) => set("reportNo", v)} placeholder="12345" />
            <div className="sm:col-span-2 rounded-lg border border-border bg-muted/30 p-3">
              <Label className="text-xs">Konu Başlığı</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input readOnly value={title} className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copy(title, "Konu başlığı")}
                  aria-label="Konu başlığını kopyala"
                >
                  <ClipboardCopy className="size-4" />
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Personel Bilgileri">
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) => {
              setData((d) => ({ ...d, officerName: p.name, serialNo: p.serialNo, division: p.division || d.division }));
                }}
              />
            </div>

            <Field label="İfadeyi Alan" value={data.officerName} onChange={(v) => set("officerName", v)} />
            <Field label="Seri No." value={data.serialNo} onChange={(v) => set("serialNo", v)} placeholder="00000" />
            <SelectField
              label="Division"
              value={data.division}
              onChange={(v) => set("division", v)}
              options={divisionOptions.map((d) => ({ label: d, value: d }))}
            />
            <SelectField
              label="Görevlendirme"
              value={data.assignment}
              onChange={(v) => set("assignment", v)}
              options={assignmentOptions}
            />
            <Field label="Tarih" value={data.date} onChange={(v) => set("date", v)} placeholder="GG/AA/YYYY" />
          </Section>

          <Section title="Olay Türü" wide>
            <div className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {statementIncidentTypeOptions.map((t) => (
                  <CheckItem
                    key={t}
                    label={t}
                    checked={data.incidentTypes.includes(t)}
                    onChange={() => toggle("incidentTypes", t)}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section title="İfadeyi Veren">
            <Field label="Adı Soyadı" value={data.personName} onChange={(v) => set("personName", v)} />
            <div>
              <Label className="text-xs">Cinsiyet</Label>
              <div className="mt-3 flex gap-4">
                <CheckItem
                  label="Erkek"
                  checked={data.personGender === "male"}
                  onChange={() => set("personGender", data.personGender === "male" ? "" : "male")}
                />
                <CheckItem
                  label="Kadın"
                  checked={data.personGender === "female"}
                  onChange={() => set("personGender", data.personGender === "female" ? "" : "female")}
                />
              </div>
            </div>
            <Field label="İletişim Bilgisi" value={data.contact} onChange={(v) => set("contact", v)} />
            <Field label="İkametgah Adresi" value={data.address} onChange={(v) => set("address", v)} />
          </Section>

          <Section title="İfade Bilgileri">
            <Field
              label="İfade Alınan Konum"
              value={data.statementLocation}
              onChange={(v) => set("statementLocation", v)}
              placeholder="Konumu girin"
            />
            <Field
              label="İfade Tarihi"
              value={data.statementDate}
              onChange={(v) => set("statementDate", v)}
              placeholder="GG/AA/YYYY"
            />
          </Section>

          <Section title="Detaylar" wide>
            <div className="sm:col-span-2">
              <Textarea
                rows={8}
                value={data.details}
                onChange={(e) => set("details", e.target.value)}
                placeholder="İfadenin detaylı anlatımı..."
              />
            </div>
          </Section>

          <Section title="Kanıtlar" wide>
            <div className="sm:col-span-2 space-y-3">
              {data.evidence.map((e, i) => (
                <div key={e.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                  <div>
                    <Label className="text-xs">Kanıt {i + 1}</Label>
                    <Input
                      className="mt-2"
                      value={e.label}
                      placeholder="Kanıt açıklaması"
                      onChange={(ev) =>
                        setData((d) => ({
                          ...d,
                          evidence: d.evidence.map((x) => (x.id === e.id ? { ...x, label: ev.target.value } : x)),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Bağlantı (link)</Label>
                    <Input
                      className="mt-2"
                      value={e.url}
                      placeholder="https://..."
                      onChange={(ev) =>
                        setData((d) => ({
                          ...d,
                          evidence: d.evidence.map((x) => (x.id === e.id ? { ...x, url: ev.target.value } : x)),
                        }))
                      }
                    />
                  </div>
                  {data.evidence.length > 1 ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Kanıtı sil"
                      onClick={() => setData((d) => ({ ...d, evidence: d.evidence.filter((x) => x.id !== e.id) }))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    evidence: [...d.evidence, { id: `e${Date.now()}`, label: "", url: "" }],
                  }))
                }
              >
                <Plus className="size-4" />
                Kanıt ekle
              </Button>
            </div>
          </Section>

          <Section title="Miranda Bilgilendirmesi" wide>
            <div className="sm:col-span-2 space-y-2">
              {mirandaOptions.map((m) => (
                <CheckItem key={m} label={m} checked={data.miranda.includes(m)} onChange={() => toggle("miranda", m)} />
              ))}
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildStatementBBCode(data))}>Raporu Oluştur</Button>
          {output ? (
            <>
              <Button variant="outline" className="press" onClick={() => copy(output, "BBCode")}>
                <ClipboardCopy className="size-4" />
                BBCode kopyala
              </Button>
              <Button variant="outline" className="press" onClick={() => copy(title, "Konu başlığı")}>
                <ClipboardCopy className="size-4" />
                Konu başlığı kopyala
              </Button>
            </>
          ) : null}

        </div>

        {output ? (
          <section className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">BBCode Çıktısı</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Konu başlığı: <span className="font-mono">{title}</span>
            </p>
            <Textarea readOnly value={output} rows={22} className="mt-4 font-mono text-xs" />
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}



function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={onChange} className="mt-0.5" />
      <span>{label}</span>
    </label>
  );
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
