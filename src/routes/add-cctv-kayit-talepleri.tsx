import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Plus, Trash2, Video } from "lucide-react";

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
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import { buildCctvBBCode, emptyCctv, type CctvData } from "@/lib/add-cctv";

const title = "CCTV Kayıt Talepleri";
const description =
  "Kamera kayıtlarına erişim talebi formu — BBCode çıktısı otomatik oluşur.";

export const Route = createFileRoute("/add-cctv-kayit-talepleri")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "area_detective_division" });
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
  const [data, setData, clearDraft, savedAt] = useFormDraft<CctvData>(
    "add-cctv-kayit-talepleri",
    emptyCctv,
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
      officerName: d.officerName || `${profile.rank} ${profile.name}`.trim().toUpperCase(),
      officerSerial: d.officerSerial || profile.serialNo,
    }));
  }, [profile, setData]);

  const set = <K extends keyof CctvData>(key: K, value: CctvData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
            <Link to="/area-detective-division">
              <ArrowLeft className="size-3.5" />
              Area Detective Division
            </Link>
          </Button>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <Video className="size-5" />
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
          <Section title="Personel Bilgileri" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) =>
                  setData((d) => ({
                    ...d,
                    officerName: `${p.rank} ${p.name}`.trim(),
                    officerSerial: p.serialNo,
                  }))
                }
              />
            </div>
            <Field
              label="Pozisyon Adı Soyadı"
              value={data.officerName}
              onChange={(v) => set("officerName", v)}
              placeholder="POZİSYON ADI SOYADI"
            />
            <Field
              label="Seri No."
              value={data.officerSerial}
              onChange={(v) => set("officerSerial", v)}
              placeholder="SERİ NO"
            />
          </Section>

          <Section
            title="Rapor Bağlantıları"
            wide
            hint="Talebin dayandığı raporların forum bağlantıları"
          >
            <Field
              label="Olay Raporu"
              value={data.incidentReportLink}
              onChange={(v) => set("incidentReportLink", v)}
              placeholder="https://..."
            />
            <Field
              label="Takip Soruşturması Raporu"
              value={data.followupReportLink}
              onChange={(v) => set("followupReportLink", v)}
              placeholder="https://..."
            />
            <Field
              label="Tutuklama Raporu (Varsa)"
              value={data.arrestReportLink}
              onChange={(v) => set("arrestReportLink", v)}
              placeholder="https://..."
            />
          </Section>

          <Section title="CCTV Talep Bilgileri" wide>
            <DateField
              label="Tarih"
              value={data.requestDate}
              onChange={(v) => set("requestDate", v)}
            />
            <Field
              label="Saat Aralığı"
              value={data.timeRange}
              onChange={(v) => set("timeRange", v)}
              placeholder="SS:DD - SS:DD"
            />
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Talep Edilen Kameralar
              </Label>
              <div className="space-y-2">
                {data.cameras.map((cam, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      className="h-10 bg-background/60"
                      value={cam}
                      placeholder={`Kamera ${i + 1}`}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          cameras: d.cameras.map((c, ci) => (ci === i ? e.target.value : c)),
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Kamerayı sil"
                      onClick={() =>
                        setData((d) => {
                          const next = d.cameras.filter((_, ci) => ci !== i);
                          return { ...d, cameras: next.length ? next : [""] };
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
                  onClick={() => setData((d) => ({ ...d, cameras: [...d.cameras, ""] }))}
                >
                  <Plus className="size-4" />
                  Kamera Ekle
                </Button>
              </div>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="press" onClick={() => setOutput(buildCctvBBCode(data))}>
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
