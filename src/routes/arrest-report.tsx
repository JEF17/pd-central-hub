import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ClipboardCopy, ExternalLink, Link2, Pencil } from "lucide-react";
import { notify } from "@/lib/notifications";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  additionMap,
  calculate,
  decodeRows,
  formatDuration,
  formatMoney,
  typeClasses,
  typeLabels,
} from "@/lib/arrest-calc";
import { BAIL_SHEET_URL } from "@/lib/bail-sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/arrest-report")({
  validateSearch: (search: Record<string, unknown>) => ({
    c: typeof search["c"] === "string" ? (search["c"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Tutuklama Özeti — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "Tutuklama Özeti — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { c } = Route.useSearch();
  const result = useMemo(() => {
    const { rows, paroleViolator, prior } = decodeRows(c);
    return calculate(rows, paroleViolator, prior);
  }, [c]);

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Tutuklama Özeti</h1>
        <p className="mt-2 text-muted-foreground">
          Hesaplanan suçlamaların ve rapor formunun özeti.
        </p>

        {result.charges.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
            Hesaplanacak suçlama bulunamadı.
            <div className="mt-4">
              <Button asChild>
                <Link to="/arrest-calculator" search={{ c: undefined }}>Süre Hesapla sayfasına dön</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {result.points >= 30 ? (
              <div
                role="alert"
                className="mt-8 flex items-start gap-3 rounded-xl border border-warning/50 bg-warning/10 p-4 text-warning"
              >
                <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Suç puanı 30 veya üzeri.</p>
                  <p className="mt-1 text-sm text-warning/80">
                    Toplam suç puanı 30 veya üzerine çıktığı için ilgili prosedürleri kontrol edin.
                  </p>
                </div>
              </div>
            ) : null}

            {result.zeroMinCharges.length ? (
              <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-sm text-warning">
                Bazı suçlamaların alt sınırı alt sınırı bulunmuyor.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <span>Suçlamalar ile alakalı kefalet şablonunu kontrol etmeyin.</span>
              <a
                href={BAIL_SHEET_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                İlgili Kefalet Cetveli
                <ExternalLink className="size-3.5" />
              </a>
            </div>



            <section className="mt-8 rounded-xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Suçlamalar</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copy(window.location.href, "Hesaplama bağlantısı")}
                  >
                    <Link2 className="size-4" />
                    Bağlantıyı kopyala
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/arrest-calculator" search={{ c }}>
                      <Pencil className="size-4" />
                      Suçlamaları düzenle
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="py-3 pr-4 font-medium">Suçlama</th>
                      <th className="py-3 pr-4 font-medium">Ek Durum</th>
                      <th className="py-3 pr-4 font-medium">Suç No</th>
                      <th className="py-3 pr-4 font-medium">Tür</th>
                      <th className="py-3 pr-4 font-medium">Min. Süre</th>
                      <th className="py-3 pr-4 font-medium">Maks. Süre</th>
                      <th className="py-3 pr-4 font-medium">Puan</th>
                      <th className="py-3 pr-4 font-medium">Para Cezası</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.charges.map((charge, index) => (
                      <tr key={`${charge.definition.number}-${index}`} className="border-b border-border/60">
                        <td className="py-4 pr-4 font-semibold">
                          {charge.variant.cls}
                          {charge.variant.type} {charge.definition.number}. {charge.definition.title}
                          {charge.category ? (
                            <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs font-bold text-muted-foreground">
                              Kategori {charge.category.key}
                            </span>
                          ) : null}
                        </td>

                        <td className="py-4 pr-4 text-muted-foreground">
                          {additionMap[charge.row.addition]?.label}
                        </td>
                        <td className="py-4 pr-4">{charge.row.offense}</td>
                        <td className={cn("py-4 pr-4 font-semibold", typeClasses[charge.variant.type])}>
                          {typeLabels[charge.variant.type]}
                        </td>
                        <td className="py-4 pr-4">
                          {charge.minMinutes === 0 ? (
                            <span className="text-xs font-semibold text-warning">0 dk (alt sınır bulunmuyor.)</span>
                          ) : (
                            <ParoleValue
                              base={formatDuration(charge.baseMinMinutes)}
                              final={formatDuration(charge.minMinutes)}
                              active={result.paroleViolator}
                            />
                          )}
                        </td>


                        <td className="py-4 pr-4">
                          <ParoleValue
                            base={formatDuration(charge.baseMaxMinutes)}
                            final={formatDuration(charge.maxMinutes)}
                            active={result.paroleViolator}
                          />
                        </td>
                        <td className="py-4 pr-4">
                          <ParoleValue
                            base={String(charge.basePoints)}
                            final={String(charge.points)}
                            active={result.paroleViolator}
                          />
                        </td>
                        <td className="py-4">{formatMoney(charge.fine)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-lg shadow-primary/5">
              <h2 className="text-xl font-semibold text-primary">Özet</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[820px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="py-3 pr-4 font-medium">Min. Süre</th>
                      <th className="py-3 pr-4 font-medium">Maks. Süre</th>
                      <th className="py-3 pr-4 font-medium">Ceza Puanı</th>
                      <th className="py-3 pr-4 font-medium">Para Cezası</th>
                      <th className="py-3 font-medium">Şartlı Tahliye İhlali</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 pr-4">
                        <ParoleValue
                          base={formatDuration(result.baseMinMinutes)}
                          final={formatDuration(result.minMinutes)}
                          active={result.paroleViolator}
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <ParoleValue
                          base={formatDuration(result.baseMaxMinutes)}
                          final={formatDuration(result.maxMinutes)}
                          active={result.paroleViolator}
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <ParoleValue
                          base={String(result.basePoints)}
                          final={String(result.points)}
                          active={result.paroleViolator}
                        />
                      </td>
                      <td className="py-4 pr-4">{formatMoney(result.fine)}</td>
                      <td className="py-4">{result.paroleViolator ? "Evet" : "Hayır"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>



            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <CopyField label="Min. Dakika" value={String(result.minMinutes)} onCopy={copy} />
              <CopyField label="Maks. Dakika" value={String(result.maxMinutes)} onCopy={copy} />
              <CopyField label="Ceza Puanı" value={String(result.points)} onCopy={copy} />
              <CopyField label="Para Cezası" value={String(result.fine)} onCopy={copy} />
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

function CopyField({
  label,
  value,
  onCopy,
  highlight,
}: {
  label: string;
  value: string;
  onCopy: (value: string, label: string) => void;
  highlight?: boolean;
}) {
  const [current] = useState(value);
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        highlight && "border-destructive/60 bg-destructive/5",
      )}
    >
      <Label className={cn("text-xs", highlight && "text-destructive")}>{label}</Label>
      <div className="mt-2 flex items-center gap-2">
        <Input readOnly value={current} className="font-mono" />
        <Button variant="outline" size="icon" onClick={() => onCopy(current, label)} aria-label={`${label} kopyala`}>
          <ClipboardCopy className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ParoleValue({ base, final, active }: { base: string; final: string; active: boolean }) {
  if (!active || base === final) return <span>{final}</span>;
  return (
    <span
      className="inline-flex flex-col leading-tight"
      title={`Normal: ${base} · Şartlı tahliye ihlali (x2): ${final}`}
    >
      <span className="font-semibold">{final}</span>
      <span className="text-xs text-muted-foreground line-through">{base}</span>
    </span>
  );
}
