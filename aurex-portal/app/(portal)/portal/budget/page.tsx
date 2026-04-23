"use client";

import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";
import { BUDGETS_KEY } from "@/lib/store";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Pencil, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

const DEFAULT_DEPARTMENTS = [
  { name: "Chemistry", budget: 15000, color: "bg-blue-500" },
  { name: "Biology", budget: 12000, color: "bg-green-500" },
  { name: "Physics", budget: 8000, color: "bg-purple-500" },
  { name: "Biochemistry", budget: 10000, color: "bg-amber-500" },
  { name: "Microbiology", budget: 9000, color: "bg-teal-500" },
];

const COLORS = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500", "bg-teal-500"];

type DeptBudget = { name: string; budget: number; color: string };

function loadBudgets(): DeptBudget[] {
  if (typeof window === "undefined") return DEFAULT_DEPARTMENTS;
  try {
    const raw = localStorage.getItem(BUDGETS_KEY);
    return raw ? (JSON.parse(raw) as DeptBudget[]) : DEFAULT_DEPARTMENTS;
  } catch {
    return DEFAULT_DEPARTMENTS;
  }
}

function saveBudgets(budgets: DeptBudget[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}

export default function BudgetPage() {
  const { orders } = useStore();
  const user = getStoredUser();
  const [departments, setDepartments] = useState<DeptBudget[]>(DEFAULT_DEPARTMENTS);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draftValue, setDraftValue] = useState("");

  useEffect(() => {
    setDepartments(loadBudgets());
  }, []);

  const canView =
    user?.role === "super_admin" ||
    user?.role === "finance_viewer" ||
    user?.role === "department_admin";

  const isSuperAdmin = user?.role === "super_admin";

  if (!canView) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Budget data is restricted to admins and finance viewers.
      </div>
    );
  }

  const approvedOrders = orders.filter((o) => o.status === "approved");

  const orderSpend: Record<string, number> = {};
  for (const o of approvedOrders) {
    orderSpend[o.requester.department] =
      (orderSpend[o.requester.department] ?? 0) + o.total;
  }

  const depts = departments.map((d) => {
    const spent = orderSpend[d.name] ?? 0;
    const pct = Math.min((spent / d.budget) * 100, 100);
    return { ...d, spent, pct };
  });

  const totalBudget = depts.reduce((s, d) => s + d.budget, 0);
  const totalSpent = depts.reduce((s, d) => s + d.spent, 0);

  function startEdit(idx: number) {
    setEditingIdx(idx);
    setDraftValue(String(departments[idx].budget));
  }

  function confirmEdit(idx: number) {
    const val = parseFloat(draftValue.replace(/,/g, ""));
    if (isNaN(val) || val < 0) { cancelEdit(); return; }
    const updated = departments.map((d, i) =>
      i === idx ? { ...d, budget: Math.round(val) } : d
    );
    setDepartments(updated);
    saveBudgets(updated);
    setEditingIdx(null);
  }

  function cancelEdit() {
    setEditingIdx(null);
    setDraftValue("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Budget Management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Department budgets and spending for the current period.
          {isSuperAdmin && (
            <span className="ml-2 text-aurex-blue dark:text-blue-400">Click the pencil icon to edit a budget.</span>
          )}
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
          {depts.map((d, idx) => {
            const remaining = d.budget - d.spent;
            const isOver80 = d.pct >= 80;
            const isEditing = editingIdx === idx;
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
                  <div className="flex items-center gap-2 text-right text-xs text-gray-500 dark:text-gray-400">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 dark:text-gray-400">${d.spent.toLocaleString()} /</span>
                        <div className="flex items-center rounded-md border border-aurex-blue bg-white px-2 py-0.5 dark:border-blue-500 dark:bg-[#1a1a2a]">
                          <span className="text-gray-500 dark:text-gray-400">$</span>
                          <input
                            autoFocus
                            type="text"
                            value={draftValue}
                            onChange={(e) => setDraftValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") confirmEdit(idx);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="w-24 bg-transparent pl-0.5 text-right text-xs font-semibold text-gray-900 focus:outline-none dark:text-white"
                          />
                        </div>
                        <button
                          onClick={() => confirmEdit(idx)}
                          className="rounded p-0.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <Check size={13} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${d.spent.toLocaleString()}
                          </span>{" "}
                          / ${d.budget.toLocaleString()}
                        </span>
                        {isSuperAdmin && (
                          <button
                            onClick={() => startEdit(idx)}
                            className="rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      d.pct >= 90 ? "bg-red-500" : d.pct >= 80 ? "bg-amber-500" : COLORS[idx % COLORS.length]
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
