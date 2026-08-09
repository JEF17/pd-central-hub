import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { buildEmailBBCode, emptyEmail, type EmailData } from "@/lib/email-template";

export const Route = createFileRoute("/e-posta")({
  head: () => ({
    meta: [
      { title: "E-Posta Şablonu Oluşturucu — LSPD Portal" },
      {
        name: "description",
        content:
          "Departman içi resmi e-posta şablonunu doldur, foruma hazır BBCode çıktısını tek tıkla kopyala.",
      },
      { property: "og:title", content: "E-Posta Şablonu Oluşturucu — LSPD Portal" },
      {
        property: "og:description",
        content: "Kimden, kime, konu ve içerik alanlarını doldur, BBCode e-posta çıktısı al.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData] = useState<EmailData>(emptyEmail);
  const [output, setOutput] = useState<string>("");

  const set = <K extends keyof EmailData>(key: K, value: EmailData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const copy = (value: string) => {
    void navigator.clipboard.writeText(value);
    toast.success("BBCode kopyalandı");
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
        <h1 className="text-3xl font-bold tracking-tight">E-Posta</h1>
        <p className="mt-2 text-muted-foreground">
          Alanları doldur, alt kısımda foruma yapıştırabileceğin BBCode çıktısı oluşsun.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Section title="Gönderim Bilgileri">
            <Field
              label="Kimden"
              value={data.from}
              onChange={(v) => set("from", v)}
              placeholder="John Doe <john.doe@lspd.gov>"
            />
            <Field
              label="Kime"
              value={data.to}
              onChange={(v) => set("to", v)}
              placeholder="Jane Roe <jane.roe@lspd.gov>"
            />
            <Field
              label="Cc"
              value={data.cc}
              onChange={(v) => set("cc", v)}
              placeholder="Boş bırakılabilir"
            />
            <Field
              label="Konu"
              value={data.subject}
              onChange={(v) => set("subject", v)}
              placeholder="Devriye Raporu Hk."
            />
          </Section>

          <Section title="Gönderme Tarihi">
            <div>
              <Label className="text-xs">Tarih</Label>
              <Input
                type="date"
                className="mt-2"
                value={data.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Saat</Label>
                <Input
                  className="mt-2"
                  value={data.time}
                  placeholder="09:45"
                  onChange={(e) => set("time", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">AM / PM</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["AM", "PM"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={data.meridiem === m}
                      onClick={() => set("meridiem", m)}
                      className={cn(
                        "rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors",
                        data.meridiem === m
                          ? "border-primary bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="İçerik" wide>
            <div className="sm:col-span-2">
              <Textarea
                rows={12}
                value={data.body}
                onChange={(e) => set("body", e.target.value)}
                placeholder={"Sayın ...,\n\n...\n\nSaygılarımla,\nOfficer John Doe"}
              />
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => setOutput(buildEmailBBCode(data))}>Raporu Oluştur</Button>
          {output ? (
            <Button variant="outline" onClick={() => copy(output)}>
              <ClipboardCopy className="size-4" />
              BBCode kopyala
            </Button>
          ) : null}
        </div>

        {output ? (
          <section className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">BBCode Çıktısı</h2>
            <Textarea readOnly value={output} rows={18} className="mt-4 font-mono text-xs" />
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
