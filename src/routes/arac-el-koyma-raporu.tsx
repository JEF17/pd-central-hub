import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeAlert, CircleAlert, ClipboardCopy, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
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
  buildImpoundReportHtml,
  buildImpoundTitle,
  emptyImpoundReport,
  genderOptions,
  violationTypes,
  type ImpoundReportData,
} from "@/lib/impound-report";

export const Route = createFileRoute("/arac-el-koyma-raporu")({
  head: () => ({
    meta: [
      { title: "Araç El Koyma Raporu Oluşturucu — LSPD Portal" },
      {
        name: "description",
        content:
          "LSPD araç el koyma raporu formunu doldur, konu başlığını ve foruma hazır HTML çıktısını kopyala.",
      },
      { property: "og:title", content: "Araç El Koyma Raporu Oluşturucu — LSPD Portal" },
      {
        property: "og:description",
        content: "Araç, şüpheli ve ihlal bilgilerini doldur, HTML raporu ve başlığı al.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const violationStyles = {
  Infraction: {
    icon: BadgeAlert,
    tone: "text-success",
    selected: "border-success/60 bg-success/10 ring-1 ring-success/30",
    iconBackground: "bg-success/15",
  },
  Misdemeanor: {
    icon: CircleAlert,
    tone: "text-warning",
    selected: "border-warning/60 bg-warning/10 ring-1 ring-warning/30",
    iconBackground: "bg-warning/15",
    description: "Orta düzeydeki suçlar",
  },
  Felony: {
    icon: ShieldAlert,
    tone: "text-destructive",
    selected: "border-destructive/60 bg-destructive/10 ring-1 ring-destructive/30",
    iconBackground: "bg-destructive/15",
    description: "Ağır nitelikteki suçlar",
  },
} as const;

function Page() {
  const [data, setData] = useState<ImpoundReportData>(emptyImpoundReport);
  const [output, setOutput] = useState("");
  const title = buildImpoundTitle(data);

  const set = <K extends keyof ImpoundReportData>(key: K, value: ImpoundReportData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const setOfficer = (patch: Partial<ImpoundReportData["officer"]>) =>
    setData((d) => ({ ...d, officer: { ...d.officer, ...patch } }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    toast.success(`${label} kopyalandı`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link to="/paperwork-generators">
            <ArrowLeft className="size-4" />
            Rapor Oluştur
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Araç El Koyma Raporu</h1>
        <p className="mt-2 text-muted-foreground">
          Bu rapor HTML çıktısı üretir. Konu başlığı tarih, plaka ve modelden otomatik oluşur.
        </p>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <Label className="text-xs">Konu Başlığı</Label>
          <div className="mt-2 flex gap-3">
            <Input readOnly value={title} className="font-mono" />
            <Button variant="outline" onClick={() => copy(title, "Başlık")}>
              <ClipboardCopy className="size-4" />
              Kopyala
            </Button>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Section title="İhlal Türü">
            <div className="sm:col-span-2">
              <div className="grid gap-3 md:grid-cols-3" role="group" aria-label="İhlal türü seçimi">
                {violationTypes.map((type) => {
                  const style = violationStyles[type as keyof typeof violationStyles];
                  const Icon = style.icon;
                  const selected = data.violationType === type;

                  return (
                    <Button
                      key={type}
                      type="button"
                      variant="outline"
                      aria-pressed={selected}
                      onClick={() => set("violationType", type)}
                      className={cn(
                        "h-auto min-h-28 justify-start gap-3 whitespace-normal border-border bg-secondary/30 p-4 text-left transition-colors hover:bg-accent",
                        selected && style.selected,
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-lg",
                          style.iconBackground,
                        )}
                      >
                        <Icon className={cn("size-5", style.tone)} />
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-sm font-semibold", selected && style.tone)}>{type}</span>
                        <span className="mt-1 block text-xs leading-4 text-muted-foreground">
                          {style.description}
                        </span>
                      </span>
                    </Button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {data.violationType
                  ? `Seçilen ihlal sınıfı: ${data.violationType}`
                  : "Rapor için uygun ihlal sınıfını seçin."}
              </p>
            </div>
          </Section>

          <Section title="Araç Bilgisi">
            <Field label="Marka" value={data.vehicleBrand} onChange={(v) => set("vehicleBrand", v)} placeholder="VAPID" />
            <Field label="Model" value={data.vehicleModel} onChange={(v) => set("vehicleModel", v)} placeholder="SCOUT" />
            <Field label="Plaka" value={data.plate} onChange={(v) => set("plate", v)} placeholder="JBC 123" />
          </Section>

          <Section title="Personel Bilgisi" wide>
            <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Adı Soyadı" value={data.officer.name} onChange={(v) => setOfficer({ name: v })} />
              <Field
                label="Seri No."
                value={data.officer.serialNo}
                onChange={(v) => setOfficer({ serialNo: v })}
                placeholder="00000"
              />
              <SelectField
                label="Division"
                value={data.officer.division}
                onChange={(v) => setOfficer({ division: v })}
                options={divisionOptions.map((d) => ({ label: d, value: d }))}
              />
              <SelectField
                label="Görevlendirme"
                value={data.officer.assignment}
                onChange={(v) => setOfficer({ assignment: v })}
                options={assignmentOptions}
              />
              <Field
                label="Tarih"
                value={data.officer.date}
                onChange={(v) => setOfficer({ date: v })}
                placeholder="GG/AA/YYYY"
              />
            </div>
          </Section>

          <Section title="Şüpheli Bilgisi">
            <Field label="Adı Soyadı" value={data.suspectName} onChange={(v) => set("suspectName", v)} />
            <SelectField
              label="Cinsiyeti"
              value={data.suspectGender}
              onChange={(v) => set("suspectGender", v)}
              options={genderOptions.map((g) => ({ label: g, value: g }))}
            />
            <Field
              label="Köken"
              value={data.suspectOrigin}
              onChange={(v) => set("suspectOrigin", v)}
              placeholder="Caucasian"
            />
          </Section>

          <Section title="İhlal Bilgisi">
            <div className="sm:col-span-2">
              <Field label="Konum" value={data.location} onChange={(v) => set("location", v)} placeholder="000 Palomino Avenue" />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Ceza Kanunu"
                value={data.penalCode}
                onChange={(v) => set("penalCode", v)}
                placeholder="502. Alkollü Araç Kullanma"
              />
            </div>
            <Field label="Tarih" value={data.date} onChange={(v) => set("date", v)} placeholder="GG/AA/YYYY" />
            <Field label="Saat" value={data.time} onChange={(v) => set("time", v)} placeholder="00:00" />
          </Section>

          <Section title="Açıklama" wide>
            <div className="sm:col-span-2">
              <Label className="text-xs">Tanım</Label>
              <Textarea
                rows={10}
                className="mt-2"
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="09 Ağustos 2026 tarihi, 21:21 ve civarında Officer J. Doe (Seri No. 00000) olarak..."
              />
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => setOutput(buildImpoundReportHtml(data))}>Raporu Oluştur</Button>
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
}

function Section({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-6", wide && "lg:col-span-2")}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        className="mt-2"
        value={value}
        placeholder={placeholder ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
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
