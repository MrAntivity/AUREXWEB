"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ScrollText, Trash2 } from "lucide-react";
import { getAuditLog } from "@/lib/audit-log";
import type { AuditEntry, AuditAction } from "@/lib/audit-log";

const ACTION_LABEL: Record<AuditAction, string> = {
  product_updated:      "Product Updated",
  product_created:      "Product Created",
  stock_updated:        "Stock Updated",
  staff_login:          "Signed In",
  staff_logout:         "Signed Out",
  order_status_changed: "Order Status Changed",
};

const ACTION_COLOR: Record<AuditAction, string> = {
  product_updated:      "bg-blue-50 text-blue-700",
  product_created:      "bg-green-50 text-green-700",
  stock_updated:        "bg-teal-50 text-teal-700",
  staff_login:          "bg-gray-100 text-gray-600",
  staff_logout:         "bg-gray-100 text-gray-500",
  order_status_changed: "bg-purple-50 text-purple-700",
};

export default function StaffAuditPage() {
  const [log, setLog] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterAction, setFilterAction] = useState<AuditAction | "all">("all");

  useEffect(() => { setLog(getAuditLog()); }, []);

  const uniqueUsers = useMemo(() => {
    const names = [...new Set(log.map((e) => e.userName))];
    return names.sort();
  }, [log]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return log.filter((e) => {
      const matchSearch = !q || e.userName.toLowerCase().includes(q) || e.target.toLowerCase().includes(q) || e.details.toLowerCase().includes(q);
      const matchUser = filterUser === "all" || e.userName === filterUser;
      const matchAction = filterAction === "all" || e.action === filterAction;
      return matchSearch && matchUser && matchAction;
    });
  }, [log, search, filterUser, filterAction]);

  function handleClear() {
    if (!confirm("Clear the entire audit log? This cannot be undone.")) return;
    localStorage.removeItem("aurex_audit_log");
    setLog([]);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Audit Log</h1>
          <p className="mt-0.5 text-sm text-gray-500">{log.length} entries recorded</p>
        </div>
        {log.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} /> Clear Log
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue"
          />
        </div>
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none"
        >
          <option value="all">All Staff</option>
          {uniqueUsers.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value as AuditAction | "all")}
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none"
        >
          <option value="all">All Actions</option>
          {(Object.keys(ACTION_LABEL) as AuditAction[]).map((a) => (
            <option key={a} value={a}>{ACTION_LABEL[a]}</option>
          ))}
        </select>
        <p className="text-sm text-gray-400">{filtered.length} entries</p>
      </div>

      {/* Log */}
      {log.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <ScrollText size={36} className="text-gray-200" />
          <p className="text-sm text-gray-400">No activity recorded yet. Actions taken in the staff portal will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Timestamp", "Staff Member", "Action", "Target", "Details"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aurex-blue/10 text-[10px] font-bold text-aurex-blue">
                        {entry.userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{entry.userName}</p>
                        <p className="text-[10px] text-gray-400">{entry.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLOR[entry.action]}`}>
                      {ACTION_LABEL[entry.action]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{entry.target}</td>
                  <td className="max-w-[300px] truncate px-4 py-3 text-xs text-gray-500">{entry.details}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-400">No entries match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
