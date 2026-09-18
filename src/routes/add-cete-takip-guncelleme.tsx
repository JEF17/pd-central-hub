import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, FileSearch, Plus, Trash2, TriangleAlert } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { DraftBar } from "@/components/DraftBar";
import { ProfileFillButton } from "@/components/ProfileFillButton";
import { FormSection as Section, TextField as Field } from "@/components/report-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormDraft } from "@/hooks/use-form-draft";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import {
  buildGangUpdateBBCode,
  emptyGangUpdate,
  type GangUpdateData,
} from "@/lib/add-gang-investigation-update";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";

const title = "Çete Soruşturma Dosyası Takip ve Durum Güncelleme Formu";
const description = "Çete soruşturma dosyası takip ve durum güncellemesi şablonu";

export const Route = createFileRoute("/add-cete-takip-guncelleme")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "ged_git" });
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
  const [data, setData, clearDraft, savedAt] = useFormDraft<GangUpdateData>(
    "add-cete-takip-guncelleme",
    emptyGangUpdate,
  );
  const [output, setOutput] = useState("");
  const profile = useOfficerProfile();
  const autoFilled = useRef(false);

  useEffect(() => {
    if (autoFilled.current || !profile || (!profile.name && !profile.serialNo)) return;
    autoFilled.current = true;
    setData((current) => ({
      ...current,
      officerName: current.officerName || profile.name.trim().toUpperCase(),
      email: current.email || (profile.serialNo ? `${profile.serialNo}@lspd.online` : ""),
    }));
  }, [profile, setData]);

  const set = <K extends keyof GangUpdateData>(key: K, value: GangUpdateData[K]) =>
    setData((current) => ({ ...current, [key]: value }));

  const updateEvidence = (index: number, value: string) =>
    set("evidences", data.evidences.map((item, itemIndex) => (itemIndex === index ? value : item)));

  const removeEvidence = (index: number) => {
    const next = data.evidences.filter((_, itemIndex) => itemIndex !== index);
    set("evidences", next.length ? next : [""]);
  };

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };


  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-4 py-5 shadow-sm sm:px-6 sm:py-6">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/gang-enforcement-detail">
              <ArrowLeft className="size-3.5" />
              GED / GIT
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <FileSearch className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </header>

        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <TriangleAlert className="size-4" />
            DİKKAT
          </p>
          <p className="mt-2 text-sm text-foreground/90">
            Oluşturulan Çete Soruşturma Dosyası Formları için gerçekleştirilen takip ve durum
            güncellemesi metinleri, aşağıdaki formata uygun bir şekilde hazırlanmak zorundadır.
            Çete Soruşturması yürüten tüm personelin durum güncellemesi yapması zorunludur.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            (( Doldurduğunuz takip ve durum güncellemesi metinlerini çete soruşturması dosyasına ait
            konu altından paylaşmanız gerekiyor. ))
          </p>
        </div>

        <DraftBar
          savedAt={savedAt}
          onClear={() => {
            clearDraft();
            setOutput("");
            notify.success("Şablon temizlendi");
          }}
        />

        <div className="mt-8 grid gap-6">
          <Section title="Güncelleme Bilgileri" wide>
            <Field label="Çete İsmi" value={data.gangName} onChange={(value) => set("gangName", value)} placeholder="ÇETE İSMİ" />
            <Field label="ÇSD No." value={data.csdNo} onChange={(value) => set("csdNo", value)} placeholder="000" />
            <div className="sm:col-span-2 grid gap-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Arka Plan</Label>
              <Textarea rows={5} value={data.background} onChange={(event) => set("background", event.target.value)} placeholder="Olayla nasıl karşılaştığınız, hangi tarihte ve varsa kiminle birlikte karşılaştığınıza yer verilmeli." />
            </div>
            <div className="sm:col-span-2 grid gap-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Detaylar</Label>
              <Textarea rows={8} value={data.details} onChange={(event) => set("details", event.target.value)} placeholder="Olay baştan sona anlatılmalı." />
            </div>
          </Section>

          <Section title="Kanıtlar" wide hint={`${data.evidences.length} kayıt`}>
            <div className="sm:col-span-2 space-y-2">
              {data.evidences.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={item} onChange={(event) => updateEvidence(index, event.target.value)} placeholder={`Kanıt ${index + 1}`} />
                  <Button type="button" variant="ghost" size="icon" aria-label="Kanıtı sil" onClick={() => removeEvidence(index)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => set("evidences", [...data.evidences, ""])}>
                <Plus className="size-4" /> Kanıt Ekle
              </Button>
            </div>
          </Section>

          <Section title="İmza Bilgileri" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton onFill={(values) => setData((current) => ({ ...current, officerName: values.name }))} />
            </div>
            <Field label="Adı Soyadı" value={data.officerName} onChange={(value) => set("officerName", value)} />
            <Field label="Rütbe" value={data.officerRank} onChange={(value) => set("officerRank", value)} placeholder="Police Officer II" />
            <Field label="Telefon" value={data.phone} onChange={(value) => set("phone", value)} placeholder="(000) 00-000" />
            <Field label="E-Posta" value={data.email} onChange={(value) => set("email", value)} placeholder="00000@lspd.online" />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildGangUpdateBBCode(data))}>Raporu Oluştur</Button>
          {output ? <Button variant="outline" className="press" onClick={() => copy(output, "BBCode")}><ClipboardCopy className="size-4" /> Kopyala</Button> : null}
        </div>

        {output ? (
          <section className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="text-lg font-semibold">Çıktı</h2>
            <p className="mt-1 text-sm text-muted-foreground">BBCode çıktısı</p>

            <Textarea readOnly value={output} rows={24} className="mt-4 font-mono text-xs" />
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
