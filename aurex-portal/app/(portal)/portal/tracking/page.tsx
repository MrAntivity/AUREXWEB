"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Truck, Package, XCircle, RefreshCw } from "lucide-react";
import type { Order } from "@/lib/store";
import { ORDERS_KEY } from "@/lib/store";
import { getStoredUser } from "@/lib/mock-auth";

const STAGES = [
  { key: "pending",   label: "Requested" },
  { key: "approved",  label: "Approved"  },
  { key: "fulfilled", label: "Fulfilled" },
  { key: "shipped",   label: "Shipped"   },
  { key: "delivered", label: "Delivered" },
] as const;

const STAGE_KEYS = STAGES.map((s) => s.key);

// Fill percentage for the progress bar at each stage
const FILL_PCT = [5, 27, 52, 76, 100];

function getProgress(status: string): number {
  const idx = STAGE_KEYS.indexOf(status as typeof STAGE_KEYS[number]);
  return idx >= 0 ? idx : 0;
}

function TrackingCard({ order }: { order: Order }) {
  const rejected = order.status === "rejected";
  const progress = getProgress(order.status);
  const fillPct = rejected ? 0 : FILL_PCT[progress];
  const timeline = order.timeline ?? [];

  const itemSummary = order.items
    .map((i) => `${i.qty}× ${i.product.name}`)
    .join(", ");

  return (
    <div className="card space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs text-gray-400 dark:text-gray-500">{order.requestNumber}</p>
          <p className="mt-1 truncate text-sm font-medium text-gray-900 dark:text-white">{itemSummary}</p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            ${order.total.toFixed(2)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(order.submittedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {order.trackingCode && (
            <div className="mt-1.5 flex items-center justify-end gap-1.5">
              <Truck size={11} className="text-aurex-blue" />
              <span className="font-mono text-xs font-medium text-aurex-blue">{order.trackingCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress or rejected state */}
      {rejected ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950/40">
          <XCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
          <div>
            <p className="text-xs font-medium text-red-700 dark:text-red-400">
              Order rejected{order.reviewedBy ? ` by ${order.reviewedBy}` : ""}
            </p>
            {order.reviewNotes && (
              <p className="mt-0.5 text-xs italic text-red-500 dark:text-red-500">
                &ldquo;{order.reviewNotes}&rdquo;
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Track */}
          <div className="relative flex h-4 items-center">
            {/* Background + fill line, inset by half dot width (8px) on each side */}
            <div className="absolute inset-x-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-aurex-blue transition-all duration-700 ease-out"
                style={{ width: `${fillPct}%` }}
              />
            </div>
            {/* Dots */}
            <div className="relative flex w-full items-center justify-between">
              {STAGES.map((stage, i) => {
                const done = i <= progress;
                const current = i === progress;
                return (
                  <div
                    key={stage.key}
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all duration-500 ${
                      done
                        ? "border-aurex-blue bg-aurex-blue"
                        : "border-gray-200 bg-white dark:border-white/20 dark:bg-[#0c0c13]"
                    } ${current ? "ring-[3px] ring-aurex-blue/20 ring-offset-0" : ""}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Stage labels */}
          <div className="flex justify-between">
            {STAGES.map((stage, i) => {
              const done = i <= progress;
              const tEvent = timeline.find(
                (e) =>
                  e.stage === stage.key ||
                  (stage.key === "pending" && e.stage === "requested")
              );
              return (
                <div
                  key={stage.key}
                  className="flex w-[20%] flex-col items-center gap-0.5"
                >
                  <span
                    className={`text-center text-[10px] font-semibold leading-tight ${
                      done
                        ? "text-aurex-blue dark:text-blue-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    {stage.label}
                  </span>
                  {tEvent && (
                    <span className="text-center text-[9px] leading-tight text-gray-400 dark:text-gray-600">
                      {new Date(tEvent.at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline audit trail */}
      {timeline.length > 0 && (
        <div className="border-t border-gray-100 pt-3 dark:border-white/8">
          <div className="space-y-2">
            {[...timeline].reverse().map((event, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-200 dark:bg-white/20" />
                <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{event.stage}</span>
                <span className="text-gray-400 dark:text-gray-500">by {event.by}</span>
                {event.notes && (
                  <>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <span className="italic text-gray-400 dark:text-gray-500">&ldquo;{event.notes}&rdquo;</span>
                  </>
                )}
                <span className="ml-auto shrink-0 text-gray-300 dark:text-gray-600">
                  {new Date(event.at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  const user = getStoredUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadOrders = useCallback(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const all: Order[] = raw ? JSON.parse(raw) : [];
      const mine =
        user?.role === "requester"
          ? all.filter((o) => o.requester.email === user.email)
          : all;
      setOrders(mine.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    } catch {
      setOrders([]);
    }
  }, [user?.email, user?.role]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, refreshKey]);

  const active = orders.filter((o) => o.status !== "delivered" && o.status !== "rejected");
  const completed = orders.filter((o) => o.status === "delivered" || o.status === "rejected");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Order Tracking</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Live status of your purchase requests.
          </p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16">
          <Package size={36} className="text-gray-200 dark:text-white/10" />
          <p className="text-sm text-gray-400">No orders to track yet.</p>
          <Link href="/portal/catalog" className="text-xs text-aurex-blue hover:underline">
            Browse the catalog to get started →
          </Link>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Active Orders
              </h2>
              {active.map((order) => (
                <TrackingCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Completed &amp; Closed
              </h2>
              {completed.map((order) => (
                <TrackingCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
