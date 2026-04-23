"use client";

import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

const DEPARTMENTS = [
  { name: "Chemistry", budget: 15000, color: "bg-blue-500" },
  { name: "Biology", budget: 12000, color: "bg-green-500" },
  { name: "Physics", budget: 8000, color: "bg-purple-500" },
  { name: "Biochemistry", budget: 10000, color: "bg-amber-500" },
  { name: "Microbiology", budget: 9000, color: "bg-teal-500" },
];

export default function BudgetPage() {
  const { orders } = useStore();
  const user = getStoredUser();

  const canView =
    user?.role === "super_admin" ||
    user?.role === "finance_viewer" ||
    user?.role === "department_admin";

  if (!canView) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Budget data is restricted to admins and finance viewers.
      </div>
    );
  }

  const approvedOrders = orders.filter((o) => o.status === "approved");

  const seedSpend: Record<string, number> = {
    Chemistry: 12400,
    Biology: 7800,
    Physics: 3200,
    Biochemistry: 5600,
    Microbiology: 2100,
  };

  const orderSpend: Record<string, number> = {};
  for (const o of approvedOrders) {
    orderSpend[o.requester.department] =
      (orderSpend[o.requester.department] ?? 0) + o.total;
  }

  const depts = DEPARTMENTS.map((d) => {
    const spent = (seedSpend[d.name] ?? 0) + (orderSpend[d.name] ?? 0);
    const pct = Math.min((spent / d.budget) * 100, 100);
    return { ...d, spent, pct };
  });

  const totalBudget = depts.reduce((s, d) => s + d.budget, 0);
  const totalSpent = depts.reduce((s, d) => s + d.spent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Budget Management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Department budgets and spending for the current period.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          {
            label: "Total Budget",
            value: `$${totalBudget.toLocaleString()}`,
            sub: "across all departments",
            icon: DollarSign,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Total Spent",
            value: `$${totalSpent.toLocaleString()}`,
            sub: `${((totalSpent / totalBudget) * 100).toFixed(0)}% of total`,
            icon: TrendingUp,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Remaining",
            value: `$${(totalBudget - totalSpent).toLocaleString()}`,
            sub: "available to spend",
            icon: CheckCircle2,
            color: "bg-green-50 text-green-600",
          },
        ].map((s) => (
          <div key={s.label} className="card flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Department breakdown */}
      <div className="card">
        <h2 className="mb-5 text-sm font-semibold text-gray-900 dark:text-white">Department Breakdown</h2>
        <div className="space-y-5">
          {depts.map((d) => {
            const remaining = d.budget - d.spent;
            const isOver80 = d.pct >= 80;
            return (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{d.name}</span>
                    {isOver80 && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <AlertTriangle size={10} /> Over 80%
                      </span>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${d.spent.toLocaleString()}
                    </span>{" "}
                    / ${d.budget.toLocaleString()}
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      d.pct >= 90 ? "bg-red-500" : d.pct >= 80 ? "bg-amber-500" : d.color
                    }`}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  ${remaining.toLocaleString()} remaining · {d.pct.toFixed(0)}% used
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live approved orders */}
      {approvedOrders.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Approved Orders This Session
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/8">
                  {["Request #", "Requester", "Department", "Total", "Approved By"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {approvedOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                    <td className="py-2.5 font-mono text-xs text-gray-500 dark:text-gray-400">{o.requestNumber}</td>
                    <td className="py-2.5 text-gray-900 dark:text-white">{o.requester.name}</td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-400">{o.requester.department}</td>
                    <td className="py-2.5 font-semibold text-gray-900 dark:text-white">${o.total.toFixed(2)}</td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-400">{o.reviewedBy ?? "—"}</td>
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
