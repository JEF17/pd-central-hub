import type { LucideIcon } from "lucide-react";
import { ArrowLeft, FileText, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";

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
            {format ? (
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {format}
              </span>
            ) : null}
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
