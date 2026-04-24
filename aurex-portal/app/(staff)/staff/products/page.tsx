"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, X, ImageIcon, Save, AlertTriangle, ChevronDown, Filter } from "lucide-react";
import { getProducts, updateProduct, addProduct, CATEGORIES } from "@/lib/product-store";
import type { ManagedProduct, Category } from "@/lib/product-store";
import { CATEGORY_COLOR } from "@/lib/products";
import { getStoredStaffUser } from "@/lib/staff-auth";
import { addAuditEntry } from "@/lib/audit-log";

const EMPTY_PRODUCT: Omit<ManagedProduct, "createdAt" | "updatedAt" | "updatedBy"> = {
  sku: "",
  name: "",
  category: "Syringes & Needles",
  price: 0,
  unit: "",
  description: "",
  stock: 0,
  fulfillmentTime: "1-2 business days",
  estimatedDelivery: "3-5 business days",
  images: [],
};

export default function StaffProductsPage() {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "All">("All");
  const [filterStock, setFilterStock] = useState<"all" | "low" | "out">("all");
  const [editProduct, setEditProduct] = useState<ManagedProduct | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...EMPTY_PRODUCT });
  const [saving, setSaving] = useState(false);
  const [savedSku, setSavedSku] = useState<string | null>(null);

  useEffect(() => { setProducts(getProducts()); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchCat = filterCat === "All" || p.category === filterCat;
      const matchStock =
        filterStock === "all" ? true :
        filterStock === "low" ? (p.stock > 0 && p.stock < 10) :
        p.stock === 0;
      return matchSearch && matchCat && matchStock;
    });
  }, [products, search, filterCat, filterStock]);

  function stockBadge(stock: number) {
    if (stock === 0) return <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">Out of stock</span>;
    if (stock < 10) return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">{stock} left</span>;
    return <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">{stock} in stock</span>;
  }

  function handleSaveEdit() {
    if (!editProduct) return;
    const user = getStoredStaffUser();
    const userName = user?.name ?? "Unknown";
    setSaving(true);
    const updated = updateProduct(editProduct.sku, {
      name: editProduct.name,
      category: editProduct.category,
      price: editProduct.price,
      unit: editProduct.unit,
      description: editProduct.description,
      stock: editProduct.stock,
      fulfillmentTime: editProduct.fulfillmentTime,
      estimatedDelivery: editProduct.estimatedDelivery,
    }, userName);
    addAuditEntry({
      userName: user?.name ?? "Unknown",
      userEmail: user?.email ?? "",
      action: "product_updated",
      target: editProduct.sku,
      details: `Updated product "${editProduct.name}" (SKU: ${editProduct.sku})`,
    });
    setProducts(updated);
    setSavedSku(editProduct.sku);
    setTimeout(() => { setSaving(false); setEditProduct(null); setSavedSku(null); }, 600);
  }

  function handleAddProduct() {
    if (!newProduct.sku || !newProduct.name) return;
    const user = getStoredStaffUser();
    const updated = addProduct(newProduct, user?.name ?? "Unknown");
    addAuditEntry({
      userName: user?.name ?? "Unknown",
      userEmail: user?.email ?? "",
      action: "product_created",
      target: newProduct.sku,
      details: `Created product "${newProduct.name}" (SKU: ${newProduct.sku})`,
    });
    setProducts(updated);
    setIsAdding(false);
    setNewProduct({ ...EMPTY_PRODUCT });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Products</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{products.length} products total</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-aurex-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white dark:placeholder-gray-600"
          />
        </div>
        <div className="relative">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value as Category | "All")}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value as "all" | "low" | "out")}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock (&lt;10)</option>
            <option value="out">Out of Stock</option>
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {(search || filterCat !== "All" || filterStock !== "all") && (
          <button
            onClick={() => { setSearch(""); setFilterCat("All"); setFilterStock("all"); }}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-gray-500 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
        <p className="text-sm text-gray-400">{filtered.length} shown</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-white/8 dark:bg-white/3">
                {["SKU", "Product", "Category", "Price", "Stock", "Fulfillment", "Last Updated", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filtered.map((p) => (
                <tr key={p.sku} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/3">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.sku}</td>
                  <td className="max-w-[200px] px-4 py-3">
                    <p className="truncate font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">{p.unit}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[p.category]}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{stockBadge(p.stock)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{p.fulfillmentTime}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                    {new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    <span className="ml-1 text-gray-300 dark:text-gray-600">by {p.updatedBy}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditProduct({ ...p })}
                      className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 opacity-0 transition group-hover:opacity-100 hover:border-aurex-blue hover:text-aurex-blue dark:border-white/10 dark:text-gray-400"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-sm text-gray-400">No products match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editProduct && (
        <ProductModal
          title="Edit Product"
          product={editProduct}
          onChange={(updates) => setEditProduct((p) => p ? { ...p, ...updates } : p)}
          onSave={handleSaveEdit}
          onClose={() => setEditProduct(null)}
          saving={saving}
          isEdit
        />
      )}

      {isAdding && (
        <ProductModal
          title="Add New Product"
          product={newProduct as ManagedProduct}
          onChange={(updates) => setNewProduct((p) => ({ ...p, ...updates }))}
          onSave={handleAddProduct}
          onClose={() => { setIsAdding(false); setNewProduct({ ...EMPTY_PRODUCT }); }}
          saving={false}
          isEdit={false}
        />
      )}
    </div>
  );
}

function ProductModal({
  title, product, onChange, onSave, onClose, saving, isEdit,
}: {
  title: string;
  product: ManagedProduct;
  onChange: (updates: Partial<ManagedProduct>) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  isEdit: boolean;
}) {
  const fi = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-aurex-blue focus:ring-1 focus:ring-aurex-blue disabled:bg-gray-50 disabled:text-gray-400 dark:border-white/10 dark:bg-[#131320] dark:text-white dark:placeholder-gray-600 dark:disabled:bg-[#1a1a2a] dark:disabled:text-gray-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 dark:border-white/8 dark:bg-[#1a1a2a]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/8 dark:hover:text-gray-300">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Product Images</label>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center dark:border-white/10 dark:bg-white/3">
                  <div className="p-2">
                    <ImageIcon size={20} className="mx-auto text-gray-300 dark:text-gray-600" />
                    {i === 0 && <p className="mt-1 text-[10px] text-gray-400">Coming soon</p>}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">Image uploads available when cloud storage is connected.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <F label="Product Name" required><input className={fi} value={product.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="e.g. BD Luer-Lock Syringe 5mL" /></F>
            <F label="SKU" required><input className={fi} value={product.sku} onChange={(e) => onChange({ sku: e.target.value })} placeholder="e.g. SYR-003" disabled={isEdit} /></F>
            <F label="Category"><select className={fi} value={product.category} onChange={(e) => onChange({ category: e.target.value as Category })}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></F>
            <F label="Unit"><input className={fi} value={product.unit} onChange={(e) => onChange({ unit: e.target.value })} placeholder="e.g. Box/50, Each, Pack/100" /></F>
            <F label="Price ($)"><input className={fi} type="number" step="0.01" min="0" value={product.price} onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })} /></F>
            <F label="Units in Stock"><input className={fi} type="number" min="0" value={product.stock} onChange={(e) => onChange({ stock: parseInt(e.target.value) || 0 })} /></F>
            <F label="Fulfillment Time"><input className={fi} value={product.fulfillmentTime} onChange={(e) => onChange({ fulfillmentTime: e.target.value })} placeholder="e.g. Same day, 1–2 business days" /></F>
            <F label="Estimated Delivery"><input className={fi} value={product.estimatedDelivery} onChange={(e) => onChange({ estimatedDelivery: e.target.value })} placeholder="e.g. 2–4 business days" /></F>
          </div>

          <F label="Description">
            <textarea
              className={`${fi} min-h-[80px] resize-y`}
              value={product.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Product description shown to users in the catalog…"
            />
          </F>

          {product.stock === 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-500/20 dark:bg-red-500/10">
              <AlertTriangle size={14} className="text-red-500" />
              <p className="text-xs font-medium text-red-600 dark:text-red-400">Stock is 0 — this product will show as &quot;Out of stock&quot; to users.</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4 dark:border-white/8 dark:bg-[#1a1a2a]">
          <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || !product.name || !product.sku}
            className="flex items-center gap-2 rounded-lg bg-aurex-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light disabled:opacity-50"
          >
            <Save size={14} /> {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function F({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">
        {label}{required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
