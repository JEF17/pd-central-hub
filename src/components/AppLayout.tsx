import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
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
    </SidebarProvider>
  );
}
