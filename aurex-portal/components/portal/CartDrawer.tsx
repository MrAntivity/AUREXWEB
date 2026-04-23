"use client";

import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, clearCart, cartTotal, submitOrder } =
    useStore();
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState<string | null>(null);

  if (!cartOpen) return null;

  function handleSubmit() {
    const user = getStoredUser();
    if (!user) return;
    const order = submitOrder({
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      location: user.location,
    });
    setLastOrder(order.requestNumber);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setLastOrder(null);
    }, 3500);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-aurex-blue" />
            <h2 className="text-sm font-semibold text-gray-900">Cart</h2>
            {cart.length > 0 && (
              <span className="rounded-full bg-aurex-blue px-2 py-0.5 text-xs font-bold text-white">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Submitted state */}
        {submitted ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <CheckCircle2 size={48} className="text-green-500" />
            <div>
              <p className="text-base font-semibold text-gray-900">Order submitted!</p>
              <p className="mt-1 text-sm text-gray-500">
                {lastOrder} is pending approval.
              </p>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingCart size={40} className="text-gray-200" />
            <p className="text-sm text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 divide-y divide-gray-50 overflow-y-auto px-5">
              {cart.map((item) => (
                <div key={item.product.sku} className="flex gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{item.product.name}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {item.product.sku} · {item.product.unit}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-aurex-blue">
                      ${(item.product.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.product.sku, item.qty - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-gray-400"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-7 text-center text-sm font-medium text-gray-900">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.product.sku, item.qty + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-gray-400"
                    >
                      <Plus size={11} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.sku)}
                      className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="space-y-4 border-t border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-base font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400">
                Orders require department admin approval before processing.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-aurex-blue py-2.5 text-sm font-bold text-white transition-colors hover:bg-aurex-blue-light"
                >
                  Submit Order
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
