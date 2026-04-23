"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Package, ShoppingBag, AlertTriangle, CheckCircle2, Clock, ScrollText, ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/product-store";
import { getAuditLog } from "@/lib/audit-log";
import type { Order } from "@/lib/store";
import { ORDERS_KEY } from "@/lib/store";
import { getStoredStaffUser } from "@/lib/staff-auth";

function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const statusStyle: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

const ACTION_LABELS: Record<string, string> = {
  product_updated:     "Product updated",
  product_created:     "Product created",
  stock_updated:       "Stock updated",
  staff_login:         "Signed in",
  staff_logout:        "Signed out",
  order_status_changed:"Order status changed",
};

export default function StaffDashboardPage() {
  const user = getStoredStaffUser();

  const products = useMemo(() => getProducts(), []);
  const orders   = useMemo(() => loadOrders(), []);
  const auditLog = useMemo(() => getAuditLog(), []);

  const totalProducts  = products.length;
  const lowStock       = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStock     = products.filter((p) => p.stock === 0).length;
  const pendingOrders  = orders.filter((o) => o.status === "pending").length;
  const totalOrders    = orders.length;

  const recentOrders = orders.slice(0, 5);
  const recentAudit  = auditLog.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}. Here&apos;s an overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Total Products",   value: String(totalProducts), icon: Package,      color: "bg-blue-50 text-blue-600",   href: "/staff/products" },
          { label: "Pending Orders",   value: String(pendingOrders), icon: Clock,        color: "bg-amber-50 text-amber-600", href: "/staff/orders" },
          { label: "Low Stock Items",  value: String(lowStock),      icon: AlertTriangle, color: "bg-orange-50 text-orange-500", href: "/staff/products" },
          { label: "Out of Stock",     value: String(outOfStock),    icon: ShoppingBag,  color: "bg-red-50 text-red-500",     href: "/staff/products" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="card flex items-start gap-4 transition-shadow hover:shadow-md">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      {(lowStock > 0 || outOfStock > 0) && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={16} />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Inventory alert — {outOfStock > 0 ? `${outOfStock} product${outOfStock > 1 ? "s" : ""} out of stock` : ""}
              {outOfStock > 0 && lowStock > 0 ? ", " : ""}
              {lowStock > 0 ? `${lowStock} product${lowStock > 1 ? "s" : ""} running low` : ""}
            </p>
            <Link href="/staff/products" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline">
              Review inventory <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/staff/orders" className="flex items-center gap-1 text-xs font-medium text-aurex-blue hover:underline">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{o.requestNumber}</p>
                    <p className="text-xs text-gray-400">{o.requester.name} · ${o.total.toFixed(2)}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle[o.status]}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/staff/audit" className="flex items-center gap-1 text-xs font-medium text-aurex-blue hover:underline">
              Full log <ArrowRight size={11} />
            </Link>
          </div>
          {recentAudit.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No activity yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentAudit.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 py-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
                    {entry.userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-900">
                      {ACTION_LABELS[entry.action] ?? entry.action} — {entry.target}
                    </p>
                    <p className="text-xs text-gray-400">{entry.userName} · {new Date(entry.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
