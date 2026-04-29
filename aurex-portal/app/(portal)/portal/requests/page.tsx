"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2, XCircle, Clock, Package, Truck, Ban, RotateCcw,
  Edit3, X, Minus, Plus, RotateCw, ChevronDown, ChevronRight,
} from "lucide-react";
import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";
import { getNotifications, clearNotifications } from "@/lib/notifications";
import type { RequestNotification } from "@/lib/notifications";
import type { Order, CartItem } from "@/lib/store";

const statusConfig: Record<string, { icon: React.ElementType; label: string; cls: string }> = {
  pending:   { icon: Clock,        label: "Pending",   cls: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20" },
  approved:  { icon: CheckCircle2, label: "Approved",  cls: "bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20" },
  rejected:  { icon: XCircle,      label: "Rejected",  cls: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20" },
  fulfilled: { icon: Package,      label: "Fulfilled", cls: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20" },
  shipped:   { icon: Truck,        label: "Shipped",   cls: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20" },
  delivered: { icon: CheckCircle2, label: "Delivered", cls: "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:ring-teal-500/20" },
  cancelled: { icon: Ban,          label: "Cancelled", cls: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20" },
  refunded:  { icon: RotateCcw,    label: "Refunded",  cls: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20" },
};

function EditModal({ order, onResubmit, onClose }: {
  order: Order;
  onResubmit: (items: CartItem[]) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<CartItem[]>(order.items);
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#14141f]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/8">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Edit Request</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 font-mono">{order.requestNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Adjust quantities below and resubmit. Your request will return to pending review.
          </p>

          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/60 dark:divide-white/5 dark:border-white/8 dark:bg-white/3">
            {items.map((item, idx) => (
              <div key={item.product.sku} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                  <p className="text-xs text-gray-400">{item.product.sku} · ${item.product.price.toFixed(2)}/{item.product.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setItems((prev) =>
                        prev.map((i, j) => j === idx && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i)
                      )
                    }
                    disabled={item.qty <= 1}
                    className="rounded-md border border-gray-200 p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/8"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.qty}</span>
                  <button
                    onClick={() =>
                      setItems((prev) =>
                        prev.map((i, j) => j === idx ? { ...i, qty: i.qty + 1 } : i)
                      )
                    }
                    className="rounded-md border border-gray-200 p-1 text-gray-400 hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/8"
                  >
                    <Plus size={11} />
                  </button>
                  <span className="w-16 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    ${(item.product.price * item.qty).toFixed(2)}
                  </span>
                  <button
                    onClick={() => setItems((prev) => prev.filter((_, j) => j !== idx))}
                    disabled={items.length <= 1}
                    className="rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-20 dark:text-gray-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">New Total</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-2 border-t border-gray-100 pt-4 dark:border-white/8">
            <button
              onClick={() => onResubmit(items)}
              disabled={items.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-aurex-blue px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-aurex-blue-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCw size={12} /> Resubmit Request
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestRow({ order, onEdit }: {
  order: Order;
  onEdit: (order: Order) => void;
}) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, label, cls } = statusConfig[order.status] ?? statusConfig.pending;

  const rejectedEvent = order.timeline?.find((e) => e.stage === "rejected");

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
            month: "short", day: "numeric", year: "numeric",
          })}
        </td>
        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </td>
        <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">
          ${order.total.toFixed(2)}
        </td>
        <td className="py-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
            <Icon size={11} />{label}
          </span>
        </td>
        <td className="py-3">
          {order.status === "rejected" && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(order); }}
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-aurex-blue transition hover:bg-blue-50 dark:border-aurex-blue/30 dark:hover:bg-aurex-blue/10"
            >
              <Edit3 size={11} /> Edit &amp; Resubmit
            </button>
          )}
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={7} className="pb-4 pt-0 pl-8">
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
                      <td className="py-1.5 text-right text-gray-600 dark:text-gray-300">${item.product.price.toFixed(2)}</td>
                      <td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-100">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 dark:border-white/10">
                {order.status === "rejected" && rejectedEvent && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Rejected by <span className="font-semibold">{rejectedEvent.by}</span>
                    {rejectedEvent.notes && (
                      <span className="ml-1 italic">&ldquo;{rejectedEvent.notes}&rdquo;</span>
                    )}
                  </p>
                )}

                {order.status === "approved" && order.reviewedBy && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Approved by <span className="font-semibold">{order.reviewedBy}</span>
                    {order.reviewNotes && (
                      <span className="ml-1 italic">&ldquo;{order.reviewNotes}&rdquo;</span>
                    )}
                  </p>
                )}

                {order.status === "rejected" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(order); }}
                    className="mt-1 flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-aurex-blue transition hover:bg-blue-50 dark:border-aurex-blue/30 dark:hover:bg-aurex-blue/10"
                  >
                    <Edit3 size={11} /> Edit &amp; Resubmit
                  </button>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function MyRequestsPage() {
  const { orders, editAndResubmit } = useStore();
  const user = getStoredUser();

  const [notifications, setNotifications] = useState<RequestNotification[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    const notifs = getNotifications(user.email);
    setNotifications(notifs);
    clearNotifications(user.email);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myOrders = useMemo(() => {
    if (!user) return [];
    return orders
      .filter((o) => o.requester.email === user.email)
      .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
  }, [orders, user]);

  function handleResubmit(items: CartItem[]) {
    if (!user || !editingOrder) return;
    editAndResubmit(editingOrder.id, items, user.name);
    setEditingOrder(null);
  }

  if (!user) return null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Requests</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage your lab supply requests.
        </p>
      </div>

      {/* Notification banners — shown once per visit, cleared from storage on mount */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notif) =>
            notif.type === "approved" ? (
              <div
                key={`${notif.orderId}-approved`}
                className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 px-4 py-3 dark:border-green-500/20 dark:bg-green-500/10"
              >
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    Request <span className="font-mono">{notif.orderNumber}</span> was approved
                  </p>
                  <p className="mt-0.5 text-xs text-green-700 dark:text-green-400">
                    Approved by <span className="font-medium">{notif.byName}</span>
                    {notif.reason && (
                      <span className="ml-1 italic">&mdash; &ldquo;{notif.reason}&rdquo;</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={`${notif.orderId}-rejected`}
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10"
              >
                <XCircle size={15} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Request <span className="font-mono">{notif.orderNumber}</span> was rejected
                  </p>
                  <p className="mt-0.5 text-xs text-red-700 dark:text-red-400">
                    Rejected by <span className="font-medium">{notif.byName}</span>
                    {notif.reason && (
                      <span className="ml-1 italic">&mdash; &ldquo;{notif.reason}&rdquo;</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const order = myOrders.find((o) => o.id === notif.orderId);
                    if (order) setEditingOrder(order);
                  }}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <Edit3 size={11} /> Edit &amp; Resubmit
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Requests table */}
      <div className="card">
        {myOrders.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-gray-400">
            <p>No requests yet.</p>
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
                  {["Request #", "Date", "Items", "Total", "Status", ""].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {myOrders.map((order) => (
                  <RequestRow key={order.id} order={order} onEdit={setEditingOrder} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingOrder && (
        <EditModal
          order={editingOrder}
          onResubmit={handleResubmit}
          onClose={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
}
