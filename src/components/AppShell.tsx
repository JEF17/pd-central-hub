import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { PanelLeft } from "lucide-react";

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
        <div
          className={cn(
            "flex items-center gap-3 px-3",
            collapsed ? "h-auto flex-col py-3" : "h-16",
          )}
        >
          <img
            src={lspdLogo.url}
            alt="LSPD badge"
            className="size-9 shrink-0 rounded-full object-contain"
          />
          {!collapsed && (
            <span className="truncate text-lg font-bold tracking-tight">
              LSPD Portal
            </span>
          )}
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

        <nav className="border-t border-border px-3 py-2">
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

      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border px-6">
          <img src={lspdLogo.url} alt="LSPD badge" className="size-7 object-contain md:hidden" />
          <span className="font-bold md:hidden">LSPD Portal</span>
          <div className="ml-auto flex items-center gap-1">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 fade-rise">{children}</main>
        <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground" />
      </div>
    </div>
  );
}

