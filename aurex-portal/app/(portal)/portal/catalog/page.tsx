"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Clock, Truck, CheckCircle2, ImageIcon } from "lucide-react";
import { PRODUCTS, CATEGORIES, CATEGORY_COLOR, CATEGORY_FULFILLMENT } from "@/lib/products";
import type { Category, Product } from "@/lib/products";
import { useStore } from "@/components/portal/StoreProvider";

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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const { cart, addToCart, updateQty } = useStore();

  const cartMap = useMemo(
    () => Object.fromEntries(cart.map((i) => [i.product.sku, i.qty])),
    [cart]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: PRODUCTS.length };
    for (const p of PRODUCTS) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  function openDetail(product: Product) {
    setDetailProduct(product);
    const inCart = cartMap[product.sku] ?? 0;
    setModalQty(inCart > 0 ? inCart : 1);
  }

  function closeDetail() {
    setDetailProduct(null);
    setModalQty(1);
  }

  function handleModalAdd() {
    if (!detailProduct) return;
    const inCart = cartMap[detailProduct.sku] ?? 0;
    if (inCart > 0) {
      updateQty(detailProduct.sku, modalQty);
    } else {
      for (let i = 0; i < modalQty; i++) addToCart(detailProduct);
      // Reset to exact qty since addToCart increments by 1 each time
      updateQty(detailProduct.sku, modalQty);
    }
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
                return (
                  <div
                    key={product.sku}
                    className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-aurex-blue/30 hover:shadow-md dark:border-white/10 dark:bg-[#1a1a2a] dark:hover:border-aurex-blue/40 dark:shadow-none"
                    onClick={() => openDetail(product)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[product.category]}`}>
                        {product.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        In stock
                      </span>
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
                      {inCart > 0 ? (
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
                          onClick={() => addToCart(product)}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeDetail}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#131320]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeDetail}
              className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row">
              {/* Image area */}
              <div className="flex h-52 w-full items-center justify-center bg-gray-50 dark:bg-white/3 sm:h-auto sm:w-56 sm:shrink-0">
                <div className="flex flex-col items-center gap-2 text-center">
                  <ImageIcon size={32} className="text-gray-300 dark:text-gray-700" />
                  <p className="text-xs text-gray-400 dark:text-gray-600">Images coming soon</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[detailProduct.category]}`}>
                      {detailProduct.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                      <CheckCircle2 size={12} /> In stock
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {detailProduct.name}
                  </h2>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">SKU: {detailProduct.sku}</p>
                </div>

                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {detailProduct.description}
                </p>

                {/* Fulfillment info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-white/8 dark:bg-white/3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <Clock size={12} /> Fulfillment
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {CATEGORY_FULFILLMENT[detailProduct.category].fulfillmentTime}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-white/8 dark:bg-white/3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <Truck size={12} /> Est. Delivery
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {CATEGORY_FULFILLMENT[detailProduct.category].estimatedDelivery}
                    </p>
                  </div>
                </div>

                {/* Price + qty + add */}
                <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-white/8">
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${detailProduct.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">{detailProduct.unit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/30"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                        {modalQty}
                      </span>
                      <button
                        onClick={() => setModalQty((q) => q + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/30"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={handleModalAdd}
                      className="flex items-center gap-2 rounded-lg bg-aurex-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
