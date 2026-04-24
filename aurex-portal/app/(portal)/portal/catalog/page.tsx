"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Clock, Truck, CheckCircle2, ImageIcon, AlertCircle, Bookmark } from "lucide-react";
import { CATEGORIES, CATEGORY_COLOR } from "@/lib/products";
import { getProducts } from "@/lib/product-store";
import type { ManagedProduct } from "@/lib/product-store";
import type { Category } from "@/lib/products";
import { useStore } from "@/components/portal/StoreProvider";
import type { Product } from "@/lib/products";

function toProduct(p: ManagedProduct): Product {
  return { sku: p.sku, name: p.name, category: p.category, price: p.price, unit: p.unit, description: p.description, inStock: p.stock > 0 };
}

const CATEGORY_DOT: Record<Category, string> = {
  "Syringes & Needles": "bg-blue-400",
  "Pipettes & Tips":    "bg-teal-400",
  "PPE":                "bg-orange-400",
  "Reagents & Chemicals": "bg-purple-400",
  "Glassware":          "bg-cyan-400",
  "Instruments":        "bg-gray-400",
  "Dissection & Biology": "bg-green-400",
  "Storage & Containers": "bg-red-400",
};

export default function CatalogPage() {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [detailProduct, setDetailProduct] = useState<ManagedProduct | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const { cart, savedItems, addToCart, updateQty, addToSaved } = useStore();

  useEffect(() => { setProducts(getProducts()); }, []);

  const cartMap = useMemo(
    () => Object.fromEntries(cart.map((i) => [i.product.sku, i.qty])),
    [cart]
  );

  const savedSet = useMemo(
    () => new Set(savedItems.map((i) => i.product.sku)),
    [savedItems]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, search, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  function openDetail(product: ManagedProduct) {
    setDetailProduct(product);
    const inCart = cartMap[product.sku] ?? 0;
    setModalQty(inCart > 0 ? inCart : 1);
  }

  function closeDetail() {
    setDetailProduct(null);
    setModalQty(1);
  }

  function handleModalAdd() {
    if (!detailProduct || detailProduct.stock === 0) return;
    const inCart = cartMap[detailProduct.sku] ?? 0;
    if (inCart > 0) {
      updateQty(detailProduct.sku, modalQty);
    } else {
      addToCart(toProduct(detailProduct));
      updateQty(detailProduct.sku, modalQty);
    }
    closeDetail();
  }

  function handleModalSave() {
    if (!detailProduct || detailProduct.stock === 0) return;
    addToSaved(toProduct(detailProduct));
    closeDetail();
  }

  return (
    <>
      <div className="flex h-full gap-6">
        {/* Category sidebar */}
        <aside className="w-48 shrink-0">
          <div className="sticky top-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#1a1a2a] dark:shadow-none">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Categories
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                selectedCategory === "All"
                  ? "bg-aurex-blue/10 font-semibold text-aurex-blue"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <span className="truncate">All Products</span>
              <span className="ml-1 shrink-0 text-xs text-gray-400">{categoryCounts["All"]}</span>
            </button>
            {(CATEGORIES as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-aurex-blue/10 font-semibold text-aurex-blue"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${CATEGORY_DOT[cat]}`} />
                  <span className="truncate text-xs">{cat}</span>
                </span>
                <span className="ml-1 shrink-0 text-xs text-gray-400">{categoryCounts[cat]}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products or SKUs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white dark:placeholder-gray-600 dark:focus:border-aurex-blue"
              />
            </div>
            <p className="text-sm text-gray-400">{filtered.length} products</p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              No products match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => {
                const inCart = cartMap[product.sku] ?? 0;
                const outOfStock = product.stock === 0;
                return (
                  <div
                    key={product.sku}
                    className={`group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all dark:border-white/10 dark:bg-[#1a1a2a] dark:shadow-none ${
                      outOfStock
                        ? "cursor-default opacity-60"
                        : "cursor-pointer hover:border-aurex-blue/30 hover:shadow-md dark:hover:border-aurex-blue/40"
                    }`}
                    onClick={() => !outOfStock && openDetail(product)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[product.category]}`}>
                        {product.category}
                      </span>
                      {outOfStock ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          Out of stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          {product.stock} in stock
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-tight text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-gray-400">{product.sku}</p>
                      <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">{product.description}</p>
                    </div>

                    <div
                      className="flex items-center justify-between"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">{product.unit}</p>
                      </div>
                      {outOfStock ? (
                        <span className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400 dark:border-white/10">
                          Unavailable
                        </span>
                      ) : inCart > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQty(product.sku, inCart - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-400 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/30"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-gray-900 dark:text-white">
                            {inCart}
                          </span>
                          <button
                            onClick={() => updateQty(product.sku, inCart + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-400 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/30"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(toProduct(product))}
                          className="flex items-center gap-1.5 rounded-lg bg-aurex-blue px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-aurex-blue-light"
                        >
                          <ShoppingCart size={12} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {detailProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeDetail}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#131320]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeDetail}
              className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image panel */}
              <div className="flex h-56 w-full flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-white/[0.03] md:h-auto md:w-64 md:shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-200/60 dark:bg-white/8">
                  <ImageIcon size={26} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-600">Images coming soon</p>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 gap-5">
                {/* Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLOR[detailProduct.category]}`}>
                      {detailProduct.category}
                    </span>
                    {detailProduct.stock > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 size={11} /> {detailProduct.stock} in stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 dark:bg-white/8 dark:text-gray-400">
                        <AlertCircle size={11} /> Out of stock
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-snug text-gray-900 dark:text-white">
                    {detailProduct.name}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-gray-400">SKU: {detailProduct.sku}</p>
                </div>

                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {detailProduct.description}
                </p>

                {/* Fulfillment cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/5">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Clock size={12} className="text-aurex-blue" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Fulfillment</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {detailProduct.fulfillmentTime}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/5">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Truck size={12} className="text-aurex-blue" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Est. Delivery</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {detailProduct.estimatedDelivery}
                    </p>
                  </div>
                </div>

                {/* Price + qty + add */}
                <div className="mt-auto space-y-3 border-t border-gray-100 pt-5 dark:border-white/8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        ${detailProduct.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">{detailProduct.unit}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-gray-200 dark:border-white/10">
                        <button
                          onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                          disabled={detailProduct.stock === 0}
                          className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:text-gray-800 disabled:opacity-40 dark:text-gray-400 dark:hover:text-white"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                          {modalQty}
                        </span>
                        <button
                          onClick={() => setModalQty((q) => q + 1)}
                          disabled={detailProduct.stock === 0}
                          className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:text-gray-800 disabled:opacity-40 dark:text-gray-400 dark:hover:text-white"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={handleModalAdd}
                        disabled={detailProduct.stock === 0}
                        className="flex items-center gap-2 rounded-lg bg-aurex-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleModalSave}
                    disabled={detailProduct.stock === 0 || savedSet.has(detailProduct.sku)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-aurex-blue/30 hover:text-aurex-blue disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-gray-400 dark:hover:border-aurex-blue/30 dark:hover:text-aurex-blue"
                  >
                    <Bookmark size={13} />
                    {savedSet.has(detailProduct.sku) ? "Already saved for later" : "Save for Later"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
