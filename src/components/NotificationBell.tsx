import { AlertCircle, Bell, CheckCircle2, Info, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-notifications";
import { clearNotifications, markAllRead } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const iconFor = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const;

const colorFor = {
  success: "text-success",
  error: "text-destructive",
  info: "text-primary",
} as const;

export function NotificationBell() {
  const items = useNotifications();
  const unread = items.filter((n) => !n.read).length;

  return (
    <Popover onOpenChange={(open) => open && unread > 0 && markAllRead()}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Bildirimler">
          <Bell className="size-4" />
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-sm font-semibold">Bildirimler</span>
          {items.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => clearNotifications()}
            >
              <Trash2 className="size-3.5" />
              Temizle
            </Button>
          ) : null}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              Henüz bildirim yok.
            </p>
          ) : (
            items.map((n) => {
              const Icon = iconFor[n.kind];
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 border-b border-border/60 px-3 py-2.5 last:border-0",
                    !n.read && "bg-accent/40",
                  )}
                >
                  <Icon className={cn("mt-0.5 size-4 shrink-0", colorFor[n.kind])} />
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{n.message}</p>
                    {n.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
                    ) : null}
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(n.at).toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
