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
  Building2,
  Newspaper,
  Users,
  Settings,
} from "lucide-react";
import type { StaffUser } from "@/lib/staff-auth";

const navSections = [
  {
    label: "Operations",
    items: [
      { href: "/staff/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
      { href: "/staff/institutions", label: "Institutions", icon: Building2 },
      { href: "/staff/orders",       label: "Orders",       icon: ShoppingBag },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/staff/products", label: "Products", icon: Package },
      { href: "/staff/news",     label: "News",     icon: Newspaper },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/staff/users", label: "Staff Users", icon: Users },
      { href: "/staff/audit", label: "Audit Log",   icon: ScrollText },
    ],
  },
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
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-white/6 bg-[#0a0a10]">
      {/* Brand */}
      <div className="flex flex-col gap-0 border-b border-white/6 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-aurex-blue/20">
            <FlaskConical size={13} className="text-aurex-blue" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Aurex Medical</span>
        </div>
        <p className="mt-1.5 pl-8 text-[9px] font-bold uppercase tracking-[0.3em] text-aurex-blue/50">
          Staff Portal
        </p>
      </div>

      {/* Nav sections */}
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4">
        {navSections.map(({ label, items }) => (
          <div key={label}>
            <p className="mb-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-700">
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, label: itemLabel, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      active
                        ? "bg-aurex-blue/12 text-aurex-blue"
                        : "text-gray-500 hover:bg-white/4 hover:text-gray-300"
                    }`}
                  >
                    <Icon
                      size={14}
                      className={active ? "text-aurex-blue" : "text-gray-700"}
                    />
                    {itemLabel}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: settings + user */}
      <div className="border-t border-white/6 px-3 py-3 space-y-0.5">
        <Link
          href="/staff/settings"
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
            pathname.startsWith("/staff/settings")
              ? "bg-aurex-blue/12 text-aurex-blue"
              : "text-gray-500 hover:bg-white/4 hover:text-gray-300"
          }`}
        >
          <Settings size={14} className={pathname.startsWith("/staff/settings") ? "text-aurex-blue" : "text-gray-700"} />
          Settings
        </Link>
      </div>

      {/* User footer */}
      <div className="border-t border-white/6 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-aurex-blue/30 bg-aurex-blue/10 text-[11px] font-bold text-aurex-blue">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-300">{user.name}</p>
            <p className="truncate text-[10px] text-gray-600">{user.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="shrink-0 rounded-lg p-1.5 text-gray-700 transition hover:bg-white/5 hover:text-gray-400"
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
