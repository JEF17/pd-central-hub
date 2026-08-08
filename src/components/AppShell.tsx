import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, CircleHelp, Github, PanelLeft, Shield } from "lucide-react";

import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-panel transition-[width] duration-200 md:flex",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
            <Shield className="size-5" />
          </div>
          {!collapsed && (
            <span className="truncate text-lg font-bold tracking-tight">
              LS Panel <span className="text-primary">+</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeft className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {navItems
            .filter((i) => i.to !== "/settings")
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

        <div className="space-y-1 border-t border-border px-3 py-3">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-panel-foreground/70 transition-colors hover:bg-accent/60 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <navItems[8].icon className="size-4 shrink-0" />
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border px-6 md:hidden">
          <Shield className="size-5 text-primary" />
          <span className="font-bold">LS Panel +</span>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
          <p>© 2026 LS Panel. GTA:W TR Roleplay community tool. Version 1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
