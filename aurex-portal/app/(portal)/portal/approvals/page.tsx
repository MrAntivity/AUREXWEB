"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";
import type { Order } from "@/lib/store";

function ApprovalRow({
  order,
  onApprove,
  onReject,
}: {
  order: Order;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <>
      <tr className="cursor-pointer hover:bg-gray-50/60 dark:hover:bg-white/5" onClick={() => setOpen((p) => !p)}>
        <td className="py-3 pr-3">
          {open ? (
            <ChevronDown size={14} className="text-gray-400" />
          ) : (
            <ChevronRight size={14} className="text-gray-400" />
          )}
        </td>
        <td className="py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{order.requestNumber}</td>
        <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{order.requester.name}</td>
        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{order.requester.department}</td>
        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
          {new Date(order.submittedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={7} className="pb-5 pt-0 pl-8">
            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-white/8 dark:bg-white/5">
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

              <div className="space-y-3 border-t border-gray-200 pt-3 dark:border-white/10">
                <textarea
                  placeholder="Add review notes (optional)…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-200 dark:placeholder-gray-600"
                />
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onApprove(order.id, notes); }}
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    <CheckCircle2 size={13} /> Approve
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onReject(order.id, notes); }}
                    className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ReviewedRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const cfg =
    order.status === "approved"
      ? { label: "Approved", cls: "bg-green-50 text-green-700 ring-green-200" }
      : { label: "Rejected", cls: "bg-red-50 text-red-700 ring-red-200" };

  return (
    <>
      <tr
        className="cursor-pointer opacity-70 hover:bg-gray-50/60 dark:hover:bg-white/5"
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
        <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{order.requester.name}</td>
        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{order.requester.department}</td>
        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
          {new Date(order.submittedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
        <td className="py-3">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cfg.cls}`}>
            {cfg.label}
          </span>
        </td>
      </tr>
      {open && order.reviewNotes && (
        <tr>
          <td colSpan={7} className="pb-3 pt-0 pl-8">
            <p className="text-xs italic text-gray-500 dark:text-gray-400">
              {order.reviewedBy}: &ldquo;{order.reviewNotes}&rdquo;
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ApprovalsPage() {
  const { orders, approveOrder, rejectOrder } = useStore();
  const user = getStoredUser();

  const canApprove = user?.role === "super_admin" || user?.role === "department_admin";

  if (!canApprove) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        You don&apos;t have permission to review orders.
      </div>
    );
  }

  function handleApprove(id: string, notes: string) {
    if (!user) return;
    approveOrder(id, user.name, notes || undefined);
  }

  function handleReject(id: string, notes: string) {
    if (!user) return;
    rejectOrder(id, user.name, notes || undefined);
  }

  const pending = orders.filter((o) => o.status === "pending");
  const reviewed = orders.filter((o) => o.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Approvals</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and action pending purchase requests.
        </p>
      </div>

      {/* Pending queue */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Pending Review</h2>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            {pending.length}
          </span>
        </div>
        {pending.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            All caught up — no pending requests.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/8">
                  <th className="w-6 pb-3" />
                  {["Request #", "Requester", "Department", "Date", "Total", "Items"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {pending.map((order) => (
                  <ApprovalRow
                    key={order.id}
                    order={order}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Previously reviewed */}
      {reviewed.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Previously Reviewed</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/8">
                  <th className="w-6 pb-3" />
                  {["Request #", "Requester", "Department", "Date", "Total", "Status"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {reviewed.map((order) => (
                  <ReviewedRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
