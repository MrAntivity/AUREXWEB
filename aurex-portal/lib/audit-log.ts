const LOG_KEY = "aurex_audit_log";

export type AuditAction =
  | "product_updated"
  | "product_created"
  | "stock_updated"
  | "staff_login"
  | "staff_logout"
  | "order_status_changed"
  | "staff_user_created";

export type AuditEntry = {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  target: string;
  details: string;
};

export function getAuditLog(): AuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOG_KEY);
    return stored ? (JSON.parse(stored) as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function addAuditEntry(
  entry: Omit<AuditEntry, "id" | "timestamp">
): void {
  if (typeof window === "undefined") return;
  const log = getAuditLog();
  log.unshift({ ...entry, id: Math.random().toString(36).slice(2), timestamp: new Date().toISOString() });
  if (log.length > 1000) log.splice(1000);
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}
