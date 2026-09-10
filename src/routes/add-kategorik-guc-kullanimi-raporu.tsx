import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Plus, ShieldAlert, Trash2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { FormSection as Section, TextField as Field, DateField } from "@/components/report-ui";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { DraftBar } from "@/components/DraftBar";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { divisionCode } from "@/lib/officer-profile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildUseOfForceBBCode,
  buildUseOfForceTitle,
  emptyUofOfficer,
  emptyUseOfForce,
  type UseOfForceData,
  type UofOfficer,
} from "@/lib/add-use-of-force";

const title = "Kategorik Güç Kullanımı Raporu";
const description = "Kategorik güç kullanımı raporu (Form 06.11.33).";

export const Route = createFileRoute("/add-kategorik-guc-kullanimi-raporu")({
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
  const [data, setData, clearDraft, savedAt] = useFormDraft<UseOfForceData>(
    "add-kategorik-guc-kullanimi-raporu",
    emptyUseOfForce,
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
      commanderName: d.commanderName || profile.name.toUpperCase(),
      commanderSerial: d.commanderSerial || profile.serialNo,
      commanderPosition: d.commanderPosition || profile.rank.toUpperCase(),
      commanderDivision: d.commanderDivision || divisionCode(profile.division),
    }));
  }, [profile, setData]);

  const set = <K extends keyof UseOfForceData>(key: K, value: UseOfForceData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const officers = data.officers?.length ? data.officers : [emptyUofOfficer()];

  const updateOfficer = (index: number, patch: Partial<UofOfficer>) =>
    setData((d) => {
      const list = d.officers?.length ? [...d.officers] : [emptyUofOfficer()];
      list[index] = { ...(list[index] ?? emptyUofOfficer()), ...patch };
      return { ...d, officers: list };
    });

  const addOfficer = () =>
    setData((d) => ({ ...d, officers: [...(d.officers ?? []), emptyUofOfficer()] }));

  const removeOfficer = (index: number) =>
    setData((d) => {
      const list = (d.officers ?? []).filter((_, i) => i !== index);
      return { ...d, officers: list.length ? list : [emptyUofOfficer()] };
    });

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const formTitle = buildUseOfForceTitle(data);

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
              <ShieldAlert className="size-5" />
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
          <Section title="Konu Başlığı" wide>
            <Field
              label="Rapor No."
              value={data.reportNo}
              onChange={(v) => set("reportNo", v)}
              placeholder="000"
            />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <span className="font-mono text-sm">{formTitle}</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="ml-auto press"
                onClick={() => copy(formTitle, "Başlık")}
              >
                <ClipboardCopy className="size-4" />
                Başlığı Kopyala
              </Button>
            </div>
          </Section>

          <Section title="Incident Commander Bilgisi" wide hint="Olay bölgesinde bulunan sorumlu supervisor">
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    commanderName: p.name,
                    commanderSerial: p.serialNo,
                    commanderPosition: p.rank,
                    commanderDivision: p.division,
                  }))
                }
              />
            </div>
            <Field
              label="Adı Soyadı"
              value={data.commanderName}
              onChange={(v) => set("commanderName", v)}
            />
            <Field
              label="Seri No."
              value={data.commanderSerial}
              onChange={(v) => set("commanderSerial", v)}
            />
            <Field
              label="Pozisyon"
              value={data.commanderPosition}
              onChange={(v) => set("commanderPosition", v)}
              placeholder="SGT I"
            />
            <Field
              label="Division"
              value={data.commanderDivision}
              onChange={(v) => set("commanderDivision", v)}
              placeholder="MISN"
            />
            <Field
              label="Görevlendirme"
              value={data.commanderAssignment}
              onChange={(v) => set("commanderAssignment", v)}
            />
          </Section>

          <Section title="Dahil Olan Personel Bilgisi" wide hint={`${officers.length} personel`}>
            <div className="sm:col-span-2 space-y-4">
              {officers.map((officer, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background/40 p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                      Personel {i + 1}
                    </span>
                    {officers.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8 px-2 text-xs text-destructive hover:text-destructive"
                        onClick={() => removeOfficer(i)}
                      >
                        <Trash2 className="size-3.5" />
                        Kaldır
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="Rütbe ve Ad Soyad"
                        value={officer.name}
                        onChange={(v) => updateOfficer(i, { name: v })}
                        placeholder="Sergeant I John Doe"
                      />
                    </div>
                    <Field
                      label="Seri No."
                      value={officer.serial}
                      onChange={(v) => updateOfficer(i, { serial: v })}
                      placeholder="30000"
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="press" onClick={addOfficer}>
                <Plus className="size-4" />
                Personel Ekle
              </Button>
            </div>
          </Section>

          <Section title="Adres ve Tarih Bilgisi" wide>
            <div className="sm:col-span-2">
              <Field
                label="Adres Bilgisi"
                value={data.address}
                onChange={(v) => set("address", v)}
              />
            </div>
            <DateField
              label="Tarih Bilgisi"
              value={data.incidentDateTime}
              onChange={(v) => set("incidentDateTime", v)}
              withTime
            />
          </Section>

          <Section title="Şüpheli Bilgisi" wide>
            <Field
              label="Adı Soyadı"
              value={data.suspectName}
              onChange={(v) => set("suspectName", v)}
            />
            <Field
              label="Cinsiyeti"
              value={data.suspectGender}
              onChange={(v) => set("suspectGender", v)}
            />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildUseOfForceBBCode(data))}>
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
            <p className="mt-1 text-sm text-muted-foreground">Konu başlığı: {formTitle}</p>
            <Textarea readOnly value={output} rows={24} className="mt-4 font-mono text-xs" />
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
