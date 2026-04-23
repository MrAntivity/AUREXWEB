"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import type { Order, OrderEvent } from "@/lib/store";
import { ORDERS_KEY } from "@/lib/store";
import { getStoredStaffUser } from "@/lib/staff-auth";
import { addAuditEntry } from "@/lib/audit-log";

type FilterStatus = "all" | "pending" | "approved" | "fulfilled" | "shipped" | "delivered" | "rejected";

const statusStyle: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 ring-amber-200",
  approved:  "bg-green-50 text-green-700 ring-green-200",
  rejected:  "bg-red-50 text-red-700 ring-red-200",
  fulfilled: "bg-blue-50 text-blue-700 ring-blue-200",
  shipped:   "bg-violet-50 text-violet-700 ring-violet-200",
  delivered: "bg-teal-50 text-teal-700 ring-teal-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "Pending",
  approved:  "Approved",
  rejected:  "Rejected",
  fulfilled: "Fulfilled",
  shipped:   "Shipped",
  delivered: "Delivered",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OrderDetail({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (updated: Order) => void;
}) {
  const [trackingInput, setTrackingInput] = useState(order.trackingCode ?? "");

  function applyUpdate(updates: Partial<Order> & { newEvent: OrderEvent }) {
    const staffUser = getStoredStaffUser();
    if (!staffUser) return;

    const { newEvent, ...rest } = updates;
    const updated: Order = {
      ...order,
      ...rest,
      timeline: [...(order.timeline ?? []), newEvent],
    };

    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const all: Order[] = raw ? JSON.parse(raw) : [];
      const next = all.map((o) => (o.id === order.id ? updated : o));
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    } catch { /* ignore */ }

    addAuditEntry({
      userName: staffUser.name,
      userEmail: staffUser.email,
      action: "order_status_changed",
      target: order.requestNumber,
      details: `${staffUser.name} marked ${order.requestNumber} as ${updates.status ?? newEvent.stage}`,
    });

    onUpdate(updated);
  }

  function handleFulfill() {
    const staffUser = getStoredStaffUser();
    if (!staffUser) return;
    applyUpdate({
      status: "fulfilled",
      newEvent: { stage: "fulfilled", by: staffUser.name, at: new Date().toISOString() },
    });
  }

  function handleShip() {
    const staffUser = getStoredStaffUser();
    if (!staffUser || !trackingInput.trim()) return;
    applyUpdate({
      status: "shipped",
      trackingCode: trackingInput.trim(),
      newEvent: { stage: "shipped", by: staffUser.name, at: new Date().toISOString() },
    });
  }

  function handleDeliver() {
    const staffUser = getStoredStaffUser();
    if (!staffUser) return;
    applyUpdate({
      status: "delivered",
      newEvent: { stage: "delivered", by: staffUser.name, at: new Date().toISOString() },
    });
  }

  const timeline = order.timeline ?? [];

  return (
    <div className="space-y-5 bg-gray-50/60 px-6 py-5">
      {/* Requester info */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-start gap-2">
          <User size={13} className="mt-0.5 shrink-0 text-gray-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Requester</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">{order.requester.name}</p>
            <p className="text-xs text-gray-400">{order.requester.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Package size={13} className="mt-0.5 shrink-0 text-gray-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Department</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">{order.requester.department ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={13} className="mt-0.5 shrink-0 text-gray-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Location</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">{order.requester.location ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock size={13} className="mt-0.5 shrink-0 text-gray-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Submitted</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">{fmtDate(order.submittedAt)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Order Items</p>
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
          {order.items.map((item) => (
            <div key={item.product.sku} className="flex items-center justify-between px-4 py-2.5">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                <p className="text-xs text-gray-400">{item.product.sku} · {item.product.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">${(item.product.price * item.qty).toFixed(2)}</p>
                <p className="text-xs text-gray-400">Qty {item.qty} × ${item.product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons based on status */}
      {order.status === "approved" && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <CheckCircle2 size={14} className="shrink-0 text-blue-500" />
          <p className="flex-1 text-xs text-blue-700">
            This order has been approved. Mark it as fulfilled once the items have been prepared.
          </p>
          <button
            onClick={handleFulfill}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Mark Fulfilled
          </button>
        </div>
      )}

      {order.status === "fulfilled" && (
        <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
          <Truck size={14} className="shrink-0 text-violet-500" />
          <div className="flex flex-1 items-center gap-2">
            <p className="text-xs text-violet-700 shrink-0">Tracking code:</p>
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
              className="flex-1 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>
          <button
            onClick={handleShip}
            disabled={!trackingInput.trim()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Mark Shipped
          </button>
        </div>
      )}

      {order.status === "shipped" && (
        <div className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3">
          <Truck size={14} className="shrink-0 text-teal-500" />
          <div className="flex-1">
            <p className="text-xs text-teal-700">
              Shipped with tracking <span className="font-mono font-semibold">{order.trackingCode}</span>. Mark as delivered once the customer confirms receipt.
            </p>
          </div>
          <button
            onClick={handleDeliver}
            className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Mark Delivered
          </button>
        </div>
      )}

      {order.status === "delivered" && (
        <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3">
          <CheckCircle2 size={14} className="text-teal-600" />
          <p className="text-xs font-medium text-teal-700">Order delivered.</p>
          {order.trackingCode && (
            <span className="font-mono text-xs text-teal-600">{order.trackingCode}</span>
          )}
        </div>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Timeline</p>
          <div className="space-y-2">
            {[...timeline].reverse().map((event, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                <span className="capitalize font-semibold text-gray-700">{event.stage}</span>
                <span className="text-gray-400">by {event.by}</span>
                {event.notes && (
                  <span className="italic text-gray-400">&ldquo;{event.notes}&rdquo;</span>
                )}
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
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  function handleOrderUpdate(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      const matchSearch =
        !q ||
        o.requestNumber.toLowerCase().includes(q) ||
        o.requester.name.toLowerCase().includes(q) ||
        o.requester.email.toLowerCase().includes(q) ||
        (o.requester.location ?? "").toLowerCase().includes(q) ||
        o.items.some((i) => i.product.name.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, search, filterStatus]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const o of orders) {
      c[o.status] = (c[o.status] ?? 0) + 1;
    }
    return c;
  }, [orders]);

  const statCards = [
    { key: "pending",   label: "Pending",   color: "text-amber-600 bg-amber-50" },
    { key: "approved",  label: "Approved",  color: "text-green-600 bg-green-50" },
    { key: "fulfilled", label: "Fulfilled", color: "text-blue-600 bg-blue-50" },
    { key: "shipped",   label: "Shipped",   color: "text-violet-600 bg-violet-50" },
    { key: "delivered", label: "Delivered", color: "text-teal-600 bg-teal-50" },
  ] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-0.5 text-sm text-gray-500">{orders.length} total orders from the user portal</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-5 gap-3">
        {statCards.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={`card text-left transition-all hover:shadow-md ${filterStatus === key ? "ring-2 ring-aurex-blue" : ""}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${color.split(" ")[0]}`}>{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{counts[key] ?? 0}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search order, requester, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="rejected">Rejected</option>
        </select>
        <p className="text-sm text-gray-400">{filtered.length} shown</p>
      </div>

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <Package size={36} className="text-gray-200" />
          <p className="text-sm text-gray-400">No orders yet. Orders placed in the user portal will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Request ID", "Requester", "Location", "Items", "Total", "Status", "Date", ""].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((o) => (
                  <>
                    <tr
                      key={o.id}
                      className="group cursor-pointer transition-colors hover:bg-gray-50/50"
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.requestNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{o.requester.name}</p>
                        <p className="text-xs text-gray-400">{o.requester.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {o.requester.location ?? o.requester.department ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {o.items[0]?.product.name}
                        {o.items.length > 1 && (
                          <span className="ml-1 text-gray-400">+{o.items.length - 1}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">${o.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle[o.status] ?? ""}`}
                        >
                          {STATUS_LABELS[o.status] ?? o.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                        {fmtDate(o.submittedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpanded(expanded === o.id ? null : o.id); }}
                          className="rounded p-1 text-gray-400 hover:text-gray-600"
                        >
                          {expanded === o.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr key={`${o.id}-detail`}>
                        <td colSpan={8} className="p-0">
                          <OrderDetail
                            order={o}
                            onUpdate={handleOrderUpdate}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-gray-400">
                      No orders match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
