"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Save, ImageIcon, Search, ChevronDown } from "lucide-react";
import {
  getArticles, addArticle, updateArticle, deleteArticle, slugify, NEWS_TAGS, TAG_COLOR,
} from "@/lib/news-store";
import type { NewsArticle, NewsStatus } from "@/lib/news-store";

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

const EMPTY: Omit<NewsArticle, "id" | "createdAt" | "updatedAt"> = {
  title: "", slug: "", author: "", tag: "Update",
  publishedDate: todayIso(), excerpt: "", body: "", status: "draft",
};

export default function StaffNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newArticle, setNewArticle] = useState<typeof EMPTY>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { setArticles(getArticles()); }, []);

  const filtered = articles
    .filter((a) => {
      const q = search.toLowerCase();
      return (!q || a.title.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q)) &&
        (filterStatus === "all" || a.status === filterStatus);
    })
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    const updated = updateArticle(editing.id, {
      title: editing.title, slug: editing.slug, author: editing.author,
      tag: editing.tag, publishedDate: editing.publishedDate,
      excerpt: editing.excerpt, body: editing.body, status: editing.status,
    });
    setArticles(updated);
    setTimeout(() => { setSaving(false); setEditing(null); }, 400);
  }

  function handleAdd() {
    if (!newArticle.title || !newArticle.slug) return;
    setArticles(addArticle(newArticle));
    setIsAdding(false);
    setNewArticle({ ...EMPTY, publishedDate: todayIso() });
  }

  function handleDelete(id: string) {
    setArticles(deleteArticle(id));
    setConfirmDelete(null);
  }

  function statusBadge(status: NewsStatus) {
    return status === "published" ? (
      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">Published</span>
    ) : (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-200 dark:bg-white/8 dark:text-gray-400 dark:ring-white/10">Draft</span>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">News</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{articles.length} articles total</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-aurex-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light"
        >
          <Plus size={15} /> New Article
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search title or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white dark:placeholder-gray-600"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "published" | "draft")}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-[#1a1a2a] dark:text-gray-300"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <p className="text-sm text-gray-400">{filtered.length} shown</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-white/8 dark:bg-white/3">
                {["Title", "Tag", "Author", "Published Date", "Status", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filtered.map((a) => (
                <tr key={a.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/3">
                  <td className="max-w-[240px] px-4 py-3">
                    <p className="truncate font-medium text-gray-900 dark:text-white">{a.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">/news/{a.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TAG_COLOR[a.tag] ?? "bg-gray-100 text-gray-700"}`}>
                      {a.tag}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {a.author || "Aurex Medical"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(a.publishedDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">{statusBadge(a.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => setEditing({ ...a })}
                        className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:border-aurex-blue hover:text-aurex-blue dark:border-white/10 dark:text-gray-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(a.id)}
                        className="rounded-md border border-red-100 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-sm text-gray-400">
                    {articles.length === 0 ? 'No articles yet. Click "New Article" to create one.' : "No articles match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ArticleModal
          title="Edit Article"
          article={editing}
          onChange={(u) => setEditing((a) => (a ? { ...a, ...u } : a))}
          onSave={handleSaveEdit}
          onClose={() => setEditing(null)}
          saving={saving}
          isEdit
        />
      )}

      {isAdding && (
        <ArticleModal
          title="New Article"
          article={newArticle as NewsArticle}
          onChange={(u) => setNewArticle((a) => ({ ...a, ...u }))}
          onSave={handleAdd}
          onClose={() => { setIsAdding(false); setNewArticle({ ...EMPTY, publishedDate: todayIso() }); }}
          saving={false}
          isEdit={false}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete article?</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This cannot be undone. The article will be permanently removed.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArticleModal({
  title, article, onChange, onSave, onClose, saving, isEdit,
}: {
  title: string;
  article: NewsArticle;
  onChange: (updates: Partial<NewsArticle>) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  isEdit: boolean;
}) {
  const slugTouched = useRef(isEdit);
  const fi = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-aurex-blue focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#131320] dark:text-white dark:placeholder-gray-600";

  function handleTitleChange(value: string) {
    onChange({ title: value });
    if (!slugTouched.current) onChange({ title: value, slug: slugify(value) });
  }

  function handleSlugChange(value: string) {
    slugTouched.current = true;
    onChange({ slug: slugify(value) });
  }

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
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Article Image</label>
            <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/3">
              <div className="text-center">
                <ImageIcon size={24} className="mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-1.5 text-xs text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <F label="Title" required>
                <input className={fi} value={article.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Aurex Partners with Stanford Research Labs" />
              </F>
            </div>

            <div className="sm:col-span-2">
              <F label="Slug" required>
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-aurex-blue focus-within:ring-1 focus-within:ring-aurex-blue dark:border-white/10 dark:bg-[#131320]">
                  <span className="select-none border-r border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-500">/news/</span>
                  <input className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none dark:text-white" value={article.slug} onChange={(e) => handleSlugChange(e.target.value)} placeholder="aurex-partners-with-stanford" />
                </div>
              </F>
            </div>

            <F label="Tag / Category">
              <select className={`${fi} appearance-none`} value={article.tag} onChange={(e) => onChange({ tag: e.target.value })}>
                {NEWS_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </F>

            <F label="Author">
              <input className={fi} value={article.author} onChange={(e) => onChange({ author: e.target.value })} placeholder={'Leave blank for "Aurex Medical"'} />
            </F>

            <F label="Published Date">
              <input className={fi} type="date" value={article.publishedDate} onChange={(e) => onChange({ publishedDate: e.target.value })} />
            </F>

            <F label="Status">
              <select className={`${fi} appearance-none`} value={article.status} onChange={(e) => onChange({ status: e.target.value as NewsStatus })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </F>
          </div>

          <F label="Excerpt / Description">
            <textarea className={`${fi} min-h-[72px] resize-y`} value={article.excerpt} onChange={(e) => onChange({ excerpt: e.target.value })} placeholder="Short summary shown on the news index page…" />
          </F>

          <F label="Body Text">
            <textarea className={`${fi} min-h-[180px] resize-y font-mono text-xs leading-relaxed`} value={article.body} onChange={(e) => onChange({ body: e.target.value })} placeholder="Full article content. Separate paragraphs with a blank line." />
            <p className="mt-1 text-xs text-gray-400">Separate paragraphs with a blank line.</p>
          </F>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4 dark:border-white/8 dark:bg-[#1a1a2a]">
          <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5">Cancel</button>
          <button
            onClick={onSave}
            disabled={saving || !article.title.trim() || !article.slug.trim()}
            className="flex items-center gap-2 rounded-lg bg-aurex-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light disabled:opacity-50"
          >
            <Save size={14} /> {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Article"}
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
