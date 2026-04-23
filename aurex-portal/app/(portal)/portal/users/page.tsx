"use client";

import { getStoredUser, MOCK_USERS, ROLE_LABELS } from "@/lib/mock-auth";
import type { MockRole } from "@/lib/mock-auth";
import { ShieldCheck, UserCheck, User, Eye } from "lucide-react";

const roleIcon: Record<MockRole, React.ElementType> = {
  super_admin: ShieldCheck,
  department_admin: UserCheck,
  requester: User,
  finance_viewer: Eye,
};

const roleBadge: Record<MockRole, string> = {
  super_admin: "bg-purple-50 text-purple-700 ring-purple-200",
  department_admin: "bg-blue-50 text-blue-700 ring-blue-200",
  requester: "bg-green-50 text-green-700 ring-green-200",
  finance_viewer: "bg-amber-50 text-amber-700 ring-amber-200",
};

export default function UsersPage() {
  const currentUser = getStoredUser();

  if (currentUser?.role !== "super_admin") {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        User management is restricted to Super Admins.
      </div>
    );
  }

  const users = Object.values(MOCK_USERS).map(({ password: _pw, ...u }) => u);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage team members and their portal access roles.
          </p>
        </div>
        <button
          disabled
          title="Connect a real auth provider to invite users"
          className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-400 dark:border-white/15"
        >
          + Invite User
        </button>
      </div>

      <div className="card divide-y divide-gray-50 dark:divide-white/5">
        {users.map((u) => {
          const Icon = roleIcon[u.role];
          const isSelf = u.email === currentUser.email;
          return (
            <div key={u.email} className="flex items-center gap-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aurex-blue text-xs font-bold text-white">
                {u.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                  {isSelf && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-white/10 dark:text-gray-400">
                      you
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
              <div className="shrink-0 text-sm text-gray-500 dark:text-gray-400">{u.department}</div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleBadge[u.role]}`}>
                <Icon size={11} />
                {ROLE_LABELS[u.role]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400 dark:border-white/10">
        This is a mock user list. Connect a real auth provider (e.g. Clerk) to invite,
        deactivate, and manage users in production.
      </div>
    </div>
  );
}
