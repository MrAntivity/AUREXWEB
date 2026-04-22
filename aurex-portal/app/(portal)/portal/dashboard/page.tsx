"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Package,
} from "lucide-react";
import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

export default function DashboardPage() {
  const { orders, cartCount, setCartOpen } = useStore();
  const user = getStoredUser();

  const myOrders =
    user?.role === "requester"
      ? orders.filter((o) => o.requester.email === user?.email)
      : orders;

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const approvedCount = orders.filter((o) => o.status === "approved").length;
  const totalSpend = orders
    .filter((o) => o.status === "approved")
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = myOrders.slice(0, 5);

  const stats = [
    {
      label: "Items in Cart",
      value: String(cartCount),
      sub: cartCount > 0 ? "ready to submit" : "cart is empty",
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
      onClick: () => setCartOpen(true),
    },
    {
      label: "Pending Approval",
      value: String(pendingCount),
      sub: pendingCount === 1 ? "awaiting review" : "awaiting review",
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      href: "/portal/approvals",
    },
    {
      label: "Approved Orders",
      value: String(approvedCount),
      sub: "all time",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
      href: "/portal/orders",
    },
    {
      label: "Total Approved Spend",
      value: `$${totalSpend.toFixed(0)}`,
      sub: "all approved orders",
      icon: DollarSign,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const inner = (
            <div key={s.label} className="card flex items-start gap-4 transition-shadow hover:shadow-md">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.color}`}
              >
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="mt-0.5 text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <TrendingUp size={11} />
                  {s.sub}
                </p>
              </div>
            </div>
          );
          if ("onClick" in s && s.onClick) {
            return (
              <button key={s.label} onClick={s.onClick} className="text-left">
                {inner}
              </button>
            );
          }
          if ("href" in s && s.href) {
            return (
              <Link key={s.label} href={s.href}>
                {inner}
              </Link>
            );
          }
          return <div key={s.label}>{inner}</div>;
        })}
      </div>

      {/* Budget alert */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle className="mt-0.5 shrink-0 text-amber-600" size={16} />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Chemistry department is at 80% of monthly budget
          </p>
          <p className="mt-0.5 text-xs text-amber-600">
            $12,400 of $15,000 used. New requests over $500 require Super Admin approval.
          </p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recent Purchase Requests</h2>
          <Link href="/portal/orders" className="text-xs font-medium text-aurex-blue hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Package size={32} className="text-gray-200" />
            <p className="text-sm text-gray-400">No orders yet.</p>
            <Link
              href="/portal/catalog"
              className="inline-flex items-center gap-1.5 rounded-lg bg-aurex-blue px-4 py-2 text-xs font-semibold text-white hover:bg-aurex-blue-light"
            >
              <ShoppingCart size={13} /> Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Request ID", "Items", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-mono text-xs text-gray-500">{o.requestNumber}</td>
                    <td className="max-w-[200px] truncate py-3 font-medium text-gray-900">
                      {o.items[0]?.product.name}
                      {o.items.length > 1 && (
                        <span className="ml-1 text-gray-400">+{o.items.length - 1} more</span>
                      )}
                    </td>
                    <td className="py-3 font-medium text-gray-900">${o.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(o.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
