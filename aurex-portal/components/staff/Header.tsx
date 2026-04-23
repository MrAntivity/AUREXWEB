"use client";

import type { StaffUser } from "@/lib/staff-auth";

export default function StaffHeader({ user }: { user: StaffUser }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs font-semibold leading-none text-gray-900">{user.name}</p>
          <p className="mt-0.5 text-xs leading-none text-gray-400">{user.email}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-aurex-blue text-xs font-bold text-white">
          {user.initials}
        </div>
      </div>
    </header>
  );
}
