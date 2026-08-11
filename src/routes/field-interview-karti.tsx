import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, IdCard, } from "lucide-react";
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
  buildFiCardBBCode,
  buildFiCardTitle,
  divisionOptions,
  emptyFiCard,
  personInfoOptions,
  type FiCardData,
} from "@/lib/fi-card";

export const Route = createFileRoute("/field-interview-karti")({
  head: () => ({
    meta: [
      { title: "Field Interview Kartı Oluşturucu — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "Field Interview Kartı Oluşturucu — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<FiCardData>("field-interview-karti", emptyFiCard);
  const [output, setOutput] = useState<string>("");

  const set = <K extends keyof FiCardData>(key: K, value: FiCardData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const togglePersonInfo = (value: string) =>
    setData((d) => ({
      ...d,
      personInfo: d.personInfo.includes(value)
        ? d.personInfo.filter((v) => v !== value)
        : [...d.personInfo, value],
    }));

  const title = useMemo(() => buildFiCardTitle(data), [data]);

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };


  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <ReportHeader
          title="Field Interview Kartı"
          description="Alanları doldur, alt kısımda foruma yapıştırabileceğin BBCode çıktısı oluşsun."
          format="BBCode"
          icon={IdCard}
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
          <Section title="Kişi Bilgileri">
            <div className="sm:col-span-2 space-y-5">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Kimlik
                </p>
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                  <Field label="Adı Soyadı" value={data.personName} onChange={(v) => set("personName", v)} />
                  <Field label="Takma Adı" value={data.nickname} onChange={(v) => set("nickname", v)} />
                  <div className="space-y-2">
                    <Label className="text-xs">Cinsiyet</Label>
                    <div className="flex h-10 items-center gap-4 rounded-md border border-input bg-background px-3">
                      <CheckItem
                        label="Erkek"
                        checked={data.gender === "male"}
                        onChange={() => set("gender", data.gender === "male" ? "" : "male")}
                      />
                      <CheckItem
                        label="Kadın"
                        checked={data.gender === "female"}
                        onChange={() => set("gender", data.gender === "female" ? "" : "female")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/70 pt-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  İletişim
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="İletişim Bilgisi" value={data.contact} onChange={(v) => set("contact", v)} />
                  <Field label="Adres Bilgisi" value={data.address} onChange={(v) => set("address", v)} />
                </div>
              </div>
            </div>
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
                Adı soyadı ve tarih alanlarından otomatik oluşturulur.
              </p>
            </div>
          </Section>

          <Section title="Kişi Durumu" wide>
            <div className="sm:col-span-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {personInfoOptions.map((o) => (
                <CheckItem
                  key={o}
                  label={o}
                  checked={data.personInfo.includes(o)}
                  onChange={() => togglePersonInfo(o)}
                />
              ))}
            </div>
          </Section>

          <Section title="Ek Bilgi" wide>
            <div className="sm:col-span-2">
              <Textarea
                rows={8}
                value={data.extraInfo}
                onChange={(e) => set("extraInfo", e.target.value)}
                placeholder="Elektronik posta adresi, sosyal medya hesapları, diğer kişiler ve görüşme detayları..."
              />
            </div>
          </Section>

          <Section title="Görüşme Bilgileri">
            <Field label="Tarih" value={data.date} onChange={(v) => set("date", v)} placeholder="GG/AA/YYYY" />
            <Field label="Saat" value={data.time} onChange={(v) => set("time", v)} placeholder="0000" />
            <div className="sm:col-span-2">
              <Field label="Konum" value={data.location} onChange={(v) => set("location", v)} placeholder="Konumu girin" />
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

            <Field label="Memur" value={data.officerName} onChange={(v) => set("officerName", v)} />
            <Field label="Seri No." value={data.serialNo} onChange={(v) => set("serialNo", v)} placeholder="00000" />
            <Field label="Memur (2)" value={data.officer2Name} onChange={(v) => set("officer2Name", v)} />
            <Field label="Seri No. (2)" value={data.serial2No} onChange={(v) => set("serial2No", v)} placeholder="00000" />
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
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildFiCardBBCode(data))}>Kartı Oluştur</Button>
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
