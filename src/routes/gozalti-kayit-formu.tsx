import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { requirePortalAuth } from "@/lib/portal-auth";
import { ClipboardCopy, Lock } from "lucide-react";
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
import {
  assignmentOptions,
  buildCustodyFormBBCode,
  buildCustodyFormTitle,
  divisionOptions,
  emptyCustodyForm,
  genderOptions,
  type CustodyFormData,
} from "@/lib/custody-form";

export const Route = createFileRoute("/gozalti-kayit-formu")({
  beforeLoad: async ({ location }) => { await requirePortalAuth(location.href); },
  
  head: () => ({
    meta: [
      { title: "Gözaltı Kayıt Formu Oluşturucu — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "Gözaltı Kayıt Formu Oluşturucu — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<CustodyFormData>(
    "gozalti-kayit-formu",
    emptyCustodyForm,
  );
  const [output, setOutput] = useState("");

  const set = <K extends keyof CustodyFormData>(key: K, value: CustodyFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const title = useMemo(() => buildCustodyFormTitle(data), [data]);

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <ReportHeader title="Gözaltı Kayıt Formu" icon={Lock} />

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
            <div className="sm:col-span-2">
              <Field label="Adı Soyadı" value={data.suspectName} onChange={(v) => set("suspectName", v)} />
            </div>
            <SelectField
              label="Cinsiyeti"
              value={data.gender}
              onChange={(v) => set("gender", v)}
              options={genderOptions.map((g) => ({ label: g, value: g }))}
            />
            <Field label="Köken" value={data.origin} onChange={(v) => set("origin", v)} placeholder="Caucasian" />
            <Field label="Yaşı" value={data.age} onChange={(v) => set("age", v)} placeholder="00" />
            <Field label="Suçlamalar" value={data.charges} onChange={(v) => set("charges", v)} placeholder="000" />
            <Field label="Gözaltı Tarihi" value={data.custodyDate} onChange={(v) => set("custodyDate", v)} placeholder="GG/AA/YYYY" />
            <Field label="Gözaltı Saati" value={data.custodyTime} onChange={(v) => set("custodyTime", v)} placeholder="00:00" />
          </Section>

          <Section title="Konu Başlığı">
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
              <p className="mt-2 text-xs text-muted-foreground">
                Gözaltı tarihi ve şüpheli adından otomatik oluşturulur.
              </p>
            </div>
          </Section>

          <Section title="Personel Bilgisi" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    officerName: p.name,
                    serialNo: p.serialNo,
                    division: p.division || d.division,
                  }))
                }
              />
            </div>
            <Field label="Adı Soyadı" value={data.officerName} onChange={(v) => set("officerName", v)} />
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
            <Field
              label="Olay Raporu No."
              value={data.incidentReportNo}
              onChange={(v) => set("incidentReportNo", v)}
              placeholder="OR-00000"
            />
            <Field
              label="Olay Raporu Bağlantısı"
              value={data.incidentReportUrl}
              onChange={(v) => set("incidentReportUrl", v)}
              placeholder="https://..."
            />
          </Section>

          <Section title="Açıklama" wide>
            <div className="sm:col-span-2">
              <Label className="text-xs">Açıklama</Label>
              <Textarea
                rows={8}
                className="mt-2"
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Tutuklamaya yönelik kısa bilgilendirme ve neden bekletildiği..."
              />
            </div>
            <Field label="Discord Adı" value={data.discordName} onChange={(v) => set("discordName", v)} />
            <Field label="Forum Adı" value={data.forumName} onChange={(v) => set("forumName", v)} />
          </Section>

          <Section title="Booking">
            <div className="sm:col-span-2 space-y-2">
              <RadioItem label="Felony" checked={data.booking === "felony"} onChange={() => set("booking", data.booking === "felony" ? "" : "felony")} />
              <RadioItem label="Misdemeanor" checked={data.booking === "misdemeanor"} onChange={() => set("booking", data.booking === "misdemeanor" ? "" : "misdemeanor")} />
              <RadioItem label="Yapılmadı" checked={data.booking === "none"} onChange={() => set("booking", data.booking === "none" ? "" : "none")} />
            </div>
          </Section>

          <Section title="Miranda Tavsiyeleri">
            <div className="sm:col-span-2 space-y-2">
              <RadioItem label="Okundu & Anladı" checked={data.miranda === "read"} onChange={() => set("miranda", data.miranda === "read" ? "" : "read")} />
              <RadioItem label="Okunmadı" checked={data.miranda === "notread"} onChange={() => set("miranda", data.miranda === "notread" ? "" : "notread")} />
              <RadioItem label="Vazgeçti" checked={data.miranda === "waived"} onChange={() => set("miranda", data.miranda === "waived" ? "" : "waived")} />
            </div>
          </Section>

        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildCustodyFormBBCode(data))}>
            Formu Oluştur
          </Button>
          {output ? (
            <>
              <Button variant="outline" className="press" onClick={() => copy(output, "BBCode")}>
                <ClipboardCopy className="size-4" />
                Kopyala
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
            <h2 className="text-lg font-semibold">Çıktı</h2>
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

function RadioItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={onChange} />
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
