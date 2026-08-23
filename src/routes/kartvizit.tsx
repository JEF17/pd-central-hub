import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, IdCard, Loader2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
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
import { toast } from "sonner";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { FormSection } from "@/components/report-ui";

export const Route = createFileRoute("/kartvizit")({
  head: () => ({
    meta: [
      { title: "Kartvizit Oluştur — LSPD Toolkit" },
      {
        name: "description",
        content:
          "LSPD divizyon şablonlarıyla kişiye özel kartvizit oluşturun ve PNG olarak indirin.",
      },
      { property: "og:title", content: "Kartvizit Oluştur — LSPD Toolkit" },
      {
        property: "og:description",
        content: "LSPD divizyon şablonlarıyla kartvizit oluşturun ve indirin.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BusinessCardPage,
});

const templates = [
  { value: "template1", label: "Patrol Division" },
  { value: "template2", label: "Area Detective Division" },
  { value: "template3", label: "Central Traffic Division" },
  { value: "template4", label: "Metropolitan Division" },
  { value: "template5", label: "Metropolitan Division v2" },
] as const;

const CARD_W = 700;
const CARD_H = 400;

function BusinessCardPage() {
  const profile = useOfficerProfile();
  const [template, setTemplate] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [scale, setScale] = useState(1);

  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Dar ekranlarda kart otomatik küçülsün.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / CARD_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  async function download() {
    if (!template) {
      toast.error("Lütfen önce bir şablon seçiniz.");
      return;
    }
    setBusy(true);
    try {
      // Şablonun kendi çözünürlüğünde çiziyoruz: çıktı net kalıyor.
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `/kartvizit/${template}.png`;
      await img.decode();

      try {
        await (document as any).fonts?.load?.("25px Slimshoot");
        await (document as any).fonts?.ready;
      } catch {
        /* font yüklenmese de devam */
      }

      const W = img.naturalWidth || 500;
      const H = img.naturalHeight || 290;
      const k = W / CARD_W; // önizleme koordinatlarını şablon ölçeğine indir

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas desteklenmiyor.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);

      const fontSize = 25 * k;
      ctx.font = `${fontSize}px Slimshoot, sans-serif`;
      ctx.fillStyle = "#2d436b";
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      if (phone.trim()) {
        ctx.fillText(phone, 540 * k, 22 * k, 150 * k);
      }

      const lines = name.split("\n");
      const lineH = 32.5 * k;
      const blockTop = (400 - 48) * k - lines.length * lineH;
      lines.forEach((line, i) => {
        if (!line.trim()) return;
        ctx.fillText(line, 75 * k, blockTop + i * lineH + 3.75 * k, 500 * k);
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "lspd_kartvizit.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Kartvizit indirildi.");
    } catch (err) {
      toast.error("İndirme başarısız oldu: " + (err as Error).message);
    } finally {
      setBusy(false);
    }
  }


  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <IdCard className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Kartvizit Oluştur</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                İlgili alanları doldurup kartvizit oluşturabilirsiniz.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <FormSection title="Kartvizit Bilgileri" icon={IdCard}>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Şablon Seçimi
              </Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="h-10 bg-background/60">
                  <SelectValue placeholder="Lütfen bir şablon seçiniz..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Telefon Numarası
              </Label>
              <Input
                className="h-10 bg-background/60"
                value={phone}
                placeholder="Örn: 555-0199"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Personel Adı
                </Label>
                {profile?.name ? (
                  <button
                    type="button"
                    onClick={() =>
                      setName([profile.rank, profile.name].filter(Boolean).join(" "))
                    }
                    className="text-[11px] text-primary underline-offset-4 hover:underline"
                  >
                    Profilden doldur
                  </button>
                ) : null}
              </div>
              <Textarea
                className="min-h-[76px] bg-background/60"
                rows={2}
                value={name}
                placeholder={"Örn: J. Doe\nAlt satıra geçmek için Enter'a basın"}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </FormSection>

          <div className="space-y-4">
            <div ref={wrapRef} className="w-full">
              <div
                style={{ width: CARD_W * scale, height: CARD_H * scale }}
                className="mx-auto overflow-hidden"
              >

                <div
                  ref={cardRef}
                  data-business-card
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    backgroundImage: template ? `url(/kartvizit/${template}.png)` : undefined,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: template ? "#f4f6f8" : undefined,
                    
                  }}
                  className={
                    template
                      ? "relative shrink-0 overflow-hidden rounded shadow-lg"
                      : "relative grid shrink-0 place-items-center rounded border-2 border-dashed border-border bg-muted/30"
                  }
                >
                  {template ? (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          top: 20,
                          right: 10,
                          width: 150,
                          fontFamily: "Slimshoot, sans-serif",
                          color: "#2d436b",
                          fontSize: 25,
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {phone}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 62,
                          left: 75,
                          width: 500,
                          fontFamily: "Slimshoot, sans-serif",
                          color: "#2d436b",
                          fontSize: 25,
                          lineHeight: 1.3,
                          textAlign: "left",
                          whiteSpace: "pre-wrap",
                          overflow: "hidden",
                        }}
                      >
                        {name}
                      </div>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Önizleme için bir şablon seçiniz.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={download} disabled={busy} className="w-full" size="lg">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              {busy ? "İşleniyor..." : "Kartvizit Oluştur"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
