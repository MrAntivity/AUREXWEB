"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp, DollarSign, ShoppingCart, CheckCircle2,
  Sun, Moon, X, Calendar,
} from "lucide-react";
import { ORDERS_KEY, BUDGETS_KEY } from "@/lib/store";
import type { Order } from "@/lib/store";
import { getStoredUser } from "@/lib/mock-auth";

type DatePreset = "7d" | "30d" | "90d" | "all" | "custom";
type BudgetDept = { name: string; budget: number; color: string };

const DEFAULT_BUDGETS: BudgetDept[] = [
  { name: "Chemistry",    budget: 15000, color: "bg-blue-500" },
  { name: "Biology",      budget: 12000, color: "bg-green-500" },
  { name: "Physics",      budget:  8000, color: "bg-purple-500" },
  { name: "Biochemistry", budget: 10000, color: "bg-amber-500" },
  { name: "Microbiology", budget:  9000, color: "bg-teal-500" },
];

const DARK_KEY = "aurex_analytics_dark";
const CHART_H  = 128;

// ---- Inline chart primitives (no external library) ----

function VerticalBars({
  data, isDark,
}: {
  data: { label: string; value: number }[];
  isDark: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (data.length === 0) {
    return (
      <div
        className="flex h-32 items-center justify-center text-sm"
        style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
      >
        No data for this period
      </div>
    );
  }
  return (
    <div
      className="flex items-end gap-1 overflow-x-auto pb-1"
      style={{ height: `${CHART_H + 40}px` }}
    >
      {data.map((d, i) => {
        const barH = d.value > 0 ? Math.max((d.value / max) * CHART_H, 3) : 0;
        return (
          <div
            key={i}
            className="flex min-w-[28px] flex-1 flex-col items-center"
            style={{ justifyContent: "flex-end", height: `${CHART_H + 40}px` }}
          >
            {d.value > 0 && (
              <span
                className="mb-0.5 text-[9px] leading-none"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                {d.value >= 1000 ? `$${(d.value / 1000).toFixed(1)}k` : `$${d.value.toFixed(0)}`}
              </span>
            )}
            <div
              className="w-full rounded-t-sm bg-aurex-blue transition-all"
              style={{ height: `${barH}px` }}
            />
            <span
              className="mt-1 w-full truncate text-center text-[9px]"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HorizBar({
  label, value, max, suffix, isDark,
}: {
  label: string; value: number; max: number; suffix?: string; isDark: boolean;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-32 shrink-0 truncate text-right text-xs"
        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
      >
        {label}
      </span>
      <div
        className="h-2 flex-1 rounded-full"
        style={{ background: isDark ? "rgba(255,255,255,0.1)" : "#f3f4f6" }}
      >
        <div
          className="h-2 rounded-full bg-aurex-blue transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="w-20 shrink-0 text-right text-xs font-medium"
        style={{ color: isDark ? "#d1d5db" : "#374151" }}
      >
        {suffix ?? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
      </span>
    </div>
  );
}

// ---- Main page ----

export default function AnalyticsPage() {
  const user = getStoredUser();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [budgets, setBudgets] = useState<BudgetDept[]>(DEFAULT_BUDGETS);
  const [isDark, setIsDark]   = useState(false);

  // Filters
  const [preset,     setPreset]     = useState<DatePreset>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      setOrders(raw ? JSON.parse(raw) : []);
    } catch { setOrders([]); }
    try {
      const raw = localStorage.getItem(BUDGETS_KEY);
      if (raw) setBudgets(JSON.parse(raw));
    } catch {}
    try {
      const saved = localStorage.getItem(DARK_KEY);
      if (saved !== null) setIsDark(saved === "true");
    } catch {}
  }, []);

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    try { localStorage.setItem(DARK_KEY, String(next)); } catch {}
  }

  if (!user) return null;
  if (user.role !== "super_admin" && user.role !== "finance_viewer") {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Analytics is restricted to Super Admin and Finance Viewer roles.
      </div>
    );
  }

  // ---- Data derivation ----

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filtered = useMemo(() => {
    let result = [...orders];
    const now = Date.now();
    if (preset === "7d")  result = result.filter((o) => +new Date(o.submittedAt) >= now - 7  * 86_400_000);
    if (preset === "30d") result = result.filter((o) => +new Date(o.submittedAt) >= now - 30 * 86_400_000);
    if (preset === "90d") result = result.filter((o) => +new Date(o.submittedAt) >= now - 90 * 86_400_000);
    if (preset === "custom") {
      if (customFrom) result = result.filter((o) => o.submittedAt >= customFrom + "T00:00:00");
      if (customTo)   result = result.filter((o) => o.submittedAt <= customTo   + "T23:59:59");
    }
    if (deptFilter !== "all") result = result.filter((o) => o.requester.department === deptFilter);
    if (userFilter !== "all") result = result.filter((o) => o.requester.email      === userFilter);
    return result;
  }, [orders, preset, customFrom, customTo, deptFilter, userFilter]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const approved = useMemo(() => filtered.filter((o) => o.status === "approved"), [filtered]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const totalSpend = useMemo(() => approved.reduce((s, o) => s + o.total, 0), [approved]);

  const approvalRate = filtered.length > 0 ? (approved.length / filtered.length) * 100 : 0;
  const avgOrder     = approved.length  > 0 ? totalSpend / approved.length : 0;

  // Dropdown options — from all orders (unfiltered)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const departments = useMemo(
    () => [...new Set(orders.map((o) => o.requester.department))].sort(),
    [orders],
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const orderUsers = useMemo(
    () =>
      [
        ...new Map(
          orders.map((o) => [o.requester.email, { email: o.requester.email, name: o.requester.name }]),
        ).values(),
      ].sort((a, b) => a.name.localeCompare(b.name)),
    [orders],
  );

  // Time-series chart
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const timeData = useMemo(() => {
    const gran = preset === "7d" ? "day" : preset === "30d" ? "week" : "month";
    const map  = new Map<string, { label: string; value: number }>();
    for (const o of filtered) {
      const date = new Date(o.submittedAt);
      let key: string, label: string;
      if (gran === "day") {
        key   = o.submittedAt.slice(0, 10);
        label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else if (gran === "week") {
        const d = new Date(date);
        d.setDate(d.getDate() - d.getDay());
        key   = d.toISOString().slice(0, 10);
        label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        key   = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        label = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      }
      const e = map.get(key) ?? { label, value: 0 };
      if (o.status === "approved") e.value += o.total;
      map.set(key, e);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => v);
  }, [filtered, preset]);

  // Dept spend
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deptSpend = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of approved) map.set(o.requester.department, (map.get(o.requester.department) ?? 0) + o.total);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
  }, [approved]);

  // Category spend
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const catSpend = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of approved)
      for (const item of o.items)
        map.set(item.product.category, (map.get(item.product.category) ?? 0) + item.product.price * item.qty);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
  }, [approved]);

  // Top products
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { topByQty, topBySpend } = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; spend: number }>();
    for (const o of approved)
      for (const item of o.items) {
        const e = map.get(item.product.sku) ?? { name: item.product.name, qty: 0, spend: 0 };
        e.qty   += item.qty;
        e.spend += item.product.price * item.qty;
        map.set(item.product.sku, e);
      }
    const products = [...map.values()];
    return {
      topByQty:   [...products].sort((a, b) => b.qty   - a.qty).slice(0, 5),
      topBySpend: [...products].sort((a, b) => b.spend - a.spend).slice(0, 5),
    };
  }, [approved]);

  // Budget utilisation
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const budgetUtil = useMemo(() => {
    const spendMap = new Map(deptSpend.map((d) => [d.label, d.value]));
    return budgets.map((b) => {
      const spent = spendMap.get(b.name) ?? 0;
      return { ...b, spent, pct: Math.min((spent / b.budget) * 100, 100) };
    });
  }, [budgets, deptSpend]);

  // Per-user spend
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const userSpend = useMemo(() => {
    const map = new Map<string, { name: string; dept: string; count: number; spend: number }>();
    for (const o of approved) {
      const e = map.get(o.requester.email) ?? { name: o.requester.name, dept: o.requester.department, count: 0, spend: 0 };
      e.count += 1;
      e.spend += o.total;
      map.set(o.requester.email, e);
    }
    return [...map.values()].sort((a, b) => b.spend - a.spend);
  }, [approved]);

  // Status breakdown
  const statusRows = [
    { label: "Approved",  count: filtered.filter((o) => o.status === "approved").length,  color: "bg-green-500"  },
    { label: "Pending",   count: filtered.filter((o) => o.status === "pending").length,   color: "bg-amber-500"  },
    { label: "Rejected",  count: filtered.filter((o) => o.status === "rejected").length,  color: "bg-red-500"    },
    { label: "Fulfilled", count: filtered.filter((o) => o.status === "fulfilled").length, color: "bg-blue-500"   },
    { label: "Shipped",   count: filtered.filter((o) => o.status === "shipped").length,   color: "bg-violet-500" },
    { label: "Delivered", count: filtered.filter((o) => o.status === "delivered").length, color: "bg-teal-500"   },
  ].filter((s) => s.count > 0);
  const totalStatusCount = statusRows.reduce((s, x) => s + x.count, 0);

  const hasFilters = preset !== "all" || customFrom || customTo || deptFilter !== "all" || userFilter !== "all";
  function clearFilters() {
    setPreset("all"); setCustomFrom(""); setCustomTo(""); setDeptFilter("all"); setUserFilter("all");
  }

  // ---- Theme tokens (fully independent of global dark mode) ----
  const t = {
    pageBg:      isDark ? "#0c0c13"                      : "#f9fafb",
    cardBg:      isDark ? "#1a1a2a"                      : "#ffffff",
    border:      isDark ? "rgba(255,255,255,0.10)"       : "#e5e7eb",
    sectionBr:   isDark ? "rgba(255,255,255,0.08)"       : "#f3f4f6",
    text:        isDark ? "#ffffff"                      : "#111827",
    subtext:     isDark ? "#9ca3af"                      : "#6b7280",
    muted:       isDark ? "#6b7280"                      : "#9ca3af",
    inputBg:     isDark ? "#131320"                      : "#ffffff",
    theadBg:     isDark ? "rgba(255,255,255,0.03)"       : "rgba(249,250,251,0.6)",
    rowHover:    isDark ? "rgba(255,255,255,0.03)"       : "rgba(249,250,251,0.5)",
    divider:     isDark ? "rgba(255,255,255,0.05)"       : "#f9fafb",
    progressBg:  isDark ? "rgba(255,255,255,0.10)"       : "#f3f4f6",
  };

  const selectCls = "rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-aurex-blue";

  return (
    <div style={{ background: t.pageBg, minHeight: "100%" }}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: t.text }}>Analytics</h1>
            <p className="mt-1 text-sm" style={{ color: t.subtext }}>
              Spend, orders, and budget insights · {filtered.length} orders in view
            </p>
          </div>
          <button
            onClick={toggleDark}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition hover:opacity-80"
            style={{ borderColor: t.border, color: t.subtext, background: t.cardBg }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border p-4" style={{ borderColor: t.border, background: t.cardBg }}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Date presets */}
            <div className="flex items-center gap-0.5 rounded-lg border p-0.5" style={{ borderColor: t.border }}>
              {(["7d", "30d", "90d", "all"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPreset(p); setCustomFrom(""); setCustomTo(""); }}
                  className="rounded-md px-2.5 py-1 text-xs font-medium transition"
                  style={{
                    background: preset === p ? "rgb(var(--color-aurex-blue))" : "transparent",
                    color:      preset === p ? "#fff" : t.subtext,
                  }}
                >
                  {p === "all" ? "All time" : p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
                </button>
              ))}
            </div>

            {/* Custom date range */}
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5"
                style={{ borderColor: t.border, background: t.inputBg }}
              >
                <Calendar size={12} style={{ color: t.muted }} />
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => { setCustomFrom(e.target.value); setPreset("custom"); }}
                  className="bg-transparent text-xs focus:outline-none"
                  style={{ color: t.text }}
                />
              </div>
              <span className="text-xs" style={{ color: t.muted }}>–</span>
              <div
                className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5"
                style={{ borderColor: t.border, background: t.inputBg }}
              >
                <Calendar size={12} style={{ color: t.muted }} />
                <input
                  type="date"
                  value={customTo}
                  min={customFrom || undefined}
                  onChange={(e) => { setCustomTo(e.target.value); setPreset("custom"); }}
                  className="bg-transparent text-xs focus:outline-none"
                  style={{ color: t.text }}
                />
              </div>
            </div>

            {/* Department filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className={selectCls}
              style={{ borderColor: t.border, background: t.inputBg, color: t.text }}
            >
              <option value="all">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* User filter */}
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className={selectCls}
              style={{ borderColor: t.border, background: t.inputBg, color: t.text }}
            >
              <option value="all">All Users</option>
              {orderUsers.map((u) => <option key={u.email} value={u.email}>{u.name}</option>)}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs transition hover:opacity-80"
                style={{ borderColor: t.border, color: t.subtext }}
              >
                <X size={11} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Spend (Approved)", value: `$${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign,    accent: "#f97316" },
            { label: "Total Orders",           value: String(filtered.length),                                                   icon: ShoppingCart,  accent: "#3b82f6" },
            { label: "Approval Rate",          value: `${approvalRate.toFixed(0)}%`,                                             icon: CheckCircle2,  accent: "#10b981" },
            { label: "Avg Order Value",        value: `$${avgOrder.toFixed(0)}`,                                                 icon: TrendingUp,    accent: "#8b5cf6" },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className="rounded-xl border p-4 shadow-sm"
              style={{ borderColor: t.border, background: t.cardBg }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${accent}1a` }}
                >
                  <Icon size={16} style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-xs leading-tight" style={{ color: t.subtext }}>{label}</p>
                  <p className="mt-1 text-2xl font-bold" style={{ color: t.text }}>{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spend over time + Status breakdown */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
            <h2 className="mb-4 text-sm font-semibold" style={{ color: t.text }}>
              Spend Over Time
              <span className="ml-1.5 text-xs font-normal" style={{ color: t.muted }}>
                {preset === "7d" ? "(daily)" : preset === "30d" ? "(weekly)" : "(monthly)"}
              </span>
            </h2>
            <VerticalBars data={timeData} isDark={isDark} />
          </div>

          <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
            <h2 className="mb-4 text-sm font-semibold" style={{ color: t.text }}>Order Status Breakdown</h2>
            {statusRows.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm" style={{ color: t.muted }}>
                No orders
              </div>
            ) : (
              <div className="space-y-3">
                {statusRows.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.color}`} />
                    <span className="w-20 text-xs" style={{ color: t.subtext }}>{s.label}</span>
                    <div className="h-2 flex-1 rounded-full" style={{ background: t.progressBg }}>
                      <div
                        className={`h-2 rounded-full transition-all ${s.color}`}
                        style={{ width: `${totalStatusCount > 0 ? (s.count / totalStatusCount) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-medium" style={{ color: t.text }}>{s.count}</span>
                    <span className="w-10 text-right text-xs" style={{ color: t.muted }}>
                      {totalStatusCount > 0 ? ((s.count / totalStatusCount) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spend by dept + category */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
            <h2 className="mb-4 text-sm font-semibold" style={{ color: t.text }}>Spend by Department</h2>
            {deptSpend.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-sm" style={{ color: t.muted }}>
                No approved orders
              </div>
            ) : (
              <div className="space-y-2.5">
                {deptSpend.map((d) => (
                  <HorizBar key={d.label} label={d.label} value={d.value} max={deptSpend[0].value} isDark={isDark} />
                ))}
              </div>
            )}
            {deptSpend.length > 0 && (
              <div
                className="mt-4 overflow-x-auto rounded-lg border"
                style={{ borderColor: t.sectionBr }}
              >
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.sectionBr}`, background: t.theadBg }}>
                      {["Department", "Orders", "Spend"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: t.muted }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {deptSpend.map((d, i) => {
                      const orderCount = approved.filter((o) => o.requester.department === d.label).length;
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${t.divider}` }}>
                          <td className="px-3 py-2" style={{ color: t.text }}>{d.label}</td>
                          <td className="px-3 py-2" style={{ color: t.subtext }}>{orderCount}</td>
                          <td className="px-3 py-2 font-medium" style={{ color: t.text }}>
                            ${d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
            <h2 className="mb-4 text-sm font-semibold" style={{ color: t.text }}>Spend by Product Category</h2>
            {catSpend.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-sm" style={{ color: t.muted }}>
                No approved orders
              </div>
            ) : (
              <div className="space-y-2.5">
                {catSpend.map((d) => (
                  <HorizBar key={d.label} label={d.label} value={d.value} max={catSpend[0].value} isDark={isDark} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
            <h2 className="mb-4 text-sm font-semibold" style={{ color: t.text }}>Top Products by Quantity</h2>
            {topByQty.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-sm" style={{ color: t.muted }}>No approved orders</div>
            ) : (
              <div className="space-y-2.5">
                {topByQty.map((p) => (
                  <HorizBar key={p.name} label={p.name} value={p.qty} max={topByQty[0].qty} suffix={`${p.qty} units`} isDark={isDark} />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
            <h2 className="mb-4 text-sm font-semibold" style={{ color: t.text }}>Top Products by Spend</h2>
            {topBySpend.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-sm" style={{ color: t.muted }}>No approved orders</div>
            ) : (
              <div className="space-y-2.5">
                {topBySpend.map((p) => (
                  <HorizBar key={p.name} label={p.name} value={p.spend} max={topBySpend[0].spend} isDark={isDark} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Budget utilisation */}
        <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
          <h2 className="mb-5 text-sm font-semibold" style={{ color: t.text }}>Budget Utilisation per Department</h2>
          <div className="space-y-4">
            {budgetUtil.map((b) => {
              const barColor = b.pct >= 90 ? "bg-red-500" : b.pct >= 80 ? "bg-amber-500" : b.color;
              return (
                <div key={b.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: t.text }}>{b.name}</span>
                    <span className="text-xs" style={{ color: t.subtext }}>
                      ${b.spent.toLocaleString()} / ${b.budget.toLocaleString()} · {b.pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: t.progressBg }}>
                    <div className={`h-2.5 rounded-full transition-all ${barColor}`} style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-user spend */}
        <div
          className="overflow-hidden rounded-xl border shadow-sm"
          style={{ borderColor: t.border, background: t.cardBg }}
        >
          <div className="border-b px-5 py-4" style={{ borderColor: t.sectionBr }}>
            <h2 className="text-sm font-semibold" style={{ color: t.text }}>Per-User Spend Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.sectionBr}`, background: t.theadBg }}>
                  {["User", "Department", "Orders", "Total Spend"].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold"
                      style={{ color: t.muted }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userSpend.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm" style={{ color: t.muted }}>
                      No approved orders in this period
                    </td>
                  </tr>
                ) : (
                  userSpend.map((u, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.divider}` }}>
                      <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{u.name}</td>
                      <td className="px-5 py-3"              style={{ color: t.subtext }}>{u.dept}</td>
                      <td className="px-5 py-3"              style={{ color: t.subtext }}>{u.count}</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: t.text }}>
                        ${u.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
