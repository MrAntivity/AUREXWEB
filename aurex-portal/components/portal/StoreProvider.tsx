"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, Order, OrderStatus, OrderEvent } from "@/lib/store";
import { CART_KEY, SAVED_KEY, ORDERS_KEY, COUNTER_KEY } from "@/lib/store";
import type { MockUser } from "@/lib/mock-auth";
import type { Product } from "@/lib/products";
import { addNotification } from "@/lib/notifications";

type StoreContextValue = {
  cart: CartItem[];
  savedItems: CartItem[];
  orders: Order[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  clearCart: () => void;
  saveForLater: (sku: string) => void;
  addToSaved: (product: Product) => void;
  moveToCart: (sku: string) => void;
  removeFromSaved: (sku: string) => void;
  submitOrder: (requester: Pick<MockUser, "name" | "email" | "department" | "role"> & { location?: string }) => Order;
  approveOrder: (orderId: string, reviewerName: string, notes?: string) => void;
  rejectOrder: (orderId: string, reviewerName: string, notes?: string) => void;
  editAndResubmit: (orderId: string, newItems: CartItem[], requesterName: string) => void;
  clearOrders: () => void;
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

const ADMIN_ROLES = new Set(["super_admin", "department_admin"]);

export function StoreProvider({
  children,
  userEmail,
  institutionId,
}: {
  children: React.ReactNode;
  userEmail: string;
  institutionId: string;
}) {
  const cartKey = `${CART_KEY}_${userEmail}`;
  const savedKey = `${SAVED_KEY}_${userEmail}`;
  const counterKey = `${COUNTER_KEY}_${institutionId}`;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(load<CartItem[]>(cartKey, []));
    setSavedItems(load<CartItem[]>(savedKey, []));
    const allOrders = load<Order[]>(ORDERS_KEY, []);
    setOrders(allOrders.filter((o) => o.institutionId === institutionId));
    setHydrated(true);
  }, [cartKey, savedKey, institutionId]);

  useEffect(() => {
    if (hydrated) save(cartKey, cart);
  }, [cart, hydrated, cartKey]);

  useEffect(() => {
    if (hydrated) save(savedKey, savedItems);
  }, [savedItems, hydrated, savedKey]);

  useEffect(() => {
    if (!hydrated) return;
    const allOrders = load<Order[]>(ORDERS_KEY, []);
    const others = allOrders.filter((o) => o.institutionId !== institutionId);
    save(ORDERS_KEY, [...others, ...orders]);
  }, [orders, hydrated, institutionId]);

  useEffect(() => {
    if (!hydrated) return;
    function handleStorage(e: StorageEvent) {
      if (e.key === ORDERS_KEY) {
        const allOrders = load<Order[]>(ORDERS_KEY, []);
        setOrders(allOrders.filter((o) => o.institutionId === institutionId));
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [hydrated, institutionId]);

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

  const saveForLater = useCallback((sku: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.sku === sku);
      if (item) {
        setSavedItems((s) => {
          const exists = s.find((i) => i.product.sku === sku);
          return exists ? s : [...s, item];
        });
        return prev.filter((i) => i.product.sku !== sku);
      }
      return prev;
    });
  }, []);

  const addToSaved = useCallback((product: Product) => {
    setSavedItems((prev) => {
      const exists = prev.find((i) => i.product.sku === product.sku);
      return exists ? prev : [...prev, { product, qty: 1 }];
    });
  }, []);

  const moveToCart = useCallback((sku: string) => {
    setSavedItems((prev) => {
      const item = prev.find((i) => i.product.sku === sku);
      if (item) {
        setCart((c) => {
          const exists = c.find((i) => i.product.sku === sku);
          return exists ? c : [...c, item];
        });
        return prev.filter((i) => i.product.sku !== sku);
      }
      return prev;
    });
  }, []);

  const removeFromSaved = useCallback((sku: string) => {
    setSavedItems((prev) => prev.filter((i) => i.product.sku !== sku));
  }, []);

  const submitOrder = useCallback(
    (requester: Pick<MockUser, "name" | "email" | "department" | "role"> & { location?: string }): Order => {
      const counter = load<number>(counterKey, 0) + 1;
      save(counterKey, counter);
      const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
      const now = new Date().toISOString();
      const isAdmin = ADMIN_ROLES.has(requester.role);

      const order: Order = {
        id: `ord_${Date.now()}`,
        requestNumber: `PR-${new Date().getFullYear()}-${String(counter).padStart(3, "0")}`,
        items: [...cart],
        total,
        requester,
        institutionId,
        status: isAdmin ? ("approved" as OrderStatus) : ("pending" as OrderStatus),
        submittedAt: now,
        ...(isAdmin
          ? {
              reviewedBy: requester.name,
              reviewedAt: now,
              reviewNotes: "Auto-approved by admin",
            }
          : {}),
        timeline: [
          { stage: "requested", by: requester.name, at: now },
          ...(isAdmin
            ? [{ stage: "approved" as const, by: requester.name, at: now, notes: "Auto-approved" }]
            : []),
        ],
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      setCartOpen(false);
      return order;
    },
    [cart, institutionId, counterKey]
  );

  const approveOrder = useCallback((orderId: string, reviewerName: string, notes?: string) => {
    const now = new Date().toISOString();
    const event: OrderEvent = { stage: "approved", by: reviewerName, at: now, ...(notes ? { notes } : {}) };
    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      if (target) {
        addNotification(target.requester.email, {
          orderId,
          orderNumber: target.requestNumber,
          type: "approved",
          byName: reviewerName,
          ...(notes ? { reason: notes } : {}),
          at: now,
        });
      }
      return prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "approved" as OrderStatus,
              reviewedBy: reviewerName,
              reviewedAt: now,
              reviewNotes: notes,
              timeline: [...(o.timeline ?? []), event],
            }
          : o
      );
    });
  }, []);

  const rejectOrder = useCallback((orderId: string, reviewerName: string, notes?: string) => {
    const now = new Date().toISOString();
    const event: OrderEvent = { stage: "rejected", by: reviewerName, at: now, ...(notes ? { notes } : {}) };
    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      if (target) {
        addNotification(target.requester.email, {
          orderId,
          orderNumber: target.requestNumber,
          type: "rejected",
          byName: reviewerName,
          ...(notes ? { reason: notes } : {}),
          at: now,
        });
      }
      return prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "rejected" as OrderStatus,
              reviewedBy: reviewerName,
              reviewedAt: now,
              reviewNotes: notes,
              timeline: [...(o.timeline ?? []), event],
            }
          : o
      );
    });
  }, []);

  const editAndResubmit = useCallback((orderId: string, newItems: CartItem[], requesterName: string) => {
    const now = new Date().toISOString();
    const newTotal = newItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const { reviewedBy: _rb, reviewedAt: _ra, reviewNotes: _rn, ...rest } = o;
        return {
          ...rest,
          items: newItems,
          total: newTotal,
          status: "pending" as OrderStatus,
          timeline: [
            ...(o.timeline ?? []),
            { stage: "edited" as const, by: requesterName, at: now, notes: "Edited and resubmitted after rejection" },
            { stage: "requested" as const, by: requesterName, at: now },
          ],
        };
      })
    );
  }, []);

  const clearOrders = useCallback(() => setOrders([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        savedItems,
        orders,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        saveForLater,
        addToSaved,
        moveToCart,
        removeFromSaved,
        submitOrder,
        approveOrder,
        rejectOrder,
        editAndResubmit,
        clearOrders,
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
