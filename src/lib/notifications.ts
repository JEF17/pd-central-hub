import { toast } from "sonner";

import {
  addMyNotification,
  clearMyNotifications,
  listMyNotifications,
  markMyNotificationsRead,
} from "./portal-data.functions";

export type NotificationKind = "success" | "error" | "info";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  message: string;
  description?: string;
  at: string;
  read: boolean;
};

const STORAGE_KEY = "lspd-notifications";
const LIMIT = 50;

let items: AppNotification[] = [];
let hydrated = false;
let serverLoaded = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* kota dolu olabilir */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) items = parsed as AppNotification[];
    }
  } catch {
    /* bozuk kayıt yok sayılır */
  }
  void loadFromServer();
}

/** Sunucudaki bildirimleri (kalıcı kayıt) yükler ve yerel listeyle birleştirir. */
export async function loadFromServer(): Promise<void> {
  if (serverLoaded || typeof window === "undefined") return;
  serverLoaded = true;
  try {
    const remote = await listMyNotifications({});
    const seen = new Set(remote.map((n) => n.id));
    const merged = [...remote, ...items.filter((n) => !seen.has(n.id))]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, LIMIT);
    items = merged as AppNotification[];
    emit();
  } catch {
    /* oturum yoksa sessiz geç */
  }
}

export function getNotifications(): AppNotification[] {
  hydrate();
  return items;
}

export function subscribeNotifications(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addNotification(
  kind: NotificationKind,
  message: string,
  description?: string,
) {
  hydrate();
  const entry: AppNotification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    message,
    at: new Date().toISOString(),
    read: false,
    ...(description ? { description } : {}),
  };
  items = [entry, ...items].slice(0, LIMIT);
  emit();

  addMyNotification({
    data: { kind, message, ...(description ? { description } : {}) },
  })
    .then((saved) => {
      if (!saved) return;
      // Geçici kimliği sunucudaki kalıcı kimlikle değiştir
      items = items.map((n) => (n.id === entry.id ? { ...n, id: saved.id, at: saved.at } : n));
      emit();
    })
    .catch(() => {
      /* oturum yoksa yalnızca yerel kayıt */
    });
}

export function markAllRead() {
  hydrate();
  items = items.map((n) => (n.read ? n : { ...n, read: true }));
  emit();
  markMyNotificationsRead({}).catch(() => {
    /* sessiz geç */
  });
}

export function clearNotifications() {
  items = [];
  emit();
  clearMyNotifications({}).catch(() => {
    /* sessiz geç */
  });
}

type NotifyArgs = [message: string, options?: { description?: string }];

function make(kind: NotificationKind) {
  return (...[message, options]: NotifyArgs) => {
    addNotification(kind, message, options?.description);
    if (kind === "success") toast.success(message, options);
    else if (kind === "error") toast.error(message, options);
    else toast(message, options);
  };
}

export const notify = Object.assign(make("info"), {
  success: make("success"),
  error: make("error"),
  info: make("info"),
});
