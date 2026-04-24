"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ArrowRight,
  Package,
} from "lucide-react";
import { useStore } from "@/components/portal/StoreProvider";
import { getStoredUser } from "@/lib/mock-auth";

export default function CartPage() {
  const {
    cart,
    savedItems,
    updateQty,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    cartTotal,
    submitOrder,
  } = useStore();

  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ number: string; isAdmin: boolean } | null>(null);
  const router = useRouter();
  const user = getStoredUser();

  const isAdmin =
    user?.role === "super_admin" || user?.role === "department_admin";

  function handleSubmit() {
    if (!user || cart.length === 0) return;
    const order = submitOrder({
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      location: user.location,
    });
    setLastOrder({ number: order.requestNumber, isAdmin });
    setSubmitted(true);
  }

  if (submitted && lastOrder) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {lastOrder.isAdmin ? "Order Placed!" : "Order Submitted!"}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            <span className="font-mono font-semibold">{lastOrder.number}</span>{" "}
            {lastOrder.isAdmin
              ? "has been automatically approved and is being processed."
              : "is pending department admin approval."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSubmitted(false);
              setLastOrder(null);
            }}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/portal/orders")}
            className="flex items-center gap-2 rounded-lg bg-aurex-blue px-4 py-2 text-sm font-semibold text-white hover:bg-aurex-blue-light"
          >
            View Orders <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Cart</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {cart.length === 0
              ? "Your cart is empty."
              : `${totalQty} item${totalQty !== 1 ? "s" : ""} ready to submit`}
          </p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-gray-400 transition-colors hover:text-red-500"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Empty state */}
      {cart.length === 0 && savedItems.length === 0 && (
        <div className="card flex h-48 flex-col items-center justify-center gap-3 text-center">
          <ShoppingCart size={36} className="text-gray-200 dark:text-gray-700" />
          <p className="text-sm text-gray-400">No items in your cart</p>
          <button
            onClick={() => router.push("/portal/catalog")}
            className="text-sm font-medium text-aurex-blue hover:underline"
          >
            Browse catalog →
          </button>
        </div>
      )}

      {/* Cart items */}
      {cart.length > 0 && (
        <>
          <div className="card divide-y divide-gray-50 dark:divide-white/5">
            {cart.map((item) => (
              <div key={item.product.sku} className="flex items-start gap-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                  <Package size={18} className="text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.product.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">{item.product.sku}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{item.product.unit}</p>
                  <p className="mt-1.5 text-sm font-bold text-aurex-blue">
                    ${(item.product.price * item.qty).toFixed(2)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.product.sku, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-gray-400 dark:border-white/10 dark:hover:border-white/30"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.product.sku, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-gray-400 dark:border-white/10 dark:hover:border-white/30"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => saveForLater(item.product.sku)}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-50 hover:text-aurex-blue dark:hover:bg-white/5"
                    >
                      <Bookmark size={11} /> Save for later
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.sku)}
                      className="rounded-md p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary + submit */}
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Order Summary</h2>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/8">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Subtotal ({totalQty} item{totalQty !== 1 ? "s" : ""})
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            {isAdmin ? (
              <p className="text-xs text-green-600 dark:text-green-400">
                As an admin, your order will be automatically approved and processed immediately.
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Orders require department admin approval before processing.
              </p>
            )}
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-aurex-blue py-3 text-sm font-bold text-white transition-colors hover:bg-aurex-blue-light"
            >
              {isAdmin ? "Place Order" : "Submit for Approval"}
            </button>
          </div>
        </>
      )}

      {/* Saved for later */}
      {savedItems.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Saved for Later
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-white/10 dark:text-gray-400">
              {savedItems.length}
            </span>
          </h2>
          <div className="card divide-y divide-gray-50 dark:divide-white/5">
            {savedItems.map((item) => (
              <div key={item.product.sku} className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                  <Package size={18} className="text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.product.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">{item.product.sku}</p>
                  <p className="mt-1 text-sm font-bold text-aurex-blue">
                    ${item.product.price.toFixed(2)}{" "}
                    <span className="font-normal text-gray-400">/ {item.product.unit}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => moveToCart(item.product.sku)}
                    className="flex items-center gap-1.5 rounded-lg border border-aurex-blue/30 px-3 py-1.5 text-xs font-medium text-aurex-blue transition-colors hover:bg-aurex-blue/5"
                  >
                    <BookmarkCheck size={11} /> Move to cart
                  </button>
                  <button
                    onClick={() => removeFromSaved(item.product.sku)}
                    className="rounded-md p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
