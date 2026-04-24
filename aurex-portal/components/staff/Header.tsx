"use client";

import { usePathname } from "next/navigation";
import type { StaffUser } from "@/lib/staff-auth";
import Link from "next/link";
import { Settings } from "lucide-react";

const PAGE_TITLES: [string, string][] = [
  ["/staff/dashboard",    "Dashboard"],
  ["/staff/institutions", "Institutions"],
  ["/staff/products",     "Products"],
  ["/staff/orders",       "Orders"],
  ["/staff/news",         "News"],
  ["/staff/audit",        "Audit Log"],
  ["/staff/users",        "Staff Users"],
  ["/staff/settings",     "Settings"],
];

export default function StaffHeader({ user }: { user: StaffUser }) {
  const pathname = usePathname();
  const title = PAGE_TITLES.find(([path]) => pathname.startsWith(path))?.[1] ?? "Staff Portal";

  return (
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-white/6 bg-[#0c0c13] px-6 py-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
          Aurex Staff
        </span>
        <span className="text-gray-700">/</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/staff/settings"
          className={`rounded-lg p-1.5 transition-colors ${
            pathname.startsWith("/staff/settings")
              ? "text-aurex-blue"
              : "text-gray-600 hover:text-gray-400"
          }`}
          title="Settings"
        >
          <Settings size={15} />
        </Link>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-xs font-semibold leading-none text-gray-300">{user.name}</p>
            <p className="mt-0.5 text-[10px] leading-none text-gray-600">{user.role}</p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-aurex-blue/30 bg-aurex-blue/10 text-[11px] font-bold text-aurex-blue">
            {user.initials}
          </div>
        </div>
      </div>
    </header>
  );
}
