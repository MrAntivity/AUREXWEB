import { PRODUCTS as DEFAULT_PRODUCTS, CATEGORY_FULFILLMENT, CATEGORIES } from "./products";
import type { Category } from "./products";

export type { Category };
export { CATEGORIES };

export type ManagedProduct = {
  sku: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  description: string;
  stock: number;
  fulfillmentTime: string;
  estimatedDelivery: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

const STORE_KEY = "aurex_product_store";

function defaultStock(sku: string): number {
  if (sku.startsWith("SYR")) return 150;
  if (sku.startsWith("PPE")) return 250;
  if (sku.startsWith("REA")) return 60;
  if (sku.startsWith("GLA")) return 40;
  if (sku.startsWith("INS")) return 8;
  if (sku.startsWith("DIS")) return 20;
  if (sku.startsWith("STO")) return 200;
  if (sku.startsWith("PIP")) {
    const num = parseInt(sku.split("-")[1] ?? "0");
    return num >= 6 ? 200 : 10;
  }
  return 50;
}

function buildDefaults(): ManagedProduct[] {
  const now = new Date().toISOString();
  return DEFAULT_PRODUCTS.map((p) => ({
    ...p,
    stock: defaultStock(p.sku),
    fulfillmentTime: CATEGORY_FULFILLMENT[p.category].fulfillmentTime,
    estimatedDelivery: CATEGORY_FULFILLMENT[p.category].estimatedDelivery,
    images: [],
    createdAt: now,
    updatedAt: now,
    updatedBy: "system",
  }));
}

export function getProducts(): ManagedProduct[] {
  if (typeof window === "undefined") return buildDefaults();
  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) return JSON.parse(stored) as ManagedProduct[];
  } catch {}
  return buildDefaults();
}

export function saveProducts(products: ManagedProduct[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(products));
}

export function updateProduct(
  sku: string,
  updates: Partial<Omit<ManagedProduct, "sku" | "createdAt">>,
  updatedBy: string
): ManagedProduct[] {
  const products = getProducts();
  const idx = products.findIndex((p) => p.sku === sku);
  if (idx === -1) return products;
  products[idx] = {
    ...products[idx],
    ...updates,
    sku,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  saveProducts(products);
  return products;
}

export function addProduct(
  product: Omit<ManagedProduct, "createdAt" | "updatedAt" | "updatedBy">,
  createdBy: string
): ManagedProduct[] {
  const products = getProducts();
  const now = new Date().toISOString();
  products.push({ ...product, createdAt: now, updatedAt: now, updatedBy: createdBy });
  saveProducts(products);
  return products;
}
