"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search, Plus, X, Pencil, Trash2, Info, ChevronDown,
  Package, FlaskConical, ArrowLeft, CheckCircle2,
} from "lucide-react";
import {
  getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
} from "@/lib/inventory-store";
import type { InventoryItem } from "@/lib/inventory-store";
import { getStoredUser } from "@/lib/mock-auth";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import type { Product, Category } from "@/lib/products";

const INVENTORY_CATEGORIES = [
  "Syringes & Needles",
  "Pipettes & Tips",
  "PPE",
  "Reagents & Chemicals",
  "Glassware",
  "Instruments",
  "Dissection & Biology",
  "Storage & Containers",
  "Office Supplies",
  "Cleaning & Maintenance",
  "Electronics",
  "Other",
];

const EMPTY_FORM = { name: "", sku: "", category: "Other", quantity: 0, location: "", notes: "" };

type AddStep = null | "choose" | "catalogue" | "catalogue-form" | "custom";

export default function InventoryPage() {
  const user = getStoredUser();
  const [items, setItems]         = useState<InventoryItem[]>([]);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editItem, setEditItem]   = useState<InventoryItem | null>(null);
  const [addStep, setAddStep]     = useState<AddStep>(null);
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Catalogue browser state
  const [catSearch, setCatSearch]       = useState("");
  const [catCatFilter, setCatCatFilter] = useState<Category | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => { setItems(getInventory()); }, []);

  if (!user) return null;
  if (user.role !== "super_admin" && user.role !== "department_admin") {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Inventory management is restricted to Super Admin and Department Admin roles.
      </div>
    );
  }

  const allCategories = [
    ...new Set([...INVENTORY_CATEGORIES, ...items.map((i) => i.category)]),
  ].sort();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      const matchCat = catFilter === "all" || item.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [items, search, catFilter]);

  // Filtered catalogue products
  const catalogueItems = useMemo(() => {
    const q = catSearch.toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchCat    = catCatFilter === "all" || p.category === catCatFilter;
      return matchSearch && matchCat;
    });
  }, [catSearch, catCatFilter]);

  function openAdd() {
    setForm({ ...EMPTY_FORM });
    setCatSearch("");
    setCatCatFilter("all");
    setSelectedProduct(null);
    setAddStep("choose");
  }

  function closeAdd() {
    setAddStep(null);
    setForm({ ...EMPTY_FORM });
    setSelectedProduct(null);
  }

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setForm((f) => ({
      ...f,
      name:     product.name,
      sku:      product.sku,
      category: product.category,
      quantity: 0,
      location: "",
      notes:    "",
    }));
    setAddStep("catalogue-form");
  }

  function handleAdd() {
    if (!form.name.trim() || !form.sku.trim()) return;
    const updated = addInventoryItem(
      { name: form.name, sku: form.sku, category: form.category, quantity: form.quantity, location: form.location, notes: form.notes },
      user!.name,
    );
    setItems(updated);
    closeAdd();
  }

  function handleSaveEdit() {
    if (!editItem) return;
    const updated = updateInventoryItem(
      editItem.id,
      { name: editItem.name, sku: editItem.sku, category: editItem.category, quantity: editItem.quantity, location: editItem.location, notes: editItem.notes },
      user!.name,
    );
    setItems(updated);
    setEditItem(null);
  }

  function handleDelete(id: string) {
    setItems(deleteInventoryItem(id));
    setDeleteConfirm(null);
  }

  const fi = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:bg-white focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/8";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Inventory</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{items.length} items tracked</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-aurex-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light"
        >
          <Plus size={15} /> Add New Item
        </button>
      </div>

      {/* QR callout */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/10">
        <Info size={14} className="mt-0.5 shrink-0 text-blue-500" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <span className="font-semibold">Coming soon:</span> QR code check-in and check-out for inventory management — scan items in and out with your device camera.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, SKU, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white dark:placeholder-gray-600"
          />
        </div>
        <div className="relative">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
          >
            <option value="all">All Categories</option>
            {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {(search || catFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setCatFilter("all"); }}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-gray-500 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
        <p className="text-sm text-gray-400">{filtered.length} shown</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Package size={36} className="text-gray-200 dark:text-gray-700" />
            <p className="text-sm text-gray-400">No inventory items yet.</p>
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 rounded-lg bg-aurex-blue px-4 py-2 text-xs font-semibold text-white hover:bg-aurex-blue-light"
            >
              <Plus size={13} /> Add your first item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-white/8 dark:bg-white/3">
                  {["Name", "SKU", "Category", "Qty", "Location", "Last Updated", "Updated By", ""].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filtered.map((item) => (
                  <tr key={item.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/3">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      {item.notes && <p className="mt-0.5 truncate text-xs text-gray-400 max-w-[180px]">{item.notes}</p>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{item.sku}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${item.quantity === 0 ? "text-red-500 dark:text-red-400" : item.quantity < 5 ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {item.location || <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                      {new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{item.updatedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => setEditItem({ ...item })}
                          className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:border-aurex-blue hover:text-aurex-blue dark:border-white/10 dark:text-gray-400"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:border-red-400 hover:text-red-500 dark:border-white/10 dark:text-gray-400"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-gray-400">
                      No items match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add flow modals ── */}

      {/* Step: Choose source */}
      {addStep === "choose" && (
        <Modal onClose={closeAdd}>
          <ModalHeader title="Add Inventory Item" onClose={closeAdd} />
          <div className="p-6">
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-300">
              How would you like to add this item?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAddStep("catalogue")}
                className="group flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-5 text-left transition hover:border-aurex-blue hover:bg-aurex-blue/5 dark:border-white/10 dark:bg-white/3 dark:hover:border-aurex-blue dark:hover:bg-aurex-blue/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aurex-blue/10">
                  <FlaskConical size={18} className="text-aurex-blue" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">From Aurex Catalogue</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                    Quick-add products directly from our medical supply catalogue. Name, SKU, and category are pre-filled.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setAddStep("custom")}
                className="group flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-5 text-left transition hover:border-gray-400 hover:bg-gray-50 dark:border-white/10 dark:bg-white/3 dark:hover:border-white/20 dark:hover:bg-white/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/8">
                  <Package size={18} className="text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Custom Item</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                    Add a product from another vendor or existing stock you had before switching to Aurex.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Step: Browse catalogue */}
      {addStep === "catalogue" && (
        <Modal onClose={closeAdd} wide>
          <ModalHeader
            title="Add from Aurex Catalogue"
            onClose={closeAdd}
            onBack={() => setAddStep("choose")}
          />
          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-3 dark:border-white/8">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU…"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                autoFocus
              />
            </div>
            <div className="relative shrink-0">
              <select
                value={catCatFilter}
                onChange={(e) => setCatCatFilter(e.target.value as Category | "all")}
                className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-7 text-sm text-gray-700 focus:border-aurex-blue focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-4">
            {catalogueItems.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <Package size={28} className="text-gray-200 dark:text-gray-700" />
                <p className="text-sm text-gray-400">No products match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                {catalogueItems.map((product) => (
                  <button
                    key={product.sku}
                    onClick={() => handleSelectProduct(product)}
                    className="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 text-left transition hover:border-aurex-blue hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/3 dark:hover:border-aurex-blue dark:hover:bg-white/6"
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="rounded-full bg-aurex-blue/10 px-2 py-0.5 text-[10px] font-medium text-aurex-blue">
                        {product.category}
                      </span>
                      {product.inStock ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
                          <CheckCircle2 size={10} /> In Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-gray-400">Out of Stock</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold leading-tight text-gray-900 dark:text-white line-clamp-2">
                        {product.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-gray-400">{product.sku}</p>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ${product.price.toFixed(2)} / {product.unit}
                      </span>
                      <span className="text-[10px] font-semibold text-aurex-blue opacity-0 transition group-hover:opacity-100">
                        Select →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 px-6 py-3 dark:border-white/8">
            <p className="text-xs text-gray-400">
              {catalogueItems.length} product{catalogueItems.length !== 1 ? "s" : ""} shown · Click a product to add it to inventory
            </p>
          </div>
        </Modal>
      )}

      {/* Step: Set details for catalogue product */}
      {addStep === "catalogue-form" && selectedProduct && (
        <Modal onClose={closeAdd}>
          <ModalHeader
            title="Set Inventory Details"
            onClose={closeAdd}
            onBack={() => setAddStep("catalogue")}
          />
          <div className="p-6 space-y-5">
            {/* Product info card */}
            <div className="flex items-start gap-3 rounded-xl border border-aurex-blue/20 bg-aurex-blue/5 p-4 dark:border-aurex-blue/30 dark:bg-aurex-blue/10">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-aurex-blue/10">
                <FlaskConical size={16} className="text-aurex-blue" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{selectedProduct.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{selectedProduct.sku}</span>
                  <span className="rounded-full bg-aurex-blue/10 px-2 py-0.5 text-[10px] font-medium text-aurex-blue">
                    {selectedProduct.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ${selectedProduct.price.toFixed(2)} / {selectedProduct.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity on Hand" required>
                <input
                  className={fi}
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value) || 0 }))}
                  autoFocus
                />
              </Field>
              <Field label="Storage Location">
                <input
                  className={fi}
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Room 204 — Shelf B3"
                />
              </Field>
            </div>
            <Field label="Notes (optional)">
              <textarea
                className={`${fi} min-h-[72px] resize-y`}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any additional details…"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/8">
            <button
              onClick={() => setAddStep("catalogue")}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Back
            </button>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-aurex-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-aurex-blue-light"
            >
              Add to Inventory
            </button>
          </div>
        </Modal>
      )}

      {/* Step: Custom item (full form) */}
      {addStep === "custom" && (
        <InventoryModal
          title="Add Custom Item"
          values={form}
          categories={allCategories}
          onChange={(updates) => setForm((f) => ({ ...f, ...updates }))}
          onSave={handleAdd}
          onClose={closeAdd}
          onBack={() => setAddStep("choose")}
          canSave={!!form.name.trim() && !!form.sku.trim()}
          fi={fi}
        />
      )}

      {/* Edit modal */}
      {editItem && (
        <InventoryModal
          title="Edit Item"
          values={editItem}
          categories={allCategories}
          onChange={(updates) => setEditItem((p) => p ? { ...p, ...updates } : p)}
          onSave={handleSaveEdit}
          onClose={() => setEditItem(null)}
          canSave={!!editItem.name.trim() && !!editItem.sku.trim()}
          fi={fi}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Delete item?</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {`"${items.find((i) => i.id === deleteConfirm)?.name}"`} will be permanently removed from inventory.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Shared modal shell ----

function Modal({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a] ${wide ? "max-w-3xl" : "max-w-lg"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  title, onClose, onBack,
}: {
  title: string;
  onClose: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-white/8">
      {onBack && (
        <button
          onClick={onBack}
          className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/8 dark:hover:text-gray-300"
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
      )}
      <h2 className="flex-1 text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
      <button
        onClick={onClose}
        className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// ---- Full inventory form modal (custom item + edit) ----

function InventoryModal({
  title, values, categories, onChange, onSave, onClose, onBack, canSave, fi,
}: {
  title: string;
  values: { name: string; sku: string; category: string; quantity: number; location: string; notes: string };
  categories: string[];
  onChange: (updates: Partial<typeof values>) => void;
  onSave: () => void;
  onClose: () => void;
  onBack?: () => void;
  canSave: boolean;
  fi: string;
}) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title={title} onClose={onClose} onBack={onBack} />
      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Item Name" required>
            <input
              className={fi}
              value={values.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. BD 10mL Syringe"
              autoFocus
            />
          </Field>
          <Field label="SKU / ID" required>
            <input
              className={fi}
              value={values.sku}
              onChange={(e) => onChange({ sku: e.target.value })}
              placeholder="e.g. SYR-010"
            />
          </Field>
          <Field label="Category">
            <select
              className={fi}
              value={values.category}
              onChange={(e) => onChange({ category: e.target.value })}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Quantity on Hand">
            <input
              className={fi}
              type="number"
              min="0"
              value={values.quantity}
              onChange={(e) => onChange({ quantity: parseInt(e.target.value) || 0 })}
            />
          </Field>
        </div>
        <Field label="Storage Location">
          <input
            className={fi}
            value={values.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="e.g. Room 204 — Shelf B3"
          />
        </Field>
        <Field label="Notes (optional)">
          <textarea
            className={`${fi} min-h-[72px] resize-y`}
            value={values.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Any additional details…"
          />
        </Field>
      </div>
      <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/8">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="rounded-lg bg-aurex-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-aurex-blue-light disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}{required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
