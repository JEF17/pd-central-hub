import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Radio,
  Users,
  FolderArchive,
  Settings,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Dispatch", to: "/dispatch", icon: Radio },
  { label: "Personnel", to: "/personnel", icon: Users },
  { label: "Records", to: "/records", icon: FolderArchive },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar md:flex">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-steel font-display text-sm font-bold text-sidebar-primary-foreground">
            LS
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-display text-sm font-semibold tracking-wide text-sidebar-accent-foreground">
              LSPD PORTAL
            </span>
            <span className="truncate text-xs text-sidebar-foreground">
              Los Santos Police Dept.
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-3 rounded-md bg-sidebar-accent/50 p-3">
            <p className="field-label text-sidebar-foreground">Shift Status</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-xs text-sidebar-accent-foreground">
                <span className="text-sidebar-foreground">Duration</span>
                <span className="font-mono">06:42:15</span>
              </div>
              <div className="flex justify-between text-xs text-sidebar-accent-foreground">
                <span className="text-sidebar-foreground">Calls answered</span>
                <span className="font-mono">14</span>
              </div>
            </div>
          </div>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-destructive">
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-steel" />
            <span className="font-display text-sm font-semibold tracking-wide text-foreground">
              MISSION ROW DIVISION
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span className="h-2 w-2 rounded-full bg-success" />
              System online
            </span>
            <div className="text-right">
              <p className="text-xs font-medium text-foreground">Sgt. J. Reed</p>
              <p className="text-[11px] text-muted-foreground">Badge 3812 · 10-8</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Watch 3 · 24 May, 19:42
              </p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
