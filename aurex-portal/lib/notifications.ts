export type RequestNotification = {
  orderId: string;
  orderNumber: string;
  type: "approved" | "rejected";
  byName: string;
  reason?: string;
  at: string;
};

const KEY = "aurex_request_notifs";

export function getNotifications(userEmail: string): RequestNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${KEY}_${userEmail}`);
    return raw ? (JSON.parse(raw) as RequestNotification[]) : [];
  } catch {
    return [];
  }
}

export function addNotification(userEmail: string, notif: RequestNotification): void {
  if (typeof window === "undefined") return;
  const existing = getNotifications(userEmail);
  const filtered = existing.filter(
    (n) => !(n.orderId === notif.orderId && n.type === notif.type),
  );
  localStorage.setItem(`${KEY}_${userEmail}`, JSON.stringify([notif, ...filtered]));
}

export function clearNotifications(userEmail: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${KEY}_${userEmail}`);
}

export function getNotificationCount(userEmail: string): number {
  return getNotifications(userEmail).length;
}
