"use client";

import { useState, useRef } from "react";
import { Bell, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MockUser } from "@/lib/mock-auth";
import { useStore } from "@/components/portal/StoreProvider";

export default function PortalHeader({ user }: { user: MockUser }) {
  const { cart, cartCount } = useStore();
  const router = useRouter();
  const [hovering, setHovering] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHovering(true);
  }

  function handleMouseLeave() {
    leaveTimer.current = setTimeout(() => setHovering(false), 150);
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-white/8 dark:bg-[#0c0c13]">
      <div />
      <div className="flex items-center gap-3">
        {/* Cart with hover preview */}
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button
            onClick={() => router.push("/portal/cart")}
            className="relative rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
            title="Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-aurex-blue text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* Hover preview — items */}
          {hovering && cart.length > 0 && (
            <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a2a]">
              <div className="max-h-56 divide-y divide-gray-50 overflow-y-auto px-3 dark:divide-white/5">
                {cart.slice(0, 6).map((item) => (
                  <div key={item.product.sku} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400">×{item.qty}</p>
                    </div>
                    <p className="shrink-0 text-xs font-semibold text-aurex-blue">
                      ${(item.product.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
                {cart.length > 6 && (
                  <p className="py-2 text-center text-xs text-gray-400">
                    +{cart.length - 6} more items
                  </p>
                )}
              </div>
              <div className="border-t border-gray-100 p-3 dark:border-white/8">
                <button
                  onClick={() => router.push("/portal/cart")}
                  className="w-full rounded-lg bg-aurex-blue py-2 text-xs font-semibold text-white transition-colors hover:bg-aurex-blue-light"
                >
                  View Cart & Checkout
                </button>
              </div>
            </div>
          )}

          {/* Hover preview — empty */}
          {hovering && cart.length === 0 && (
            <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#1a1a2a]">
              <p className="text-center text-xs text-gray-400">Your cart is empty</p>
            </div>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        <div className="text-right">
          <p className="text-xs font-semibold leading-none text-gray-900 dark:text-white">{user.name}</p>
          <p className="mt-0.5 text-xs leading-none text-gray-400">{user.email}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-aurex-blue text-xs font-bold text-white">
          {user.initials}
        </div>
      </div>
    </header>
  );
}
