"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, CheckCircle2, XCircle, Package, Truck } from "lucide-react";
import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";
import type { Order } from "@/lib/store";

const statusConfig: Record<string, { icon: React.ElementType; label: string; cls: string }> = {
  pending:   { icon: Clock,         label: "Pending",   cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  approved:  { icon: CheckCircle2,  label: "Approved",  cls: "bg-green-50 text-green-700 ring-green-200" },
  rejected:  { icon: XCircle,       label: "Rejected",  cls: "bg-red-50 text-red-700 ring-red-200" },
  fulfilled: { icon: Package,       label: "Fulfilled", cls: "bg-blue-50 text-blue-700 ring-blue-200" },
  shipped:   { icon: Truck,         label: "Shipped",   cls: "bg-violet-50 text-violet-700 ring-violet-200" },
  delivered: { icon: CheckCircle2,  label: "Delivered", cls: "bg-teal-50 text-teal-700 ring-teal-200" },
};

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, label, cls } = statusConfig[order.status] ?? statusConfig.pending;

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
              {order.reviewedBy && (
                <div className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
                  <span className="font-medium">{order.reviewedBy}</span>{" "}
                  {order.status === "approved" ? "approved" : "rejected"} this order on{" "}
                  {new Date(order.reviewedAt!).toLocaleDateString()}.
                  {order.reviewNotes && (
                    <span className="ml-1 italic">&ldquo;{order.reviewNotes}&rdquo;</span>
                  )}
                </div>
              )}
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

  const myOrders =
    user?.role === "requester"
      ? orders.filter((o) => o.requester.email === user.email)
      : orders;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track the status of your purchase requests.</p>
      </div>

      <div className="card">
        {myOrders.length === 0 ? (
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
                {myOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
