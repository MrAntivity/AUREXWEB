"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { getArticles, formatArticleDate, TAG_COLOR_DARK } from "@/lib/news-store";
import type { NewsArticle } from "@/lib/news-store";

const PAGE_SIZE = 10;

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const published = getArticles()
      .filter((a) => a.status === "published")
      .sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      );
    setArticles(published);
  }, []);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const paged = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {/* Hero */}
      <section className="bg-dark-bg px-6 pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">News</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            From Aurex Medical
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
            Updates, partnerships, and stories from the team building modern lab procurement.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-dark-bg pb-24">
        <div className="mx-auto max-w-4xl px-6">
          {articles.length === 0 ? (
            <div className="py-24 text-center text-gray-600">
              No articles published yet.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {paged.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <div className="card-dark transition-all hover:border-white/25 hover:bg-[#1e1e30]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  TAG_COLOR_DARK[article.tag] ?? "bg-gray-500/10 text-gray-400 ring-1 ring-inset ring-gray-400/20"
                }`}
              >
                {article.tag}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar size={11} />
                {formatArticleDate(article.publishedDate)}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-white transition-colors group-hover:text-aurex-blue line-clamp-2">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-2">
                {article.excerpt}
              </p>
            )}
          </div>
          <ChevronRight
            size={17}
            className="mt-1.5 shrink-0 text-gray-600 transition-colors group-hover:text-aurex-blue"
          />
        </div>
      </div>
    </Link>
  );
}
