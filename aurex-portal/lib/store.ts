import type { Product } from "@/lib/products";
import type { MockUser } from "@/lib/mock-auth";

export type CartItem = {
  product: Product;
  qty: number;
};

export type OrderStatus = "pending" | "approved" | "rejected";

export type Order = {
  id: string;
  requestNumber: string;
  items: CartItem[];
  total: number;
  requester: Pick<MockUser, "name" | "email" | "department" | "role">;
  status: OrderStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
};

export const CART_KEY = "aurex_cart";
export const ORDERS_KEY = "aurex_orders";
export const COUNTER_KEY = "aurex_order_counter";
