"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  CheckSquare,
  DollarSign,
  Package,
  BarChart2,
  Users,
  Settings,
  FlaskConical,
  LogOut,
  Truck,
} from "lucide-react";
import type { MockUser, MockRole } from "@/lib/mock-auth";
import { ROLE_LABELS } from "@/lib/mock-auth";

const navItems = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/catalog", label: "Catalog", icon: Package },
  { href: "/portal/cart", label: "Cart & Orders", icon: ShoppingCart },
  { href: "/portal/orders", label: "My Orders", icon: Package },
  { href: "/portal/tracking", label: "Order Tracking", icon: Truck },
  { href: "/portal/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/portal/budget", label: "Budget", icon: DollarSign },
  { href: "/portal/reports", label: "Reports", icon: BarChart2 },
  { href: "/portal/users", label: "Users", icon: Users },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

const roleBadgeStyle: Record<MockRole, string> = {
  super_admin: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  department_admin: "bg-blue-50 text-blue-700 dark:bg-aurex-blue/10 dark:text-aurex-blue",
  requester: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  finance_viewer: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

export default function PortalSidebar({
  user,
  onLogout,
}: {
  user: MockUser;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-white/8 dark:bg-[#0c0c13]">
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-5 dark:border-white/8">
        <FlaskConical size={18} className="text-aurex-blue" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">Aurex Medical</span>
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
                  ? "bg-aurex-blue/10 text-aurex-blue dark:bg-aurex-blue/10 dark:text-aurex-blue"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <Icon size={16} className={active ? "text-aurex-blue" : "text-gray-400 dark:text-gray-600"} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-4 dark:border-white/8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aurex-blue text-xs font-bold text-white">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <span
              className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeStyle[user.role]}`}
            >
              {ROLE_LABELS[user.role]}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
