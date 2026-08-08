import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, PanelLeft } from "lucide-react";

import lspdLogo from "@/assets/lspd-logo.png.asset.json";
import { announcements } from "@/lib/announcements";
import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative flex min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-center bg-no-repeat opacity-[0.04]"
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
          {navItems.map((item) => {
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
          <button
            title="Announcements"
            onClick={() => setNewsOpen(true)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-panel-foreground/70 transition-colors hover:bg-accent/60 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <Bell className="size-4 shrink-0" />
            {!collapsed && (
              <>
                <span>Announcements</span>
                <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-destructive-foreground">
                  {announcements.length}
                </span>
              </>
            )}
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border px-6 md:hidden">
          <img src={lspdLogo.url} alt="LSPD badge" className="size-7 object-contain" />
          <span className="font-bold">LSPD Portal</span>
          <button
            onClick={() => setNewsOpen(true)}
            aria-label="Announcements"
            className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Bell className="size-4" />
          </button>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
          <p>© 2026 LSPD Portal. GTA:W TR Roleplay community tool. Version 1.0.0</p>
        </footer>
      </div>

      <Dialog open={newsOpen} onOpenChange={setNewsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Announcements</DialogTitle>
            <DialogDescription>Panel güncellemeleri ve duyurular.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {announcements.map((a) => (
              <article key={a.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {a.tag}
                  </span>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
              </article>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
