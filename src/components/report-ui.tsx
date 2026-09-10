import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Calendar as CalendarIcon, FileText, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Shared page header for every report generator. */
export function ReportHeader({
  title,
  description,
  format,
  icon: Icon = FileText,
}: {
  title: string;
  description?: string;
  format?: "BBCode" | "HTML" | "MDC";
  icon?: LucideIcon;
}) {
  const hint = description?.trim();
  return (
    <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-6 shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl"
      />
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 h-7 px-2 text-xs">
        <Link to="/paperwork-generators">
          <ArrowLeft className="size-3.5" />
          Rapor Oluştur
        </Link>
      </Button>

      <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          </div>
          {hint ? (
            <p className="mt-1 truncate text-sm text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </div>

      <Alert className="mt-4 border-primary/20 bg-primary/5">
        <Info className="size-4" />
        <AlertTitle>Bilgi</AlertTitle>
        <AlertDescription>
          Rapor içeriklerinde büyük harf kullanımına dikkat ediniz. (Örn: AD SOYAD, KONUM, SUÇ BAŞLIĞI)
        </AlertDescription>
      </Alert>
    </header>
  );
}

/** Card wrapper for a group of form fields. */
export function FormSection({
  title,
  children,
  wide,
  icon: Icon,
  hint,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  icon?: LucideIcon;
  hint?: string;
}) {
  return (
    <section
      className={cn(
        "group/section overflow-hidden rounded-xl border border-border bg-card/80 shadow-sm transition-all hover:border-primary/30 hover:shadow-md",
        wide && "lg:col-span-2",
      )}
    >
      <div className="flex items-center gap-3 border-b border-border/70 bg-gradient-to-r from-primary/10 via-muted/30 to-transparent px-5 py-3">
        <span className="h-5 w-1 rounded-full bg-gradient-to-b from-primary to-gold" />
        {Icon ? <Icon className="size-4 shrink-0 text-primary/80" /> : null}
        <h2 className="min-w-0 truncate text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground/90">
          {title}
        </h2>
        {hint ? (
          <span className="ml-auto hidden truncate text-xs text-muted-foreground sm:block">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

/** Labelled text input used across report forms. */
export function TextField({
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
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Input
        className="h-10 bg-background/60 transition-colors focus-visible:bg-background"
        value={value}
        placeholder={placeholder ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "GG/AA/YYYY" (opsiyonel " — HHmm") biçimini parçalar. */
function parseDateValue(value: string) {
  const [datePart = "", timePart = ""] = value.split("—").map((s) => s.trim());
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(datePart);
  let date: Date | undefined;
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!Number.isNaN(d.getTime())) date = d;
  }
  const t = /^(\d{2}):?(\d{2})$/.exec(timePart);
  return { date, time: t ? `${t[1]}:${t[2]}` : "" };
}

/** Takvimden tarih (ve istenirse saat) seçtiren alan. */
export function DateField({
  label,
  value,
  onChange,
  withTime = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  withTime?: boolean;
}) {
  const { date, time } = parseDateValue(value);

  const compose = (d: Date | undefined, t: string) => {
    if (!d) return "";
    const ds = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    if (!withTime) return ds;
    return t ? `${ds} — ${t.replace(":", "")}` : ds;
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className={cn("flex gap-2", !withTime && "block")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-10 w-full justify-start bg-background/60 font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="size-4" />
              {date
                ? `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
                : "Tarih seç"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              onSelect={(d) => onChange(compose(d ?? undefined, time))}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {withTime ? (
          <Input
            type="time"
            value={time}
            onChange={(e) => onChange(compose(date, e.target.value))}
            className="h-10 w-[7.5rem] shrink-0 bg-background/60"
          />
        ) : null}
      </div>
    </div>
  );
}
