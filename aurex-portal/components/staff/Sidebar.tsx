"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ScrollText,
  FlaskConical,
  LogOut,
} from "lucide-react";
import type { StaffUser } from "@/lib/staff-auth";

const navItems = [
  { href: "/staff/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/staff/products",  label: "Products",   icon: Package },
  { href: "/staff/orders",    label: "Orders",     icon: ShoppingBag },
  { href: "/staff/audit",     label: "Audit Log",  icon: ScrollText },
];

export default function StaffSidebar({
  user,
  onLogout,
}: {
  user: StaffUser;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#0c0c13] border-r border-white/8">
      <div className="flex flex-col gap-0.5 border-b border-white/8 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <FlaskConical size={18} className="text-aurex-blue" />
          <span className="text-sm font-bold text-white">Aurex Medical</span>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-aurex-blue/70 pl-7">
          Staff Portal
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-aurex-blue/15 text-aurex-blue"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} className={active ? "text-aurex-blue" : "text-gray-600"} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aurex-blue text-xs font-bold text-white">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{user.name}</p>
            <p className="truncate text-[10px] text-gray-500">{user.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="shrink-0 rounded-lg p-1.5 text-gray-600 transition hover:bg-white/5 hover:text-gray-300"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
