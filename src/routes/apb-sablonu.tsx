import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy, Megaphone, } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { buildApbBBCode, emptyApb, type ApbData } from "@/lib/apb-template";

export const Route = createFileRoute("/apb-sablonu")({
  head: () => ({
    meta: [
      { title: "APB Şablonu Oluşturucu — LSPD Portal" },
      {
        name: "description",
        content:
          "LSPD APB (All Points Bulletin) duyurusunu doldur, foruma hazır BBCode çıktısı oluştur.",
      },
      { property: "og:title", content: "APB Şablonu Oluşturucu — LSPD Portal" },
      {
        property: "og:description",
        content: "Formu doldur, tek tıkla BBCode APB duyurusu al.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData, clearDraft, savedAt] = useFormDraft<ApbData>("apb-sablonu", emptyApb);
  const [output, setOutput] = useState<string>("");

  const set = <K extends keyof ApbData>(key: K, value: ApbData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <ReportHeader
          title="APB Şablonu"
          description="Alanları doldur, alt kısımda foruma yapıştırabileceğin BBCode çıktısı oluşsun."
          format="BBCode"
          icon={Megaphone}
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
          <Section title="Duyuru">
            <div className="sm:col-span-2">
              <Field
                label="Başlık"
                value={data.heading}
                onChange={(v) => set("heading", v)}
                placeholder="ARANIYOR — ARAÇ HIRSIZLIĞI"
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Görsel Bağlantısı"
                value={data.imageUrl}
                onChange={(v) => set("imageUrl", v)}
                placeholder="https://... (boş bırakılırsa varsayılan avatar)"
              />
            </div>
          </Section>

          <Section title="Olay Bilgileri">
            <Field label="Tarih" value={data.date} onChange={(v) => set("date", v)} placeholder="GG/AA/YYYY" />
            <Field label="Saat" value={data.time} onChange={(v) => set("time", v)} placeholder="00:00" />
            <Field label="Rapor No. (OR)" value={data.reportNo} onChange={(v) => set("reportNo", v)} placeholder="12345" />
            <Field label="Konum" value={data.location} onChange={(v) => set("location", v)} placeholder="000 Adres, Bölge" />
            <div className="sm:col-span-2">
              <Field
                label="Şüpheli"
                value={data.suspect}
                onChange={(v) => set("suspect", v)}
                placeholder="Yaş, Tanım"
              />
            </div>
          </Section>

          <Section title="Detaylar" wide>
            <div className="sm:col-span-2">
              <Textarea
                rows={7}
                value={data.details}
                onChange={(e) => set("details", e.target.value)}
                placeholder="Şüpheli; motoru çalışır durumda olan aracı çalarak bölgeden uzaklaştı..."
              />
            </div>
          </Section>

          <Section title="İletişim" wide>
            <div className="sm:col-span-2">
              <ProfileFillButton
                onFill={(p) => {
              setData((d) => ({ ...d, officerName: p.name }));
                }}
              />
            </div>

            <Field label="Memur Adı Soyadı" value={data.officerName} onChange={(v) => set("officerName", v)} />
            <Field label="Telefon Numarası" value={data.phone} onChange={(v) => set("phone", v)} placeholder="1234567" />
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => setOutput(buildApbBBCode(data))}>Raporu Oluştur</Button>
          {output ? (
            <Button variant="outline" onClick={() => copy(output, "BBCode")}>
              <ClipboardCopy className="size-4" />
              BBCode kopyala
            </Button>
          ) : null}
        </div>

        {output ? (
          <section className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">BBCode Çıktısı</h2>
            <Textarea readOnly value={output} rows={22} className="mt-4 font-mono text-xs" />
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}


