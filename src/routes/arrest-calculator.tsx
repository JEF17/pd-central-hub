import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calculator,
  Check,
  ChevronsUpDown,
  ClipboardCopy,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";

import { BAIL_SHEET_URL } from "@/lib/bail-sheet";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chargeCatalog, type ChargeClass } from "@/lib/charge-catalog";
import {
  additions,
  additionMap,
  calculate as computeSentence,
  decodeRows,
  formatDuration,
  formatMoney,
  typeClasses,
  typeLabels,
  type ChargeRow,
  type PriorRecord,
} from "@/lib/arrest-calc";
import { notify } from "@/lib/notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/arrest-calculator")({
  validateSearch: (search: Record<string, unknown>) => ({
    c: typeof search['c'] === "string" ? (search['c'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Süre Hesapla — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "Süre Hesapla — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

let rowCounter = 0;
function makeRow(): ChargeRow {
  rowCounter += 1;
  return { id: `row-${rowCounter}`, number: "", cls: "C", offense: 1, addition: "offender" };
}

function Page() {
  const { c } = Route.useSearch();
  const prior: PriorRecord = "clean";

  const initial = (() => {
    if (!c) return null;
    try {
      const decoded = decodeRows(c);
      if (!decoded.rows.length) return null;
      return decoded;
    } catch {
      return null;
    }
  })();

  const [rows, setRows] = useState<ChargeRow[]>(() =>
    initial
      ? initial.rows.map((r) => {
          rowCounter += 1;
          return { ...r, id: `row-${rowCounter}` };
        })
      : [makeRow()],
  );
  const [parole, setParole] = useState(initial?.paroleViolator ?? false);
  const [result, setResult] = useState<ReturnType<typeof computeSentence> | null>(() =>
    initial ? computeSentence(initial.rows, initial.paroleViolator, prior) : null,
  );

  const update = (id: string, patch: Partial<ChargeRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const valid = rows.filter((r) => r.number);

  const handleCalculate = () => {
    if (!valid.length) return;
    setResult(computeSentence(valid, parole, prior));
  };

  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    notify.success(`${label} kopyalandı`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Süre Hesapla</h1>
        <p className="mt-2 text-muted-foreground">
          Suçlamalara göre tutuklama süresini, ceza puanını ve para cezasını hesaplayın.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={() => setRows((prev) => [...prev, makeRow()])}>
            <Plus className="size-4" />
            Suçlama Ekle
          </Button>
          <Button variant="secondary" onClick={handleCalculate} disabled={!valid.length}>
            <Calculator className="size-4" />
            Süreyi Hesapla
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Checkbox
            id="parole"
            checked={parole}
            onCheckedChange={(value) => setParole(value === true)}
          />
          <Label htmlFor="parole" className="cursor-pointer font-semibold">
            Şüpheli şartlı tahliye / denetimli serbestlik ihlali gerçekleştirdi. (C.K. 904)
          </Label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <span>Suçlamalar ile alakalı kefalet şablonunu kontrol etmeyi unutmayın.</span>
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

        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <ChargeRowCard
              key={row.id}
              row={row}
              onChange={(patch) => update(row.id, patch)}
              onRemove={() => setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== row.id) : prev))}
            />
          ))}
        </div>

        {result ? (
          result.charges.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
              Hesaplanacak suçlama bulunamadı.
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
                  Bazı suçlamaların alt sınırı bulunmuyor.
                </p>
              ) : null}

              <section className="mt-8 rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-semibold">Suçlamalar</h2>
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
          )
        ) : null}
      </div>
    </AppShell>
  );
}

function ChargeRowCard({
  row,
  onChange,
  onRemove,
}: {
  row: ChargeRow;
  onChange: (patch: Partial<ChargeRow>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const definition = chargeCatalog.find((c) => c.number === row.number);
  const classOptions = definition?.variants ?? [];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div
        className={cn(
          "grid gap-4 md:items-end",
          definition?.categories?.length
            ? "md:grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto]"
            : "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto]",
        )}
      >
        <div className="space-y-2">
          <Label>Suçlama</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
              >
                {definition ? (
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs font-bold",
                        definition.variants[0]?.type === "F" && "bg-destructive/15 text-destructive",
                        definition.variants[0]?.type === "M" && "bg-warning/15 text-warning",
                        definition.variants[0]?.type === "I" && "bg-success/15 text-success",
                      )}
                    >
                      {definition.number}
                    </span>
                    <span className="truncate font-medium">{definition.title}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Suçlama seçin...</span>
                )}
                <ChevronsUpDown className="size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command
                filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
              >
                <CommandInput placeholder="Madde numarası veya suç adı ara..." />
                <CommandList>
                  <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
                  <CommandGroup>
                    {chargeCatalog.map((charge) => (
                      <CommandItem
                        key={charge.number}
                        value={`${charge.number} ${charge.title}`}
                        onSelect={() => {
                          onChange({
                            number: charge.number,
                            cls: charge.variants[0]?.cls ?? "C",
                            category: charge.categories?.[0]?.key,
                          });
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn("size-4", row.number === charge.number ? "opacity-100" : "opacity-0")}
                        />
                        <span className="font-mono text-xs text-muted-foreground">{charge.number}</span>
                        <span className="truncate">{charge.title}</span>
                        <span className={cn("ml-auto text-xs", typeClasses[charge.variants[0]?.type ?? "M"])}>
                          {charge.variants[0]?.type}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Sınıf</Label>
          <Select
            value={row.cls}
            onValueChange={(value) => onChange({ cls: value as ChargeClass })}
            disabled={!definition}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sınıf" />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map((variant) => (
                <SelectItem key={variant.cls} value={variant.cls}>
                  {variant.cls} Sınıfı
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {definition?.categories?.length ? (
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={row.category ?? definition.categories[0]?.key ?? ""}
              onValueChange={(value) => onChange({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {definition.categories.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.key} Kategorisi
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label>Suç Sayısı</Label>
          <Select value={String(row.offense)} onValueChange={(value) => onChange({ offense: Number(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}. Suç
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ek Durum</Label>
          <Select
            value={row.addition}
            onValueChange={(value) => onChange({ addition: value as ChargeRow["addition"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {additions.map((addition) => (
                <SelectItem key={addition.key} value={addition.key}>
                  {addition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Suçlamayı kaldır">
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

function CopyField({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (value: string, label: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Label className="text-xs">{label}</Label>
      <div className="mt-2 flex items-center gap-2">
        <Input readOnly value={value} className="font-mono" />
        <Button variant="outline" size="icon" onClick={() => onCopy(value, label)} aria-label={`${label} kopyala`}>
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
