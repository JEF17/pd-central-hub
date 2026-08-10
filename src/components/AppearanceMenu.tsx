import { Check, Monitor, Moon, Rows3, Rows4, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppearance } from "@/hooks/use-appearance";
import { cn } from "@/lib/utils";
import type { Density, ThemeMode } from "@/lib/appearance";

export function AppearanceMenu() {
  const { appearance, update } = useAppearance();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Görünüm ayarları"
          title="Görünüm ayarları"
          className="transition-transform hover:scale-105"
        >
          <Monitor className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-3">
        <DropdownMenuLabel className="px-0 pt-0 text-[11px] uppercase tracking-widest text-muted-foreground">
          Tema
        </DropdownMenuLabel>
        <div className="grid grid-cols-2 gap-2">
          <Option
            active={appearance.theme === "dark"}
            onClick={() => update({ theme: "dark" as ThemeMode })}
            icon={<Moon className="size-4" />}
            label="Koyu"
          />
          <Option
            active={appearance.theme === "light"}
            onClick={() => update({ theme: "light" as ThemeMode })}
            icon={<Sun className="size-4" />}
            label="Açık"
          />
        </div>

        <DropdownMenuSeparator className="my-3" />
        <DropdownMenuLabel className="px-0 pt-0 text-[11px] uppercase tracking-widest text-muted-foreground">
          Yoğunluk
        </DropdownMenuLabel>
        <div className="grid grid-cols-2 gap-2">
          <Option
            active={appearance.density === "comfortable"}
            onClick={() => update({ density: "comfortable" as Density })}
            icon={<Rows3 className="size-4" />}
            label="Rahat"
          />
          <Option
            active={appearance.density === "compact"}
            onClick={() => update({ density: "compact" as Density })}
            icon={<Rows4 className="size-4" />}
            label="Kompakt"
          />
        </div>

        <DropdownMenuSeparator className="my-3" />
        <button
          type="button"
          onClick={() => update({ softContrast: !appearance.softContrast })}
          aria-pressed={appearance.softContrast}
          className={cn(
            "flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors",
            appearance.softContrast
              ? "border-primary/50 bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          <span className="text-left">
            Göz konforu
            <span className="block text-[11px] text-muted-foreground">Kontrastı yumuşatır</span>
          </span>
          {appearance.softContrast ? <Check className="size-4 text-primary" /> : null}
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Option({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-md border px-2 py-2.5 text-xs font-medium transition-all",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
