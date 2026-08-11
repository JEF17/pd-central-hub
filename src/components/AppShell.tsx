import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { MessageSquare, PanelLeft, Sparkles, Users } from "lucide-react";

import lspdLogo from "@/assets/lspd-logo.png.asset.json";
import { NotificationBell } from "@/components/NotificationBell";
import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative flex min-h-screen bg-background">
      <div
        aria-hidden
        className="lspd-watermark pointer-events-none fixed inset-0 z-0 bg-center bg-no-repeat opacity-[0.04]"
        style={{
          backgroundImage: `url(${lspdLogo.url})`,
          backgroundSize: "min(70vw, 700px)",
        }}
      />

      <aside
        className={cn(
          "sticky top-0 z-10 hidden h-screen shrink-0 flex-col border-r border-border bg-panel transition-[width] duration-200 md:flex",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <div className={cn("flex items-center gap-3 px-3", collapsed ? "h-auto flex-col py-3" : "h-16")}>
          <img src={lspdLogo.url} alt="LSPD badge" className="size-9 shrink-0 rounded-full object-contain" />
          {!collapsed && <span className="truncate text-lg font-bold tracking-tight">LSPD Toolkit</span>}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              collapsed ? "h-9 w-full" : "ml-auto size-9 shrink-0",
            )}
          >
            <PanelLeft className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {navItems
            .filter((item) => item.to !== "/ayarlar")
            .map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-panel-foreground/70 hover:bg-accent/60 hover:text-foreground",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
        </nav>

        <nav className="flex h-16 shrink-0 items-center border-t border-border px-3">
          {navItems
            .filter((item) => item.to === "/ayarlar")
            .map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-panel-foreground/70 hover:bg-accent/60 hover:text-foreground",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
        </nav>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border px-6">
          <img src={lspdLogo.url} alt="LSPD badge" className="size-7 object-contain md:hidden" />
          <span className="font-bold md:hidden">LSPD Toolkit</span>
          <div className="ml-auto flex items-center gap-1">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 fade-rise">{children}</main>
        <footer className="flex min-h-16 items-center border-t border-border px-6 py-3">
          <div className="flex w-full flex-col items-center justify-between gap-3 text-xs md:flex-row">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning">
                Demo Sürüm
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="size-3 text-primary/70" />
                <span>
                  <span className="font-medium text-foreground">Muptazelle</span> tarafından geliştirildi
                </span>
              </span>
            </div>

            <nav className="flex items-center gap-1">
              <a
                href="https://lspd-tr.gta.world/index.php"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <MessageSquare className="size-3.5" />
                LSPD Forum
              </a>
              <a
                href="https://discord.gg/kYSu2UeNkZ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Users className="size-3.5" />
                Discord
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
