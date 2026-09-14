import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Plus, Shield, Trash2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  buildK9DeploymentBBCode,
  emptyK9Deployment,
  emptyK9Suspect,
  type K9DeploymentData,
  type K9Suspect,
} from "@/lib/add-k9-deployment";

const title = "K-9 Deployment Report";
const description = "K9 DEPLOYMENT REPORT — METRO K9 UNIT";

const yesNo = ["EVET", "HAYIR"];

export const Route = createFileRoute("/add-k9-deployment-raporu")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "metropolitan_division" });
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
  const [data, setData, clearDraft, savedAt] = useFormDraft<K9DeploymentData>(
    "add-k9-deployment-raporu",
    emptyK9Deployment,
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
      handlerName: d.handlerName || profile.name.trim().toUpperCase(),
      handlerSerialNo: d.handlerSerialNo || profile.serialNo,
      handlerPosition: d.handlerPosition || profile.rank.trim().toUpperCase(),
    }));
  }, [profile, setData]);

  const set = <K extends keyof K9DeploymentData>(key: K, value: K9DeploymentData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updateSuspect = (i: number, patch: Partial<K9Suspect>) =>
    set(
      "suspects",
      data.suspects.map((x, xi) => (xi === i ? { ...x, ...patch } : x)),
    );

  const updateEvidence = (i: number, value: string) =>
    set(
      "evidence",
      data.evidence.map((x, xi) => (xi === i ? value : x)),
    );

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  const formTitle = `K9 Deployment Report — ${data.titleDate.trim() || "00/00/0000"} — ${data.titleNo.trim() || "0000"}`;

  const yesNoField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
  ) => (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full bg-background/60">
          <SelectValue placeholder="Seçin" />
        </SelectTrigger>
        <SelectContent>
          {yesNo.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/metropolitan-division">
              <ArrowLeft className="size-3.5" />
              Metropolitan Division
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <Shield className="size-5" />
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
          <Section title="Başlık" wide hint="K9 Deployment Report — 00/00/0000 — 0000">
            <DateField
              label="Tarih"
              value={data.titleDate}
              onChange={(v) => set("titleDate", v)}
            />
            <Field
              label="Rapor No."
              value={data.titleNo}
              onChange={(v) => set("titleNo", v)}
              placeholder="0000"
            />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                {formTitle}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="press"
                onClick={() => copy(formTitle, "Başlık")}
              >
                <ClipboardCopy className="size-3.5" />
                Başlığı Kopyala
              </Button>
            </div>
          </Section>

          <Section title="Deployment Bilgileri" wide>
            <DateField label="Tarih" value={data.date} onChange={(v) => set("date", v)} />
            <Field
              label="Division"
              value={data.division}
              onChange={(v) => set("division", v)}
              placeholder="METRO"
            />
            {yesNoField("K-9 Teması", data.k9Contact, (v) => set("k9Contact", v))}
            <Field
              label="K9RI#"
              value={data.k9riNo}
              onChange={(v) => set("k9riNo", v)}
              placeholder="—"
            />
            <Field
              label="Deployment No."
              value={data.deploymentNo}
              onChange={(v) => set("deploymentNo", v)}
              placeholder="—"
            />
            <Field
              label="Türü (Suç, Kayıp, Delil, vb.)"
              value={data.deploymentType}
              onChange={(v) => set("deploymentType", v)}
              placeholder="Suç"
            />
            <Field
              label="Adres"
              value={data.address}
              onChange={(v) => set("address", v)}
              placeholder="—"
            />
            {yesNoField("Bilinen Çete Üyesi", data.knownGangMember, (v) =>
              set("knownGangMember", v),
            )}
            <Field
              label="Çete Adı"
              value={data.gangName}
              onChange={(v) => set("gangName", v)}
              placeholder="—"
            />
          </Section>

          <Section title="Personel Bilgisi" wide>
            <Field
              label="Incident Commander"
              value={data.incidentCommander}
              onChange={(v) => set("incidentCommander", v)}
              placeholder="ADI SOYADI"
            />
            <Field
              label="Seri No."
              value={data.icSerialNo}
              onChange={(v) => set("icSerialNo", v)}
              placeholder="00000"
            />
            <Field
              label="Pozisyon"
              value={data.icPosition}
              onChange={(v) => set("icPosition", v)}
              placeholder="—"
            />
            <Field
              label="K-9 Supervisor"
              value={data.k9Supervisor}
              onChange={(v) => set("k9Supervisor", v)}
              placeholder="ADI SOYADI"
            />
            <Field
              label="Seri No."
              value={data.supSerialNo}
              onChange={(v) => set("supSerialNo", v)}
              placeholder="00000"
            />
            <Field
              label="Pozisyon"
              value={data.supPosition}
              onChange={(v) => set("supPosition", v)}
              placeholder="—"
            />
            {yesNoField("At Scene", data.atScene, (v) => set("atScene", v))}
          </Section>

          <Section title="Arama / Şüpheli Bilgisi — K-9 Personeli" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    handlerName: p.name.trim().toUpperCase(),
                    handlerSerialNo: p.serialNo,
                    handlerPosition: p.rank.trim().toUpperCase(),
                  }))
                }
              />
            </div>
            <Field
              label="Personel Adı Soyadı"
              value={data.handlerName}
              onChange={(v) => set("handlerName", v)}
              placeholder="JOHN DOE"
            />
            <Field
              label="Seri No"
              value={data.handlerSerialNo}
              onChange={(v) => set("handlerSerialNo", v)}
              placeholder="00000"
            />
            <Field
              label="Pozisyon"
              value={data.handlerPosition}
              onChange={(v) => set("handlerPosition", v)}
              placeholder="POLICE OFFICER III"
            />
            <Field
              label="Division"
              value={data.handlerDivision}
              onChange={(v) => set("handlerDivision", v)}
              placeholder="METRO"
            />
            <Field
              label="Köpek"
              value={data.dog}
              onChange={(v) => set("dog", v)}
              placeholder="—"
            />
            <Field
              label="Köpek Seri No"
              value={data.dogSerialNo}
              onChange={(v) => set("dogSerialNo", v)}
              placeholder="—"
            />
          </Section>

          <Section title="Şüpheliler" wide hint="Birden fazla şüpheli ekleyebilirsiniz.">
            <div className="sm:col-span-2 space-y-3">
              {data.suspects.map((s, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-xl border border-border/70 bg-background/40 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Şüpheli {i + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Şüpheliyi sil"
                      onClick={() => {
                        const next = data.suspects.filter((_, xi) => xi !== i);
                        set("suspects", next.length ? next : [emptyK9Suspect()]);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Şüpheli Bilgisi"
                      value={s.name}
                      onChange={(v) => updateSuspect(i, { name: v })}
                      placeholder="ADI SOYADI"
                    />
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Cinsiyeti
                      </Label>
                      <Select value={s.gender} onValueChange={(v) => updateSuspect(i, { gender: v })}>
                        <SelectTrigger className="h-10 w-full bg-background/60">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {["ERKEK", "KADIN"].map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {yesNoField("K-9 Yaralaması", s.k9Injury, (v) => updateSuspect(i, { k9Injury: v }))}
                    {yesNoField("K-9 Teması", s.k9Contact, (v) => updateSuspect(i, { k9Contact: v }))}
                    <Field
                      label="Suçlama"
                      value={s.charge}
                      onChange={(v) => updateSuspect(i, { charge: v })}
                      placeholder="—"
                    />
                    {yesNoField("Silah", s.weapon, (v) => updateSuspect(i, { weapon: v }))}
                    <Field
                      label="Türü"
                      value={s.type}
                      onChange={(v) => updateSuspect(i, { type: v })}
                      placeholder="—"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set("suspects", [...data.suspects, emptyK9Suspect()])}
              >
                <Plus className="size-4" />
                Şüpheli Ekle
              </Button>
            </div>
          </Section>

          <Section title="Detaylar" wide>
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Detaylar
              </Label>
              <Textarea
                rows={8}
                className="bg-background/60"
                value={data.details}
                placeholder="Olay detayları"
                onChange={(e) => set("details", e.target.value)}
              />
            </div>
          </Section>

          <Section title="Kanıtlar" wide hint="Kanıt bağlantıları ekleyin.">
            <div className="sm:col-span-2 space-y-2">
              {data.evidence.map((e, i) => (
                <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <Input
                    className="h-10 bg-background/60"
                    value={e}
                    placeholder="https://..."
                    onChange={(ev) => updateEvidence(i, ev.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Kanıtı sil"
                    onClick={() => {
                      const next = data.evidence.filter((_, xi) => xi !== i);
                      set("evidence", next.length ? next : [""]);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set("evidence", [...data.evidence, ""])}
              >
                <Plus className="size-4" />
                Kanıt Ekle
              </Button>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildK9DeploymentBBCode(data))}>
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
