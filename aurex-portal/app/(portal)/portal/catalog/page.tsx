"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingCart, Plus, Minus, AlertCircle } from "lucide-react";
import { PRODUCTS, CATEGORIES, CATEGORY_EMOJI, CATEGORY_COLOR } from "@/lib/products";
import type { Category } from "@/lib/products";
import { useStore } from "@/components/portal/StoreProvider";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
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

  return (
    <div className="flex h-full gap-6">
      {/* Category sidebar */}
      <aside className="w-48 shrink-0">
        <div className="card sticky top-0 p-3">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Categories
          </p>
          {(["All", ...CATEGORIES] as (Category | "All")[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-navy-50 font-semibold text-aurex-blue"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                {cat !== "All" && <span>{CATEGORY_EMOJI[cat as Category]}</span>}
                <span className="truncate">{cat === "All" ? "All Products" : cat}</span>
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
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search products or SKUs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue"
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
                  className={`card flex flex-col gap-3 ${!product.inStock ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[product.category]}`}
                    >
                      {CATEGORY_EMOJI[product.category]} {product.category}
                    </span>
                    {!product.inStock && (
                      <span className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle size={11} /> Out of stock
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-tight text-gray-900">
                      {product.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-gray-400">{product.sku}</p>
                    <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">{product.unit}</p>
                    </div>
                    {product.inStock &&
                      (inCart > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQty(product.sku, inCart - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-400"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-gray-900">
                            {inCart}
                          </span>
                          <button
                            onClick={() => updateQty(product.sku, inCart + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-400"
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
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
