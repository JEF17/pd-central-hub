import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, FilePlus2, Plus, Trash2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { FormSection as Section, TextField as Field, DateField } from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { divisionCode } from "@/lib/officer-profile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildUseOfForceSupplementalBBCode,
  emptyUofsEvidence,
  emptyUseOfForceSupplemental,
  type UseOfForceSupplementalData,
  type UofsEvidence,
} from "@/lib/add-use-of-force-supplemental";

const title = "Kategorik Güç Kullanımı Tamamlayıcı Raporu";
const description = "Kategorik güç kullanımı tamamlayıcı raporu (Form 06.11.34).";

export const Route = createFileRoute("/add-kategorik-guc-kullanimi-tamamlayici-raporu")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href);
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
  const [data, setData, clearDraft, savedAt] = useFormDraft<UseOfForceSupplementalData>(
    "add-kategorik-guc-kullanimi-tamamlayici-raporu",
    emptyUseOfForceSupplemental,
  );
  const [output, setOutput] = useState("");
  const profile = useOfficerProfile();
  const autoFilled = useRef(false);

  useEffect(() => {
    if (autoFilled.current || !profile) return;
    if (!profile.name && !profile.serialNo && !profile.division) return;
    autoFilled.current = true;
    setData((d) => ({
      ...d,
      officerName: d.officerName || profile.name.toUpperCase(),
      officerSerial: d.officerSerial || profile.serialNo,
      officerPosition: d.officerPosition || profile.rank.toUpperCase(),
      officerDivision: d.officerDivision || divisionCode(profile.division),
    }));
  }, [profile, setData]);

  const set = <K extends keyof UseOfForceSupplementalData>(key: K, value: UseOfForceSupplementalData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const evidences = data.evidences?.length ? data.evidences : [emptyUofsEvidence()];

  const updateEvidence = (index: number, patch: Partial<UofsEvidence>) =>
    setData((d) => {
      const list = d.evidences?.length ? [...d.evidences] : [emptyUofsEvidence()];
      const current = list[index] ?? emptyUofsEvidence();
      list[index] = typeof current === "string" ? { label: current, url: "" } : { ...current, ...patch };
      return { ...d, evidences: list };
    });

  const addEvidence = () =>
    setData((d) => ({ ...d, evidences: [...(d.evidences ?? []), emptyUofsEvidence()] }));

  const removeEvidence = (index: number) =>
    setData((d) => {
      const list = (d.evidences ?? []).filter((_, i) => i !== index);
      return { ...d, evidences: list.length ? list : [emptyUofsEvidence()] };
    });

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/guc-kullanim-raporlari">
              <ArrowLeft className="size-3.5" />
              Güç Kullanım Raporları
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <FilePlus2 className="size-5" />
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
          <Section title="Personel Bilgisi" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    officerName: p.name,
                    officerSerial: p.serialNo,
                    officerPosition: p.rank,
                    officerDivision: divisionCode(p.division),
                  }))
                }
              />
            </div>
            <Field
              label="Adı Soyadı"
              value={data.officerName}
              onChange={(v) => set("officerName", v)}
            />
            <Field
              label="Seri No."
              value={data.officerSerial}
              onChange={(v) => set("officerSerial", v)}
            />
            <Field
              label="Pozisyon"
              value={data.officerPosition}
              onChange={(v) => set("officerPosition", v)}
              placeholder="PO 2"
            />
            <Field
              label="Division"
              value={data.officerDivision}
              onChange={(v) => set("officerDivision", v)}
              placeholder="MISN"
            />
            <Field
              label="Görevlendirme"
              value={data.officerAssignment}
              onChange={(v) => set("officerAssignment", v)}
              placeholder="A"
            />
            <DateField
              label="Tarih"
              value={data.reportDate}
              onChange={(v) => set("reportDate", v)}
            />
          </Section>

          <Section title="Açıklama" wide>
            <DateField
              label="Olay Tarihi ve Saati"
              value={data.incidentDateTime}
              onChange={(v) => set("incidentDateTime", v)}
              withTime
            />
            <Field
              label="Olay Bölgesi"
              value={data.location}
              onChange={(v) => set("location", v)}
              placeholder="East Vinewood"
            />
            <div className="sm:col-span-2 grid gap-2">
              <Label>Personel İfadesi</Label>
              <Textarea
                value={data.statement}
                onChange={(e) => set("statement", e.target.value)}
                rows={8}
                placeholder="En fazla 150 kelime olacak şekilde olayı birincil ağızdan aktarın."
              />
            </div>
          </Section>

          <Section title="Kanıtlar" wide hint={`${evidences.length} kanıt`}>
            <div className="sm:col-span-2 space-y-4">
              {evidences.map((evidence, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background/40 p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                      Kanıt {i + 1}
                    </span>
                    {evidences.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8 px-2 text-xs text-destructive hover:text-destructive"
                        onClick={() => removeEvidence(i)}
                      >
                        <Trash2 className="size-3.5" />
                        Kaldır
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Görünecek Ad"
                      value={evidence.label}
                      onChange={(v) => updateEvidence(i, { label: v })}
                      placeholder="Bodycam görüntüsü"
                    />
                    <Field
                      label="Bağlantı (URL)"
                      value={evidence.url}
                      onChange={(v) => updateEvidence(i, { url: v })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="press" onClick={addEvidence}>
                <Plus className="size-4" />
                Kanıt Ekle
              </Button>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildUseOfForceSupplementalBBCode(data))}>
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
