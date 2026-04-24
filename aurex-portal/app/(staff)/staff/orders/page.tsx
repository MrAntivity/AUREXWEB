"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search, ChevronDown, ChevronUp, Package,
  CheckCircle2, Truck, MapPin, User, Clock, X,
} from "lucide-react";
import type { Order, OrderEvent } from "@/lib/store";
import { ORDERS_KEY } from "@/lib/store";
import { getStoredStaffUser } from "@/lib/staff-auth";
import { addAuditEntry } from "@/lib/audit-log";

type FilterStatus = "all" | "pending" | "approved" | "fulfilled" | "shipped" | "delivered" | "rejected";

const statusStyle: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  approved:  "bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20",
  rejected:  "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  fulfilled: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  shipped:   "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20",
  delivered: "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:ring-teal-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", approved: "Approved", rejected: "Rejected",
  fulfilled: "Fulfilled", shipped: "Shipped", delivered: "Delivered",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function OrderDetail({ order, onUpdate }: { order: Order; onUpdate: (updated: Order) => void }) {
  const [trackingInput, setTrackingInput] = useState(order.trackingCode ?? "");

  function applyUpdate(updates: Partial<Order> & { newEvent: OrderEvent }) {
    const staffUser = getStoredStaffUser();
    if (!staffUser) return;
    const { newEvent, ...rest } = updates;
    const updated: Order = { ...order, ...rest, timeline: [...(order.timeline ?? []), newEvent] };
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const all: Order[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(all.map((o) => (o.id === order.id ? updated : o))));
    } catch { /* ignore */ }
    addAuditEntry({
      userName: staffUser.name, userEmail: staffUser.email,
      action: "order_status_changed", target: order.requestNumber,
      details: `${staffUser.name} marked ${order.requestNumber} as ${updates.status ?? newEvent.stage}`,
    });
    onUpdate(updated);
  }

  function handleFulfill() {
    const s = getStoredStaffUser();
    if (!s) return;
    applyUpdate({ status: "fulfilled", newEvent: { stage: "fulfilled", by: s.name, at: new Date().toISOString() } });
  }

  function handleShip() {
    const s = getStoredStaffUser();
    if (!s || !trackingInput.trim()) return;
    applyUpdate({ status: "shipped", trackingCode: trackingInput.trim(), newEvent: { stage: "shipped", by: s.name, at: new Date().toISOString() } });
  }

  function handleDeliver() {
    const s = getStoredStaffUser();
    if (!s) return;
    applyUpdate({ status: "delivered", newEvent: { stage: "delivered", by: s.name, at: new Date().toISOString() } });
  }

  const timeline = order.timeline ?? [];

  return (
    <div className="space-y-5 bg-gray-50/60 px-6 py-5 dark:bg-white/3">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { Icon: User,    label: "Requester",  main: order.requester.name,            sub: order.requester.email },
          { Icon: Package, label: "Department", main: order.requester.department ?? "—", sub: null },
          { Icon: MapPin,  label: "Location",   main: order.requester.location ?? "—",  sub: null },
          { Icon: Clock,   label: "Submitted",  main: fmtDate(order.submittedAt),       sub: null },
        ].map(({ Icon, label, main, sub }) => (
          <div key={label} className="flex items-start gap-2">
            <Icon size={13} className="mt-0.5 shrink-0 text-gray-400" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{main}</p>
              {sub && <p className="text-xs text-gray-400">{sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Order Items</p>
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white dark:divide-white/5 dark:border-white/8 dark:bg-[#1a1a2a]">
          {order.items.map((item) => (
            <div key={item.product.sku} className="flex items-center justify-between px-4 py-2.5">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                <p className="text-xs text-gray-400">{item.product.sku} · {item.product.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">${(item.product.price * item.qty).toFixed(2)}</p>
                <p className="text-xs text-gray-400">Qty {item.qty} × ${item.product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {order.status === "approved" && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/10">
          <CheckCircle2 size={14} className="shrink-0 text-blue-500" />
          <p className="flex-1 text-xs text-blue-700 dark:text-blue-300">Order approved. Mark as fulfilled once items are prepared.</p>
          <button onClick={handleFulfill} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700">
            Mark Fulfilled
          </button>
        </div>
      )}

      {order.status === "fulfilled" && (
        <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3 dark:border-violet-500/20 dark:bg-violet-500/10">
          <Truck size={14} className="shrink-0 text-violet-500" />
          <div className="flex flex-1 items-center gap-2">
            <p className="shrink-0 text-xs text-violet-700 dark:text-violet-300">Tracking:</p>
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
              className="flex-1 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white"
            />
          </div>
          <button
            onClick={handleShip}
            disabled={!trackingInput.trim()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Shipped
          </button>
        </div>
      )}

      {order.status === "shipped" && (
        <div className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 dark:border-teal-500/20 dark:bg-teal-500/10">
          <Truck size={14} className="shrink-0 text-teal-500" />
          <p className="flex-1 text-xs text-teal-700 dark:text-teal-300">
            Shipped — tracking <span className="font-mono font-semibold">{order.trackingCode}</span>. Mark delivered once confirmed.
          </p>
          <button onClick={handleDeliver} className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700">
            Mark Delivered
          </button>
        </div>
      )}

      {order.status === "delivered" && (
        <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 dark:border-teal-500/20 dark:bg-teal-500/10">
          <CheckCircle2 size={14} className="text-teal-600 dark:text-teal-400" />
          <p className="text-xs font-medium text-teal-700 dark:text-teal-300">Order delivered.</p>
          {order.trackingCode && <span className="font-mono text-xs text-teal-600 dark:text-teal-400">{order.trackingCode}</span>}
        </div>
      )}

      {timeline.length > 0 && (
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Timeline</p>
          <div className="space-y-2">
            {[...timeline].reverse().map((event, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="font-semibold capitalize text-gray-700 dark:text-gray-300">{event.stage}</span>
                <span className="text-gray-400">by {event.by}</span>
                {event.notes && <span className="italic text-gray-400">&ldquo;{event.notes}&rdquo;</span>}
                <span className="ml-auto shrink-0 text-gray-400">{fmt(event.at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      setOrders(raw ? JSON.parse(raw) : []);
    } catch { setOrders([]); }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  function handleOrderUpdate(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      const matchSearch = !q || o.requestNumber.toLowerCase().includes(q) || o.requester.name.toLowerCase().includes(q) || o.requester.email.toLowerCase().includes(q) || (o.requester.location ?? "").toLowerCase().includes(q) || o.items.some((i) => i.product.name.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, search, filterStatus]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const statCards = [
    { key: "pending",   label: "Pending",   light: "text-amber-600 bg-amber-50",   dark: "dark:text-amber-400 dark:bg-amber-500/10" },
    { key: "approved",  label: "Approved",  light: "text-green-600 bg-green-50",   dark: "dark:text-green-400 dark:bg-green-500/10" },
    { key: "fulfilled", label: "Fulfilled", light: "text-blue-600 bg-blue-50",     dark: "dark:text-blue-400 dark:bg-blue-500/10" },
    { key: "shipped",   label: "Shipped",   light: "text-violet-600 bg-violet-50", dark: "dark:text-violet-400 dark:bg-violet-500/10" },
    { key: "delivered", label: "Delivered", light: "text-teal-600 bg-teal-50",     dark: "dark:text-teal-400 dark:bg-teal-500/10" },
  ] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Orders</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{orders.length} total orders from the user portal</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {statCards.map(({ key, label, light, dark }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={`rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#1a1a2a] ${filterStatus === key ? "ring-2 ring-aurex-blue" : ""}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${light.split(" ")[0]} ${dark.split(" ")[0]}`}>{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{counts[key] ?? 0}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search order, requester, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white dark:placeholder-gray-600"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="rejected">Rejected</option>
        </select>
        {(search || filterStatus !== "all") && (
          <button
            onClick={() => { setSearch(""); setFilterStatus("all"); }}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-gray-500 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
        <p className="text-sm text-gray-400">{filtered.length} shown</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
          <Package size={36} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
          <p className="text-sm text-gray-400">No orders yet. Orders placed in the user portal will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-white/8 dark:bg-white/3">
                  {["Request ID", "Requester", "Location", "Items", "Total", "Status", "Date", ""].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filtered.map((o) => (
                  <>
                    <tr
                      key={o.id}
                      className="group cursor-pointer transition-colors hover:bg-gray-50/50 dark:hover:bg-white/3"
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{o.requestNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{o.requester.name}</p>
                        <p className="text-xs text-gray-400">{o.requester.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{o.requester.location ?? o.requester.department ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {o.items[0]?.product.name}
                        {o.items.length > 1 && <span className="ml-1 text-gray-400">+{o.items.length - 1}</span>}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">${o.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle[o.status] ?? ""}`}>
                          {STATUS_LABELS[o.status] ?? o.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">{fmtDate(o.submittedAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpanded(expanded === o.id ? null : o.id); }}
                          className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {expanded === o.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr key={`${o.id}-detail`}>
                        <td colSpan={8} className="p-0">
                          <OrderDetail order={o} onUpdate={handleOrderUpdate} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">No orders match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
