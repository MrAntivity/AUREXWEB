"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, DollarSign, ShoppingCart, CheckCircle2,
  Sun, Moon, X, Calendar, FlaskConical, LayoutGrid, Layers,
  ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import { ORDERS_KEY, BUDGETS_KEY } from "@/lib/store";
import type { Order } from "@/lib/store";
import { getStoredUser } from "@/lib/mock-auth";

type DatePreset = "7d" | "30d" | "90d" | "all" | "custom";
type ViewMode = "standard" | "advanced";
type BudgetDept = { name: string; budget: number; color: string };

const DEFAULT_BUDGETS: BudgetDept[] = [
  { name: "Chemistry",    budget: 15000, color: "bg-blue-500" },
  { name: "Biology",      budget: 12000, color: "bg-green-500" },
  { name: "Physics",      budget:  8000, color: "bg-purple-500" },
  { name: "Biochemistry", budget: 10000, color: "bg-amber-500" },
  { name: "Microbiology", budget:  9000, color: "bg-teal-500" },
];

const DARK_KEY = "aurex_analytics_dark";
const VIEW_KEY = "aurex_analytics_view";
const CHART_H  = 128;

// ---- Chart primitives ----

function VerticalBars({
  data, isDark, color = "bg-aurex-blue", labelFn,
}: {
  data: { label: string; value: number }[];
  isDark: boolean;
  color?: string;
  labelFn?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
        No data for this period
      </div>
    );
  }
  const fmt = labelFn ?? ((v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`);
  return (
    <div className="flex items-end gap-1 overflow-x-auto pb-1" style={{ height: `${CHART_H + 40}px` }}>
      {data.map((d, i) => {
        const barH = d.value > 0 ? Math.max((d.value / max) * CHART_H, 3) : 0;
        return (
          <div
            key={i}
            className="flex min-w-[28px] flex-1 flex-col items-center"
            style={{ justifyContent: "flex-end", height: `${CHART_H + 40}px` }}
          >
            {d.value > 0 && (
              <span className="mb-0.5 text-[9px] leading-none" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                {fmt(d.value)}
              </span>
            )}
            <div className={`w-full rounded-t-sm ${color} transition-all`} style={{ height: `${barH}px` }} />
            <span className="mt-1 w-full truncate text-center text-[9px]" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HorizBar({ label, value, max, suffix, isDark, color = "bg-aurex-blue" }: {
  label: string; value: number; max: number; suffix?: string; isDark: boolean; color?: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 truncate text-right text-xs" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
        {label}
      </span>
      <div className="h-2 flex-1 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.1)" : "#f3f4f6" }}>
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-20 shrink-0 text-right text-xs font-medium" style={{ color: isDark ? "#d1d5db" : "#374151" }}>
        {suffix ?? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
      </span>
    </div>
  );
}

// ---- Main page ----

export default function AnalyticsStandalonePage() {
  const router = useRouter();

  // All state hooks first (no conditional hooks below)
  const [user, setUser] = useState<ReturnType<typeof getStoredUser> | undefined>(undefined);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [budgets, setBudgets]   = useState<BudgetDept[]>(DEFAULT_BUDGETS);
  const [isDark, setIsDark]     = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const [preset, setPreset]     = useState<DatePreset>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored ?? null);
    if (!stored) { router.replace("/portal/sign-in"); return; }
    if (stored.role !== "super_admin" && stored.role !== "finance_viewer") {
      router.replace("/portal/dashboard"); return;
    }
    try { const r = localStorage.getItem(ORDERS_KEY);  setOrders(r ? JSON.parse(r) : []); } catch { setOrders([]); }
    try { const r = localStorage.getItem(BUDGETS_KEY); if (r) setBudgets(JSON.parse(r)); } catch {}
    try { const s = localStorage.getItem(DARK_KEY);    if (s !== null) setIsDark(s === "true"); } catch {}
    try {
      const s = localStorage.getItem(VIEW_KEY);
      if (s === "standard" || s === "advanced") setViewMode(s);
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    try { localStorage.setItem(DARK_KEY, String(next)); } catch {}
  }

  function setView(mode: ViewMode) {
    setViewMode(mode);
    try { localStorage.setItem(VIEW_KEY, mode); } catch {}
  }

  // ---- Data derivation (all memos before conditional return) ----

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

  const prevFiltered = useMemo(() => {
    if (preset !== "7d" && preset !== "30d" && preset !== "90d") return [];
    const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
    const now = Date.now();
    return orders
      .filter((o) => {
        const t = +new Date(o.submittedAt);
        return t >= now - days * 2 * 86_400_000 && t < now - days * 86_400_000;
      })
      .filter((o) => deptFilter === "all" || o.requester.department === deptFilter)
      .filter((o) => userFilter === "all" || o.requester.email      === userFilter);
  }, [orders, preset, deptFilter, userFilter]);

  const approved     = useMemo(() => filtered.filter((o) => o.status === "approved"),     [filtered]);
  const prevApproved = useMemo(() => prevFiltered.filter((o) => o.status === "approved"), [prevFiltered]);

  const totalSpend     = useMemo(() => approved.reduce((s, o) => s + o.total, 0),     [approved]);
  const prevTotalSpend = useMemo(() => prevApproved.reduce((s, o) => s + o.total, 0), [prevApproved]);

  const approvalRate = filtered.length > 0 ? (approved.length / filtered.length) * 100 : 0;
  const avgOrder     = approved.length  > 0 ? totalSpend / approved.length : 0;

  const departments = useMemo(
    () => [...new Set(orders.map((o) => o.requester.department))].sort(),
    [orders],
  );
  const orderUsers = useMemo(
    () =>
      [...new Map(orders.map((o) => [o.requester.email, { email: o.requester.email, name: o.requester.name }])).values()]
        .sort((a, b) => a.name.localeCompare(b.name)),
    [orders],
  );

  const gran = preset === "7d" ? "day" : preset === "30d" ? "week" : "month";

  function bucketOrders(src: Order[], valueOf: (o: Order) => number) {
    const map = new Map<string, { label: string; value: number }>();
    for (const o of src) {
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
      e.value += valueOf(o);
      map.set(key, e);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => v);
  }

  const timeData   = useMemo(() => bucketOrders(filtered,  (o) => o.status === "approved" ? o.total : 0), [filtered, gran]); // eslint-disable-line react-hooks/exhaustive-deps
  const volumeData = useMemo(() => bucketOrders(filtered,  () => 1),                                       [filtered, gran]); // eslint-disable-line react-hooks/exhaustive-deps

  const deptSpend = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of approved) map.set(o.requester.department, (map.get(o.requester.department) ?? 0) + o.total);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
  }, [approved]);

  const catSpend = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of approved)
      for (const item of o.items)
        map.set(item.product.category, (map.get(item.product.category) ?? 0) + item.product.price * item.qty);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
  }, [approved]);

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

  const budgetUtil = useMemo(() => {
    const spendMap = new Map(deptSpend.map((d) => [d.label, d.value]));
    return budgets.map((b) => {
      const spent = spendMap.get(b.name) ?? 0;
      return { ...b, spent, pct: Math.min((spent / b.budget) * 100, 100) };
    });
  }, [budgets, deptSpend]);

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
  const spendChange = prevTotalSpend > 0 ? ((totalSpend - prevTotalSpend) / prevTotalSpend) * 100 : null;

  function clearFilters() {
    setPreset("all"); setCustomFrom(""); setCustomTo(""); setDeptFilter("all"); setUserFilter("all");
  }

  // ---- Theme tokens ----
  const t = {
    pageBg:     isDark ? "#0c0c13"                : "#f4f6f9",
    headerBg:   isDark ? "#131320"                : "#ffffff",
    cardBg:     isDark ? "#1a1a2a"                : "#ffffff",
    border:     isDark ? "rgba(255,255,255,0.10)" : "#e5e7eb",
    sectionBr:  isDark ? "rgba(255,255,255,0.08)" : "#f3f4f6",
    text:       isDark ? "#ffffff"                : "#111827",
    subtext:    isDark ? "#9ca3af"                : "#6b7280",
    muted:      isDark ? "#6b7280"                : "#9ca3af",
    inputBg:    isDark ? "#0c0c13"                : "#ffffff",
    theadBg:    isDark ? "rgba(255,255,255,0.03)" : "rgba(249,250,251,0.6)",
    divider:    isDark ? "rgba(255,255,255,0.05)" : "#f9fafb",
    progressBg: isDark ? "rgba(255,255,255,0.10)" : "#f3f4f6",
  };

  const selectCls = `rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-aurex-blue`;

  if (user === undefined) return null;

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh" }}>

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-10 border-b" style={{ borderColor: t.border, background: t.headerBg }}>
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-6 py-3">
          <FlaskConical size={16} className="text-aurex-blue shrink-0" />
          <span className="text-sm font-bold" style={{ color: t.text }}>Aurex Medical</span>
          <span style={{ color: t.muted }}>·</span>
          <span className="text-sm font-semibold" style={{ color: t.subtext }}>Analytics</span>

          <div className="flex-1" />

          {/* View mode toggle */}
          <div className="flex items-center gap-0.5 rounded-lg border p-0.5" style={{ borderColor: t.border }}>
            <button
              onClick={() => setView("standard")}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition"
              style={{
                background: viewMode === "standard" ? (isDark ? "rgba(59,130,246,0.2)" : "#eff6ff") : "transparent",
                color:      viewMode === "standard" ? (isDark ? "#60a5fa" : "#2563eb") : t.subtext,
              }}
            >
              <LayoutGrid size={12} /> Standard
            </button>
            <button
              onClick={() => setView("advanced")}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition"
              style={{
                background: viewMode === "advanced" ? (isDark ? "rgba(139,92,246,0.2)" : "#f5f3ff") : "transparent",
                color:      viewMode === "advanced" ? (isDark ? "#a78bfa" : "#7c3aed") : t.subtext,
              }}
            >
              <Layers size={12} /> Advanced
            </button>
          </div>

          {/* Dark mode */}
          <button
            onClick={toggleDark}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition hover:opacity-80"
            style={{ borderColor: t.border, color: t.subtext, background: t.cardBg }}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            {isDark ? "Light" : "Dark"}
          </button>

          {/* Back to portal */}
          <a
            href="/portal/dashboard"
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
            style={{ borderColor: t.border, color: t.subtext, background: t.cardBg }}
          >
            ← Portal
          </a>
        </div>

        {/* Filters sub-bar */}
        <div className="border-t px-6 py-2.5" style={{ borderColor: t.sectionBr }}>
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3">
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

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ borderColor: t.border, background: t.inputBg }}>
                <Calendar size={11} style={{ color: t.muted }} />
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => { setCustomFrom(e.target.value); setPreset("custom"); }}
                  className="bg-transparent text-xs focus:outline-none"
                  style={{ color: t.text }}
                />
              </div>
              <span className="text-xs" style={{ color: t.muted }}>–</span>
              <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ borderColor: t.border, background: t.inputBg }}>
                <Calendar size={11} style={{ color: t.muted }} />
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

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className={selectCls}
              style={{ borderColor: t.border, background: t.inputBg, color: t.text }}
            >
              <option value="all">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

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
                <X size={11} /> Clear
              </button>
            )}

            <span className="ml-auto text-xs" style={{ color: t.muted }}>
              {filtered.length} orders in view
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-[1400px] space-y-5 px-6 py-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {([
            { label: "Total Spend (Approved)", value: `$${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign,   accent: "#f97316", showDelta: true },
            { label: "Total Orders",           value: String(filtered.length),                                                  icon: ShoppingCart, accent: "#3b82f6", showDelta: false },
            { label: "Approval Rate",          value: `${approvalRate.toFixed(0)}%`,                                            icon: CheckCircle2, accent: "#10b981", showDelta: false },
            { label: "Avg Order Value",        value: `$${avgOrder.toFixed(0)}`,                                                icon: TrendingUp,   accent: "#8b5cf6", showDelta: false },
          ] as const).map(({ label, value, icon: Icon, accent, showDelta }) => (
            <div key={label} className="rounded-xl border p-4 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${accent}1a` }}>
                  <Icon size={16} style={{ color: accent }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs leading-tight" style={{ color: t.subtext }}>{label}</p>
                  <p className="mt-1 text-2xl font-bold" style={{ color: t.text }}>{value}</p>
                  {showDelta && viewMode === "advanced" && spendChange !== null && (
                    <div className="mt-1 flex items-center gap-0.5">
                      {spendChange > 0 ? (
                        <ArrowUpRight size={11} className="text-red-400" />
                      ) : spendChange < 0 ? (
                        <ArrowDownRight size={11} className="text-green-400" />
                      ) : (
                        <Minus size={11} style={{ color: t.muted }} />
                      )}
                      <span
                        className={`text-[10px] font-medium ${spendChange > 0 ? "text-red-400" : spendChange < 0 ? "text-green-400" : ""}`}
                        style={spendChange === 0 ? { color: t.muted } : undefined}
                      >
                        {Math.abs(spendChange).toFixed(0)}% vs prev period
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spend Over Time + Status Breakdown */}
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
              <div className="flex h-32 items-center justify-center text-sm" style={{ color: t.muted }}>No orders</div>
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

        {/* Budget Utilization */}
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

        {/* Top Products */}
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

        {/* ── Advanced-only sections ── */}
        {viewMode === "advanced" && (
          <>
            {/* Section divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1" style={{ background: t.border }} />
              <span
                className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                style={{ borderColor: t.border, color: t.subtext, background: t.cardBg }}
              >
                <Layers size={11} /> Advanced Analysis
              </span>
              <div className="h-px flex-1" style={{ background: t.border }} />
            </div>

            {/* Order Volume Over Time */}
            <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
              <h2 className="mb-1 text-sm font-semibold" style={{ color: t.text }}>
                Order Volume Over Time
                <span className="ml-1.5 text-xs font-normal" style={{ color: t.muted }}>
                  {preset === "7d" ? "(daily)" : preset === "30d" ? "(weekly)" : "(monthly)"}
                </span>
              </h2>
              <p className="mb-4 text-xs" style={{ color: t.muted }}>Total orders submitted, all statuses</p>
              <VerticalBars
                data={volumeData}
                isDark={isDark}
                color="bg-violet-500"
                labelFn={(v) => String(v)}
              />
            </div>

            {/* Dept spend + Category spend */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
                <h2 className="mb-4 text-sm font-semibold" style={{ color: t.text }}>Spend by Department</h2>
                {deptSpend.length === 0 ? (
                  <div className="flex h-24 items-center justify-center text-sm" style={{ color: t.muted }}>No approved orders</div>
                ) : (
                  <>
                    <div className="mb-4 space-y-2.5">
                      {deptSpend.map((d) => (
                        <HorizBar key={d.label} label={d.label} value={d.value} max={deptSpend[0].value} isDark={isDark} />
                      ))}
                    </div>
                    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: t.sectionBr }}>
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
                  </>
                )}
              </div>

              <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
                <h2 className="mb-4 text-sm font-semibold" style={{ color: t.text }}>Spend by Product Category</h2>
                {catSpend.length === 0 ? (
                  <div className="flex h-24 items-center justify-center text-sm" style={{ color: t.muted }}>No approved orders</div>
                ) : (
                  <div className="space-y-2.5">
                    {catSpend.map((d) => (
                      <HorizBar key={d.label} label={d.label} value={d.value} max={catSpend[0].value} isDark={isDark} color="bg-teal-500" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Per-User Spend Table */}
            <div className="overflow-hidden rounded-xl border shadow-sm" style={{ borderColor: t.border, background: t.cardBg }}>
              <div className="border-b px-5 py-4" style={{ borderColor: t.sectionBr }}>
                <h2 className="text-sm font-semibold" style={{ color: t.text }}>Per-User Spend Summary</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.sectionBr}`, background: t.theadBg }}>
                      {["User", "Department", "Orders", "Total Spend", "Avg per Order"].map((h) => (
                        <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold" style={{ color: t.muted }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userSpend.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm" style={{ color: t.muted }}>
                          No approved orders in this period
                        </td>
                      </tr>
                    ) : (
                      userSpend.map((u, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${t.divider}` }}>
                          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{u.name}</td>
                          <td className="px-5 py-3" style={{ color: t.subtext }}>{u.dept}</td>
                          <td className="px-5 py-3" style={{ color: t.subtext }}>{u.count}</td>
                          <td className="px-5 py-3 font-semibold" style={{ color: t.text }}>
                            ${u.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-3" style={{ color: t.subtext }}>
                            ${(u.spend / u.count).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="pb-8 text-center">
          <p className="text-xs" style={{ color: t.muted }}>
            Aurex Medical Analytics · Data sourced from your active portal session
          </p>
        </div>
      </div>
    </div>
  );
}
