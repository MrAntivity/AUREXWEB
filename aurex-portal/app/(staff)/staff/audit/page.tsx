"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ScrollText, Calendar, X } from "lucide-react";
import { getAuditLog } from "@/lib/audit-log";
import type { AuditEntry, AuditAction } from "@/lib/audit-log";

const ACTION_LABEL: Record<AuditAction, string> = {
  product_updated:      "Product Updated",
  product_created:      "Product Created",
  stock_updated:        "Stock Updated",
  staff_login:          "Signed In",
  staff_logout:         "Signed Out",
  order_status_changed: "Order Status Changed",
  order_cancelled:      "Order Cancelled",
  order_refunded:       "Order Refunded",
  order_edited:         "Order Edited",
  staff_user_created:   "Staff User Created",
};

const ACTION_COLOR: Record<AuditAction, string> = {
  product_updated:      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  product_created:      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  stock_updated:        "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  staff_login:          "bg-gray-100 text-gray-600 dark:bg-white/8 dark:text-gray-400",
  staff_logout:         "bg-gray-100 text-gray-500 dark:bg-white/8 dark:text-gray-500",
  order_status_changed: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  order_cancelled:      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  order_refunded:       "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  order_edited:         "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  staff_user_created:   "bg-aurex-blue/10 text-aurex-blue dark:bg-aurex-blue/10 dark:text-aurex-blue",
};

export default function StaffAuditPage() {
  const [log, setLog] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterAction, setFilterAction] = useState<AuditAction | "all">("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  useEffect(() => { setLog(getAuditLog()); }, []);

  const uniqueUsers = useMemo(() => {
    const names = [...new Set(log.map((e) => e.userName))];
    return names.sort();
  }, [log]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const from = filterDateFrom ? new Date(filterDateFrom + "T00:00:00") : null;
    const to   = filterDateTo   ? new Date(filterDateTo   + "T23:59:59") : null;
    return log.filter((e) => {
      const matchSearch = !q || e.userName.toLowerCase().includes(q) || e.target.toLowerCase().includes(q) || e.details.toLowerCase().includes(q);
      const matchUser   = filterUser === "all" || e.userName === filterUser;
      const matchAction = filterAction === "all" || e.action === filterAction;
      const ts = new Date(e.timestamp);
      const matchFrom = !from || ts >= from;
      const matchTo   = !to   || ts <= to;
      return matchSearch && matchUser && matchAction && matchFrom && matchTo;
    });
  }, [log, search, filterUser, filterAction, filterDateFrom, filterDateTo]);

  const hasDateFilter = filterDateFrom || filterDateTo;
  const hasAnyFilter  = search || filterUser !== "all" || filterAction !== "all" || filterDateFrom || filterDateTo;

  function clearAllFilters() {
    setSearch("");
    setFilterUser("all");
    setFilterAction("all");
    setFilterDateFrom("");
    setFilterDateTo("");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Audit Log</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{log.length} entries recorded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white dark:placeholder-gray-600"
            />
          </div>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
          >
            <option value="all">All Staff</option>
            {uniqueUsers.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value as AuditAction | "all")}
            className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
          >
            <option value="all">All Actions</option>
            {(Object.keys(ACTION_LABEL) as AuditAction[]).map((a) => (
              <option key={a} value={a}>{ACTION_LABEL[a]}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-[#1a1a2a]">
            <Calendar size={13} className="shrink-0 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300"
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-[#1a1a2a]">
            <Calendar size={13} className="shrink-0 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">To</span>
            <input
              type="date"
              value={filterDateTo}
              min={filterDateFrom || undefined}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300"
            />
          </div>
          {hasDateFilter && (
            <button
              onClick={() => { setFilterDateFrom(""); setFilterDateTo(""); }}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
            >
              <X size={12} /> Clear dates
            </button>
          )}
          {hasAnyFilter && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            >
              <X size={12} /> Clear All Filters
            </button>
          )}
          <p className="ml-auto text-sm text-gray-400">{filtered.length} entries</p>
        </div>
      </div>

      {/* Log */}
      {log.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
          <ScrollText size={36} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
          <p className="text-sm text-gray-400">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-white/8 dark:bg-white/3">
                {["Timestamp", "Staff Member", "Action", "Target", "Details"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filtered.map((entry) => (
                <tr key={entry.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/3">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
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
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{entry.userName}</p>
                        <p className="text-[10px] text-gray-400">{entry.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLOR[entry.action]}`}>
                      {ACTION_LABEL[entry.action]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{entry.target}</td>
                  <td className="max-w-[300px] truncate px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{entry.details}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-gray-400">
                    No entries match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
