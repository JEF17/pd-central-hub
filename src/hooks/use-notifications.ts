import { useSyncExternalStore } from "react";

import {
  getNotifications,
  subscribeNotifications,
  type AppNotification,
} from "@/lib/notifications";

const emptyList: AppNotification[] = [];

export function useNotifications() {
  return useSyncExternalStore(
    (l) => subscribeNotifications(l),
    () => getNotifications(),
    () => emptyList,
  );
}
