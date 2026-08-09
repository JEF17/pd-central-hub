import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  buildIncidentBBCode,
  buildIncidentTitle,
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
            <Field label="Division" value={data.division} onChange={(v) => set("division", v)} placeholder="MISN" />
            <Field label="Görevlendirme" value={data.assignment} onChange={(v) => set("assignment", v)} />
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
            <Field label="Bölge" value={data.area} onChange={(v) => set("area", v)} />
            <div className="sm:col-span-2">
              <Label className="text-xs">Olay Türü</Label>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
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

          <Section title="Süreç">
            <div className="sm:col-span-2 flex flex-col gap-2">
              {processOptions.map((p) => (
                <CheckItem
                  key={p}
                  label={p}
                  checked={data.process.includes(p)}
                  onChange={() => toggle("process", p)}
                />
              ))}
            </div>
          </Section>

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
            <div className="sm:col-span-2 space-y-2">
              {data.evidence.map((e, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={e}
                    placeholder={`Kanıt ${i + 1}`}
                    onChange={(ev) =>
                      setData((d) => ({
                        ...d,
                        evidence: d.evidence.map((x, xi) => (xi === i ? ev.target.value : x)),
                      }))
                    }
                  />
                  {data.evidence.length > 1 ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Kanıtı sil"
                      onClick={() =>
                        setData((d) => ({ ...d, evidence: d.evidence.filter((_, xi) => xi !== i) }))
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setData((d) => ({ ...d, evidence: [...d.evidence, ""] }))}
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
