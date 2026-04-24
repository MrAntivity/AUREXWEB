export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  location: string;
  notes: string;
  updatedAt: string;
  updatedBy: string;
};

export const INVENTORY_KEY = "aurex_inventory";

export function getInventory(): InventoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    return raw ? (JSON.parse(raw) as InventoryItem[]) : [];
  } catch {
    return [];
  }
}

function saveInventory(items: InventoryItem[]): void {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}

export function addInventoryItem(
  data: Omit<InventoryItem, "id" | "updatedAt" | "updatedBy">,
  by: string
): InventoryItem[] {
  const items = getInventory();
  items.push({
    ...data,
    id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    updatedAt: new Date().toISOString(),
    updatedBy: by,
  });
  saveInventory(items);
  return items;
}

export function updateInventoryItem(
  id: string,
  updates: Partial<Omit<InventoryItem, "id">>,
  by: string
): InventoryItem[] {
  const items = getInventory().map((item) =>
    item.id === id
      ? { ...item, ...updates, id, updatedAt: new Date().toISOString(), updatedBy: by }
      : item
  );
  saveInventory(items);
  return items;
}

export function deleteInventoryItem(id: string): InventoryItem[] {
  const items = getInventory().filter((i) => i.id !== id);
  saveInventory(items);
  return items;
}
