"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, Order, OrderStatus } from "@/lib/store";
import { CART_KEY, ORDERS_KEY, COUNTER_KEY } from "@/lib/store";
import type { MockUser } from "@/lib/mock-auth";
import type { Product } from "@/lib/products";

type StoreContextValue = {
  cart: CartItem[];
  orders: Order[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  clearCart: () => void;
  submitOrder: (requester: Pick<MockUser, "name" | "email" | "department" | "role">) => Order;
  approveOrder: (orderId: string, reviewerName: string, notes?: string) => void;
  rejectOrder: (orderId: string, reviewerName: string, notes?: string) => void;
  cartTotal: number;
  cartCount: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(load<CartItem[]>(CART_KEY, []));
    setOrders(load<Order[]>(ORDERS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(CART_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) save(ORDERS_KEY, orders);
  }, [orders, hydrated]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.sku === product.sku);
      if (existing) {
        return prev.map((i) =>
          i.product.sku === product.sku ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((sku: string) => {
    setCart((prev) => prev.filter((i) => i.product.sku !== sku));
  }, []);

  const updateQty = useCallback((sku: string, qty: number) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((i) => i.product.sku !== sku));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.product.sku === sku ? { ...i, qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const submitOrder = useCallback(
    (requester: Pick<MockUser, "name" | "email" | "department" | "role">): Order => {
      const counter = load<number>(COUNTER_KEY, 0) + 1;
      save(COUNTER_KEY, counter);
      const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
      const order: Order = {
        id: `ord_${Date.now()}`,
        requestNumber: `PR-${new Date().getFullYear()}-${String(counter).padStart(3, "0")}`,
        items: [...cart],
        total,
        requester,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      setCartOpen(false);
      return order;
    },
    [cart]
  );

  const approveOrder = useCallback((orderId: string, reviewerName: string, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "approved" as OrderStatus,
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes,
            }
          : o
      )
    );
  }, []);

  const rejectOrder = useCallback((orderId: string, reviewerName: string, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "rejected" as OrderStatus,
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes,
            }
          : o
      )
    );
  }, []);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        orders,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        submitOrder,
        approveOrder,
        rejectOrder,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
