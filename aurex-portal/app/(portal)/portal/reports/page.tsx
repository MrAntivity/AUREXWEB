"use client";

import { useMemo } from "react";
import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";
import { CATEGORY_EMOJI } from "@/lib/products";
import type { Category } from "@/lib/products";
import { BarChart2, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const { orders } = useStore();
  const user = getStoredUser();

  const canView =
    user?.role === "super_admin" || user?.role === "finance_viewer";

  if (!canView) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Reports are restricted to Super Admin and Finance Viewer roles.
      </div>
    );
  }

  // Aggregate spend by category across approved orders
  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders.filter((o) => o.status === "approved")) {
      for (const item of o.items) {
        map[item.product.category] =
          (map[item.product.category] ?? 0) + item.product.price * item.qty;
      }
    }
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, total]) => ({ cat: cat as Category, total }));
  }, [orders]);

  // Top products by qty ordered
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; spend: number }> = {};
    for (const o of orders) {
      for (const item of o.items) {
        const e = map[item.product.sku] ?? {
          name: item.product.name,
          qty: 0,
          spend: 0,
        };
        e.qty += item.qty;
        e.spend += item.product.price * item.qty;
        map[item.product.sku] = e;
      }
    }
    return Object.values(map)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);
  }, [orders]);

  // Order counts by status
  const pending = orders.filter((o) => o.status === "pending").length;
  const approved = orders.filter((o) => o.status === "approved").length;
  const rejected = orders.filter((o) => o.status === "rejected").length;
  const totalSpend = orders
    .filter((o) => o.status === "approved")
    .reduce((s, o) => s + o.total, 0);

  const maxCatSpend = categorySpend[0]?.total ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Spend summaries and order analytics from your session data.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
          { label: "Approved", value: approved, icon: TrendingUp, color: "text-green-600 bg-green-50" },
          { label: "Pending", value: pending, icon: BarChart2, color: "text-amber-600 bg-amber-50" },
          { label: "Approved Spend", value: `$${totalSpend.toFixed(0)}`, icon: Package, color: "text-purple-600 bg-purple-50" },
        ].map((k) => (
          <div key={k.label} className="card flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${k.color}`}>
              <k.icon size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{k.label}</p>
              <p className="text-lg font-bold text-gray-900">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spend by category */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Spend by Category</h2>
          {categorySpend.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No approved orders yet. Approve some orders to see data here.
            </p>
          ) : (
            <div className="space-y-3">
              {categorySpend.map(({ cat, total }) => (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span>{CATEGORY_EMOJI[cat]}</span>
                      <span>{cat}</span>
                    </span>
                    <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-aurex-blue transition-all"
                      style={{ width: `${(total / maxCatSpend) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Order Status Breakdown</h2>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No orders submitted yet.
            </p>
          ) : (
            <div className="space-y-4">
              {[
                { label: "Approved", count: approved, color: "bg-green-500" },
                { label: "Pending", count: pending, color: "bg-amber-500" },
                { label: "Rejected", count: rejected, color: "bg-red-400" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-700">{row.label}</span>
                    <span className="font-semibold text-gray-900">
                      {row.count} order{row.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full transition-all ${row.color}`}
                      style={{
                        width: orders.length
                          ? `${(row.count / orders.length) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-2 border-t border-gray-100 pt-3 text-xs text-gray-400">
                {orders.length} total order{orders.length !== 1 ? "s" : ""} ·{" "}
                {orders.length > 0
                  ? `${((approved / orders.length) * 100).toFixed(0)}% approval rate`
                  : "no data"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top products table */}
      {topProducts.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Top Ordered Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Product", "Units Ordered", "Total Spend"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p, i) => (
                  <tr key={i}>
                    <td className="py-2.5 font-medium text-gray-900">{p.name}</td>
                    <td className="py-2.5 text-gray-600">{p.qty}</td>
                    <td className="py-2.5 font-semibold text-gray-900">${p.spend.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
