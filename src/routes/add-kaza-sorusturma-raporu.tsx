import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Car, ClipboardCopy, Plus, Trash2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { FormSection as Section, TextField as Field, DateField } from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildCollisionTitle,
  buildTrafficCollisionBBCode,
  emptyCollisionParty,
  emptyTrafficCollision,
  type CollisionParty,
  type TrafficCollisionData,
} from "@/lib/add-traffic-collision";

const title = "Kaza Soruşturma Raporu Birinci Sayfa";
const description = "TRAFFIC COLLISION REPORT — SAHP 555 Page 1 (Rev. 2-25) OPI 060";

export const Route = createFileRoute("/add-kaza-sorusturma-raporu")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "central_traffic_division" });
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

/** Seçilebilir kart görünümlü tekli seçim grubu. */
function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(active ? ("" as T) : o.value)}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                active
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border bg-background/60 text-muted-foreground hover:border-primary/30",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<TrafficCollisionData>(
    "add-kaza-sorusturma-raporu",
    emptyTrafficCollision,
  );
  const [output, setOutput] = useState("");
  const profile = useOfficerProfile();
  const autoFilled = useRef(false);

  useEffect(() => {
    if (autoFilled.current || !profile) return;
    if (!profile.name && !profile.serialNo) return;
    autoFilled.current = true;
    setData((d) => ({
      ...d,
      photographer: d.photographer || profile.name.trim().toUpperCase(),
      photographerSerial: d.photographerSerial || profile.serialNo,
      division: d.division || "CTD",
    }));
  }, [profile, setData]);

  const set = <K extends keyof TrafficCollisionData>(key: K, value: TrafficCollisionData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const setParty = <K extends keyof CollisionParty>(i: number, key: K, value: CollisionParty[K]) =>
    setData((d) => ({
      ...d,
      parties: d.parties.map((p, pi) => (pi === i ? { ...p, [key]: value } : p)),
    }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const formTitle = buildCollisionTitle(data);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/central-traffic-division">
              <ArrowLeft className="size-3.5" />
              Central Traffic Division
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <Car className="size-5" />
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
          <Section title="Başlık" wide hint="TC — 26-000">
            <Field
              label="Rapor No."
              value={data.titleNo}
              onChange={(v) => set("titleNo", v)}
              placeholder="000"
            />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                {formTitle}
              </code>
              <Button variant="outline" size="sm" className="press" onClick={() => copy(formTitle, "Başlık")}>
                <ClipboardCopy className="size-3.5" />
                Başlığı Kopyala
              </Button>
            </div>
          </Section>

          <Section title="Olay Bilgileri" wide>
            <Field
              label="Konum Bilgisi"
              value={data.location}
              onChange={(v) => set("location", v)}
              placeholder="CADDE / BÖLGE"
            />
            <DateField label="Tarih" value={data.date} onChange={(v) => set("date", v)} />
            <Field
              label="Saat (2400)"
              value={data.time}
              onChange={(v) => set("time", v)}
              placeholder="1830"
            />
            <Field
              label="Olay Raporu No."
              value={data.incidentReportNo}
              onChange={(v) => set("incidentReportNo", v)}
              placeholder="00000"
            />
          </Section>

          <Section title="İdari Bilgiler" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    photographer: p.name.trim().toUpperCase(),
                    photographerSerial: p.serialNo,
                    division: "CTD",
                  }))
                }
              />
            </div>
            <Field
              label="Fotoğraflayan"
              value={data.photographer}
              onChange={(v) => set("photographer", v)}
              placeholder="JOHN DOE"
            />
            <Field
              label="Seri No."
              value={data.photographerSerial}
              onChange={(v) => set("photographerSerial", v)}
              placeholder="00000"
            />
            <Field
              label="Division"
              value={data.division}
              onChange={(v) => set("division", v)}
              placeholder="CTD"
            />
            <Field
              label="Rapor No."
              value={data.reportNo}
              onChange={(v) => set("reportNo", v)}
              placeholder="26-000"
            />
          </Section>

          {data.parties.map((p, i) => (
            <Section key={i} title={`${i + 1}. Parti Bilgileri`} wide>
              <div className="sm:col-span-2 space-y-4 rounded-xl border border-border/70 bg-background/40 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Adı Soyadı"
                    value={p.name}
                    onChange={(v) => setParty(i, "name", v)}
                    placeholder="AD SOYAD"
                  />
                  <Field
                    label="Yaş"
                    value={p.age}
                    onChange={(v) => setParty(i, "age", v)}
                    placeholder="00"
                  />
                  <OptionGroup
                    label="Cinsiyeti"
                    value={p.gender}
                    onChange={(v) => setParty(i, "gender", v)}
                    options={[
                      { value: "male", label: "Erkek" },
                      { value: "female", label: "Kadın" },
                    ]}
                  />
                  <OptionGroup
                    label="Sürücü Lisansı"
                    value={p.license}
                    onChange={(v) => setParty(i, "license", v)}
                    options={[
                      { value: "var", label: "Var" },
                      { value: "yok", label: "Yok" },
                    ]}
                  />
                  <Field
                    label="İletişim Bilgisi"
                    value={p.contact}
                    onChange={(v) => setParty(i, "contact", v)}
                    placeholder="000-0000"
                  />
                  <Field
                    label="Adresi"
                    value={p.address}
                    onChange={(v) => setParty(i, "address", v)}
                    placeholder="ADRES"
                  />
                  <Field
                    label="Araç Modeli"
                    value={p.vehicleModel}
                    onChange={(v) => setParty(i, "vehicleModel", v)}
                  />
                  <Field
                    label="Renk"
                    value={p.vehicleColor}
                    onChange={(v) => setParty(i, "vehicleColor", v)}
                  />
                  <Field label="Plaka" value={p.plate} onChange={(v) => setParty(i, "plate", v)} />
                  <Field
                    label="Araç Sahibi"
                    value={p.vehicleOwner}
                    onChange={(v) => setParty(i, "vehicleOwner", v)}
                  />
                  <div className="sm:col-span-2">
                    <OptionGroup
                      label="Araç Hasarı"
                      value={p.damage}
                      onChange={(v) => setParty(i, "damage", v)}
                      options={[
                        { value: "buyuk", label: "BÜYÜK" },
                        { value: "kucuk", label: "KÜÇÜK" },
                        { value: "diger", label: "DİĞER" },
                        { value: "yok", label: "YOK" },
                      ]}
                    />
                  </div>
                </div>
                {data.parties.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setData((d) => ({ ...d, parties: d.parties.filter((_, pi) => pi !== i) }))
                    }
                  >
                    <Trash2 className="size-4" />
                    Partiyi Sil
                  </Button>
                ) : null}
              </div>
            </Section>
          ))}

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setData((d) => ({ ...d, parties: [...d.parties, emptyCollisionParty()] }))
              }
            >
              <Plus className="size-4" />
              Parti Ekle
            </Button>
          </div>

          <Section title="Kısa Açıklama & Kanıtlar" wide>
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Kaza Özeti
              </Label>
              <Textarea
                rows={4}
                className="bg-background/60"
                value={data.summary}
                onChange={(e) => set("summary", e.target.value)}
                placeholder="Kazanın kısa özeti"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Parti
              </Label>
              <Textarea
                rows={3}
                className="bg-background/60"
                value={data.summaryParties}
                onChange={(e) => set("summaryParties", e.target.value)}
                placeholder="Kazaya karışan partiler"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Hasarlar
              </Label>
              <Textarea
                rows={3}
                className="bg-background/60"
                value={data.summaryDamages}
                onChange={(e) => set("summaryDamages", e.target.value)}
                placeholder="Meydana gelen hasarlar"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Yaralanmalar
              </Label>
              <Textarea
                rows={3}
                className="bg-background/60"
                value={data.summaryInjuries}
                onChange={(e) => set("summaryInjuries", e.target.value)}
                placeholder="Yaralanma durumu"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Kanıtlar
              </Label>
              <div className="space-y-2">
                {data.evidence.map((e, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <Input
                      className="h-10 min-w-[10rem] flex-1 bg-background/60"
                      value={e.label}
                      placeholder="KANIT BAŞLIĞI"
                      onChange={(ev) =>
                        setData((d) => ({
                          ...d,
                          evidence: d.evidence.map((x, xi) =>
                            xi === i ? { ...x, label: ev.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Input
                      className="h-10 min-w-[12rem] flex-1 bg-background/60"
                      value={e.url}
                      placeholder="KANIT İÇERİĞİ"
                      onChange={(ev) =>
                        setData((d) => ({
                          ...d,
                          evidence: d.evidence.map((x, xi) =>
                            xi === i ? { ...x, url: ev.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Kanıtı sil"
                      onClick={() =>
                        setData((d) => {
                          const next = d.evidence.filter((_, xi) => xi !== i);
                          return { ...d, evidence: next.length ? next : [{ label: "", url: "" }] };
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setData((d) => ({ ...d, evidence: [...d.evidence, { label: "", url: "" }] }))
                  }
                >
                  <Plus className="size-4" />
                  Kanıt Ekle
                </Button>
              </div>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildTrafficCollisionBBCode(data))}>
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
