"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Clock, CheckCircle2, XCircle, Package, Truck, Search, X, ChevronDown as ChevronDownSm, Ban, RotateCcw } from "lucide-react";
import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";
import type { Order } from "@/lib/store";

const statusConfig: Record<string, { icon: React.ElementType; label: string; cls: string }> = {
  pending:   { icon: Clock,        label: "Pending",   cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  approved:  { icon: CheckCircle2, label: "Approved",  cls: "bg-green-50 text-green-700 ring-green-200" },
  rejected:  { icon: XCircle,      label: "Rejected",  cls: "bg-red-50 text-red-700 ring-red-200" },
  fulfilled: { icon: Package,      label: "Fulfilled", cls: "bg-blue-50 text-blue-700 ring-blue-200" },
  shipped:   { icon: Truck,        label: "Shipped",   cls: "bg-violet-50 text-violet-700 ring-violet-200" },
  delivered: { icon: CheckCircle2, label: "Delivered", cls: "bg-teal-50 text-teal-700 ring-teal-200" },
  cancelled: { icon: Ban,          label: "Cancelled", cls: "bg-red-50 text-red-700 ring-red-200" },
  refunded:  { icon: RotateCcw,    label: "Refunded",  cls: "bg-orange-50 text-orange-700 ring-orange-200" },
};

type DateFilter = "all" | "7d" | "30d" | "90d";

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, label, cls } = statusConfig[order.status] ?? statusConfig.pending;

  const cancelEvent = order.timeline?.find((e) => e.stage === "cancelled");
  const refundEvent = order.timeline?.find((e) => e.stage === "refunded");
  const editCount = order.timeline?.filter((e) => e.stage === "edited").length ?? 0;
  const shippedEvent = order.timeline?.find((e) => e.stage === "shipped");

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-gray-50/60 dark:hover:bg-white/5"
        onClick={() => setOpen((p) => !p)}
      >
        <td className="py-3 pr-3">
          {open ? (
            <ChevronDown size={14} className="text-gray-400" />
          ) : (
            <ChevronRight size={14} className="text-gray-400" />
          )}
        </td>
        <td className="py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{order.requestNumber}</td>
        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
          {new Date(order.submittedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </td>
        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </td>
        <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
        <td className="py-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
            <Icon size={11} />
            {label}
          </span>
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={6} className="pb-4 pt-0 pl-8">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-white/8 dark:bg-white/5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400">
                    <th className="pb-2 text-left font-medium">Product</th>
                    <th className="pb-2 text-left font-medium">SKU</th>
                    <th className="pb-2 text-right font-medium">Qty</th>
                    <th className="pb-2 text-right font-medium">Unit Price</th>
                    <th className="pb-2 text-right font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/8">
                  {order.items.map((item) => (
                    <tr key={item.product.sku}>
                      <td className="py-1.5 font-medium text-gray-800 dark:text-gray-100">{item.product.name}</td>
                      <td className="py-1.5 font-mono text-gray-400">{item.product.sku}</td>
                      <td className="py-1.5 text-right text-gray-600 dark:text-gray-300">{item.qty}</td>
                      <td className="py-1.5 text-right text-gray-600 dark:text-gray-300">
                        ${item.product.price.toFixed(2)}
                      </td>
                      <td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-100">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 dark:border-white/10">
                {order.reviewedBy && (order.status === "approved" || order.status === "rejected") && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{order.reviewedBy}</span>{" "}
                    {order.status === "approved" ? "approved" : "rejected"} this order on{" "}
                    {new Date(order.reviewedAt!).toLocaleDateString()}.
                    {order.reviewNotes && (
                      <span className="ml-1 italic">&ldquo;{order.reviewNotes}&rdquo;</span>
                    )}
                  </p>
                )}

                {(order.status === "shipped" || order.status === "delivered") && order.trackingCode && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tracking: <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">{order.trackingCode}</span>
                    {shippedEvent && (
                      <span className="ml-1 text-gray-400">· Shipped {new Date(shippedEvent.at).toLocaleDateString()}</span>
                    )}
                  </p>
                )}

                {cancelEvent && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Cancelled by <span className="font-medium">{cancelEvent.by}</span> on{" "}
                    {new Date(cancelEvent.at).toLocaleDateString()}.
                    {cancelEvent.notes && (
                      <span className="ml-1 italic">&ldquo;{cancelEvent.notes}&rdquo;</span>
                    )}
                  </p>
                )}

                {refundEvent && (
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Refunded by <span className="font-medium">{refundEvent.by}</span> on{" "}
                    {new Date(refundEvent.at).toLocaleDateString()}.
                    {refundEvent.notes && (
                      <span className="ml-1 italic">&ldquo;{refundEvent.notes}&rdquo;</span>
                    )}
                  </p>
                )}

                {editCount > 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Order was updated {editCount} time{editCount !== 1 ? "s" : ""} by staff.
                  </p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function OrdersPage() {
  const { orders } = useStore();
  const user = getStoredUser();

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter]     = useState<DateFilter>("all");

  const baseOrders =
    user?.role === "requester"
      ? orders.filter((o) => o.requester.email === user.email)
      : orders;

  const filtered = useMemo(() => {
    let result = [...baseOrders];

    const now = Date.now();
    if (dateFilter === "7d")  result = result.filter((o) => +new Date(o.submittedAt) >= now - 7  * 86_400_000);
    if (dateFilter === "30d") result = result.filter((o) => +new Date(o.submittedAt) >= now - 30 * 86_400_000);
    if (dateFilter === "90d") result = result.filter((o) => +new Date(o.submittedAt) >= now - 90 * 86_400_000);

    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);

    const q = search.toLowerCase();
    if (q) {
      result = result.filter(
        (o) =>
          o.requestNumber.toLowerCase().includes(q) ||
          o.items.some((i) => i.product.name.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [baseOrders, dateFilter, statusFilter, search]);

  const hasFilters = statusFilter !== "all" || dateFilter !== "all" || search !== "";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("all");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track the status of your purchase requests.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by request # or item…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white dark:placeholder-gray-600"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <ChevronDownSm size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <ChevronDownSm size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-gray-500 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
        <p className="ml-auto text-sm text-gray-400">{filtered.length} orders</p>
      </div>

      <div className="card">
        {baseOrders.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-gray-400">
            <p>No orders yet.</p>
            <a href="/portal/catalog" className="text-aurex-blue hover:underline">
              Browse the catalog to get started →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/8">
                  <th className="w-6 pb-3" />
                  {["Request #", "Date", "Items", "Total", "Status"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                      No orders match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
