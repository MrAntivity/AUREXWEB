"use client";

import { Bell, ShoppingCart } from "lucide-react";
import type { MockUser } from "@/lib/mock-auth";
import { useStore } from "@/components/portal/StoreProvider";

export default function PortalHeader({ user }: { user: MockUser }) {
  const { cartCount, setCartOpen } = useStore();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCartOpen(true)}
          className="relative rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
          title="Cart"
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-aurex-blue text-[10px] font-bold text-white">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
        <button
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
          title="Notifications"
        >
          <Bell size={18} />
        </button>
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
