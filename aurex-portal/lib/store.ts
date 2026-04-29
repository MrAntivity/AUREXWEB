import type { Product } from "@/lib/products";
import type { MockUser } from "@/lib/mock-auth";

export type CartItem = {
  product: Product;
  qty: number;
};

export type OrderStatus = "pending" | "approved" | "rejected" | "fulfilled" | "shipped" | "delivered" | "cancelled" | "refunded";

export type TimelineStage = "requested" | "approved" | "rejected" | "fulfilled" | "shipped" | "delivered" | "cancelled" | "refunded" | "edited";

export type OrderEvent = {
  stage: TimelineStage;
  by: string;
  at: string;
  notes?: string;
};

export type Order = {
  id: string;
  requestNumber: string;
  items: CartItem[];
  total: number;
  requester: Pick<MockUser, "name" | "email" | "department" | "role"> & { location?: string };
  status: OrderStatus;
  submittedAt: string;
  institutionId: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  trackingCode?: string;
  timeline: OrderEvent[];
};

export const CART_KEY = "aurex_cart";
export const SAVED_KEY = "aurex_saved";
export const ORDERS_KEY = "aurex_orders";
export const COUNTER_KEY = "aurex_order_counter";
export const BUDGETS_KEY = "aurex_budgets";
export const BUDGET_WARNING_KEY = "aurex_budget_warning_pct";
