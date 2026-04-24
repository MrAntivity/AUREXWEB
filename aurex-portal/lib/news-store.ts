export type NewsStatus = "draft" | "published";

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  author: string;
  tag: string;
  publishedDate: string; // YYYY-MM-DD
  excerpt: string;
  body: string;
  status: NewsStatus;
  createdAt: string;
  updatedAt: string;
};

export const NEWS_TAGS = [
  "Partnership",
  "Update",
  "Success Story",
  "Announcement",
  "Research",
  "Product",
] as const;

export type NewsTag = (typeof NEWS_TAGS)[number];

const STORE_KEY = "aurex_news";

// Light badges — staff portal (white bg)
export const TAG_COLOR: Record<string, string> = {
  "Partnership":   "bg-blue-50   text-blue-700   ring-1 ring-inset ring-blue-200",
  "Update":        "bg-green-50  text-green-700  ring-1 ring-inset ring-green-200",
  "Success Story": "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200",
  "Announcement":  "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
  "Research":      "bg-teal-50   text-teal-700   ring-1 ring-inset ring-teal-200",
  "Product":       "bg-gray-100  text-gray-700   ring-1 ring-inset ring-gray-200",
};

// Dark badges — marketing site (dark bg)
export const TAG_COLOR_DARK: Record<string, string> = {
  "Partnership":   "bg-blue-500/10   text-blue-400   ring-1 ring-inset ring-blue-400/20",
  "Update":        "bg-green-500/10  text-green-400  ring-1 ring-inset ring-green-400/20",
  "Success Story": "bg-purple-500/10 text-purple-400 ring-1 ring-inset ring-purple-400/20",
  "Announcement":  "bg-orange-500/10 text-orange-400 ring-1 ring-inset ring-orange-400/20",
  "Research":      "bg-teal-500/10   text-teal-400   ring-1 ring-inset ring-teal-400/20",
  "Product":       "bg-gray-500/10   text-gray-400   ring-1 ring-inset ring-gray-400/20",
};

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatArticleDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getArticles(): NewsArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) return JSON.parse(stored) as NewsArticle[];
  } catch {}
  return [];
}

export function saveArticles(articles: NewsArticle[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(articles));
}

export function addArticle(
  article: Omit<NewsArticle, "id" | "createdAt" | "updatedAt">
): NewsArticle[] {
  const articles = getArticles();
  const now = new Date().toISOString();
  articles.push({ ...article, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
  saveArticles(articles);
  return articles;
}

export function updateArticle(
  id: string,
  updates: Partial<Omit<NewsArticle, "id" | "createdAt">>
): NewsArticle[] {
  const articles = getArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return articles;
  articles[idx] = { ...articles[idx], ...updates, id, updatedAt: new Date().toISOString() };
  saveArticles(articles);
  return articles;
}

export function deleteArticle(id: string): NewsArticle[] {
  const articles = getArticles().filter((a) => a.id !== id);
  saveArticles(articles);
  return articles;
}
