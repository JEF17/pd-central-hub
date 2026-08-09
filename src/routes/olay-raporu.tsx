import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  ClipboardCopy,
  FileSearch,
  Gavel,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const processIcons: Record<string, LucideIcon> = {
  "Güç Kullanıldı": ShieldAlert,
  "Tutuklama Yapıldı": Gavel,
  "Takip Soruşturması Gerekiyor": Search,
  "APB Gerekiyor": BadgeCheck,
  Sonuçlandı: BadgeCheck,
};

const processProgressClasses: Record<number, string> = {
  0: "w-0",
  1: "w-1/5",
  2: "w-2/5",
  3: "w-3/5",
  4: "w-4/5",
  5: "w-full",
};

import {
  areaOptions,
  assignmentOptions,
  buildIncidentBBCode,
  buildIncidentTitle,
  divisionOptions,
  emptyIncidentReport,
  followUpOptions,
  incidentTypeOptions,
  processOptions,
  type IncidentPerson,
  type IncidentReportData,
} from "@/lib/incident-report";

export const Route = createFileRoute("/olay-raporu")({
  head: () => ({
    meta: [
      { title: "Olay Raporu Oluşturucu — LSPD Portal" },
      {
        name: "description",
        content:
          "LSPD Olay Raporu formunu doldur, forum için hazır BBCode çıktısı ve konu başlığı oluştur.",
      },
      { property: "og:title", content: "Olay Raporu Oluşturucu — LSPD Portal" },
      {
        property: "og:description",
        content: "Formu doldur, tek tıkla BBCode olay raporu ve konu başlığı al.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData] = useState<IncidentReportData>(emptyIncidentReport);
  const [output, setOutput] = useState<string>("");

  const set = <K extends keyof IncidentReportData>(key: K, value: IncidentReportData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggle = (key: "incidentTypes" | "process" | "followUps", value: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const updatePerson = (id: string, patch: Partial<IncidentPerson>) =>
    setData((d) => ({
      ...d,
      people: d.people.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));

  const title = useMemo(() => buildIncidentTitle(data), [data]);

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
        <h1 className="text-3xl font-bold tracking-tight">Olay Raporu</h1>
        <p className="mt-2 text-muted-foreground">
          Alanları doldur, alt kısımda foruma yapıştırabileceğin BBCode çıktısı oluşsun.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Section title="Rapor">
            <Field label="Rapor No." value={data.reportNo} onChange={(v) => set("reportNo", v)} placeholder="12345" />
            <div className="sm:col-span-2 rounded-lg border border-border bg-muted/30 p-3">
              <Label className="text-xs">Konu Başlığı</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input readOnly value={title} className="font-mono" />
                <Button variant="outline" size="icon" onClick={() => copy(title, "Konu başlığı")} aria-label="Konu başlığını kopyala">
                  <ClipboardCopy className="size-4" />
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Personel Bilgileri">
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
            <Field label="Tarih" value={data.date} onChange={(v) => set("date", v)} placeholder="GG/AA/YYYY" />
          </Section>

          <Section title="Olay Bilgileri">
            <Field
              label="Tarih ve Saat"
              value={data.incidentDate}
              onChange={(v) => set("incidentDate", v)}
              placeholder="26/01/2026 - 22.20"
            />
            <Field label="Konum" value={data.location} onChange={(v) => set("location", v)} />
            <SelectField
              label="Bölge"
              value={data.area}
              onChange={(v) => set("area", v)}
              options={areaOptions.map((a) => ({ label: a, value: a }))}
            />
            <div className="sm:col-span-2">
              <Label className="text-xs">Olay Türü</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {incidentTypeOptions.map((t) => (
                  <CheckItem
                    key={t}
                    label={t}
                    checked={data.incidentTypes.includes(t)}
                    onChange={() => toggle("incidentTypes", t)}
                  />
                ))}
              </div>
              {data.incidentTypes.includes("Diğer") ? (
                <Input
                  className="mt-3"
                  placeholder="Diğer olay türü"
                  value={data.otherType}
                  onChange={(e) => set("otherType", e.target.value)}
                />
              ) : null}
            </div>
          </Section>

          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Süreç</h2>
                  <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {data.process.length}/{processOptions.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Raporun mevcut işlem durumunu işaretleyin.</p>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <FileSearch className="size-4" />
              </div>
            </div>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full bg-primary transition-all duration-300",
                  processProgressClasses[data.process.length],
                )}
              />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {processOptions.map((p) => (
                <ProcessItem
                  key={p}
                  label={p}
                  icon={processIcons[p]}
                  checked={data.process.includes(p)}
                  onChange={() => toggle("process", p)}
                />
              ))}
            </div>
          </section>

          <section className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Detaylar — Mağdur / Tanık</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    people: [
                      ...d.people,
                      { id: `p${Date.now()}`, name: "", contact: "", address: "", status: "" },
                    ],
                  }))
                }
              >
                <Plus className="size-4" />
                Kişi ekle
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {data.people.map((p, i) => (
                <div key={p.id} className="rounded-lg border border-border/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Kişi {i + 1}</span>
                    {data.people.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Kişiyi sil"
                        onClick={() =>
                          setData((d) => ({ ...d, people: d.people.filter((x) => x.id !== p.id) }))
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Adı Soyadı" value={p.name} onChange={(v) => updatePerson(p.id, { name: v })} />
                    <Field label="İletişim Bilgisi" value={p.contact} onChange={(v) => updatePerson(p.id, { contact: v })} />
                    <Field label="Adresi" value={p.address} onChange={(v) => updatePerson(p.id, { address: v })} />
                    <div>
                      <Label className="text-xs">Statü</Label>
                      <div className="mt-2 flex gap-4">
                        <CheckItem
                          label="MAĞDUR"
                          checked={p.status === "victim"}
                          onChange={() =>
                            updatePerson(p.id, { status: p.status === "victim" ? "" : "victim" })
                          }
                        />
                        <CheckItem
                          label="TANIK"
                          checked={p.status === "witness"}
                          onChange={() =>
                            updatePerson(p.id, { status: p.status === "witness" ? "" : "witness" })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Section title="Açıklama" wide>
            <div className="sm:col-span-2">
              <Textarea
                rows={8}
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Olayın detaylı anlatımı..."
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
                          evidence: d.evidence.map((x) =>
                            x.id === e.id ? { ...x, label: ev.target.value } : x,
                          ),
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
                          evidence: d.evidence.map((x) =>
                            x.id === e.id ? { ...x, url: ev.target.value } : x,
                          ),
                        }))
                      }
                    />
                  </div>
                  {data.evidence.length > 1 ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Kanıtı sil"
                      onClick={() =>
                        setData((d) => ({ ...d, evidence: d.evidence.filter((x) => x.id !== e.id) }))
                      }
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
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => setOutput(buildIncidentBBCode(data))}>Raporu Oluştur</Button>
          {output ? (
            <>
              <Button variant="outline" onClick={() => copy(output, "BBCode")}>
                <ClipboardCopy className="size-4" />
                BBCode kopyala
              </Button>
              <Button variant="outline" onClick={() => copy(title, "Konu başlığı")}>
                <ClipboardCopy className="size-4" />
                Konu başlığı kopyala
              </Button>
            </>
          ) : null}
        </div>

        {output ? (
          <section className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">BBCode Çıktısı</h2>
            <p className="mt-1 text-sm text-muted-foreground">Konu başlığı: <span className="font-mono">{title}</span></p>
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

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  );
}

function ProcessItem({
  label,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string;
  icon: LucideIcon;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "group flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
        checked
          ? "border-primary/50 bg-primary/10 text-foreground"
          : "border-border/80 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-muted/50",
      )}
    >
      <Checkbox checked={checked} onCheckedChange={onChange} className="sr-only" />
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked
            ? "border-primary/40 bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground group-hover:text-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="flex-1 text-sm font-medium leading-tight">{label}</span>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent",
        )}
      >
        <BadgeCheck className="size-3" />
      </span>
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
