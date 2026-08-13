import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calculator, Check, ChevronsUpDown, ExternalLink, Plus, Trash2 } from "lucide-react";

import { BAIL_SHEET_URL } from "@/lib/bail-sheet";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  decodeRows,
  encodeRows,
  typeClasses,
  type ChargeRow,
  type PriorRecord,
} from "@/lib/arrest-calc";
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
  const navigate = useNavigate();
  const { c } = Route.useSearch();

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
  const prior: PriorRecord = "clean";

  const update = (id: string, patch: Partial<ChargeRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const valid = rows.filter((r) => r.number);

  const calculate = () => {
    if (!valid.length) return;
    navigate({ to: "/arrest-report", search: { c: encodeRows(valid, parole, prior) } });
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
          <Button variant="secondary" onClick={calculate} disabled={!valid.length}>
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
