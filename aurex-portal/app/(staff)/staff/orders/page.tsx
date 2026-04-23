"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Package } from "lucide-react";
import type { Order } from "@/lib/store";
import { ORDERS_KEY } from "@/lib/store";

const statusStyle: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      setOrders(raw ? JSON.parse(raw) : []);
    } catch { setOrders([]); }
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      const matchSearch =
        !q ||
        o.requestNumber.toLowerCase().includes(q) ||
        o.requester.name.toLowerCase().includes(q) ||
        o.requester.email.toLowerCase().includes(q) ||
        o.items.some((i) => i.product.name.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, search, filterStatus]);

  const totals = useMemo(() => ({
    pending:  orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
  }), [orders]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-0.5 text-sm text-gray-500">{orders.length} total orders from the user portal</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
            className={`card text-left transition-shadow hover:shadow-md ${filterStatus === s ? "ring-2 ring-aurex-blue" : ""}`}
          >
            <p className="text-xs font-medium capitalize text-gray-500">{s}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totals[s]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search order, requester, product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
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
                  {["Request ID", "Requester", "Dept", "Items", "Total", "Status", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((o) => (
                  <>
                    <tr key={o.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.requestNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{o.requester.name}</p>
                        <p className="text-xs text-gray-400">{o.requester.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 capitalize">{o.requester.department ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {o.items[0]?.product.name}
                        {o.items.length > 1 && <span className="ml-1 text-gray-400">+{o.items.length - 1}</span>}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">${o.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(o.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                          className="rounded p-1 text-gray-400 hover:text-gray-600"
                        >
                          {expanded === o.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr key={`${o.id}-detail`}>
                        <td colSpan={8} className="bg-gray-50/50 px-6 py-4">
                          <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order Items</p>
                            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
                              {o.items.map((item) => (
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
                            {o.reviewedBy && (
                              <p className="text-xs text-gray-400">
                                {o.status === "approved" ? "Approved" : "Rejected"} by {o.reviewedBy}
                                {o.reviewedAt ? ` on ${new Date(o.reviewedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : ""}
                                {o.reviewNotes ? ` — "${o.reviewNotes}"` : ""}
                              </p>
                            )}
                          </div>
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
