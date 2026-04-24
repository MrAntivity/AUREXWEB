"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, User, ImageIcon } from "lucide-react";
import { getArticles, formatArticleDate, TAG_COLOR_DARK } from "@/lib/news-store";
import type { NewsArticle } from "@/lib/news-store";

export default function ArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [article, setArticle] = useState<NewsArticle | null | undefined>(undefined);

  useEffect(() => {
    const found = getArticles().find(
      (a) => a.slug === slug && a.status === "published"
    );
    setArticle(found ?? null);
  }, [slug]);

  if (article === undefined) return null;

  if (article === null) {
    return (
      <div className="bg-dark-bg min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-500">Article not found.</p>
          <Link
            href="/news"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-aurex-blue hover:underline"
          >
            <ChevronLeft size={14} /> Back to News
          </Link>
        </div>
      </div>
    );
  }

  const authorName = article.author.trim() || "Aurex Medical";

  return (
    <div className="bg-dark-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        {/* Back */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-white"
        >
          <ChevronLeft size={14} /> Back to News
        </Link>

        {/* Meta */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
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
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <User size={11} />
            {authorName}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-snug">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-gray-400">
            {article.excerpt}
          </p>
        )}

        {/* Image placeholder */}
        <div className="mt-8 flex aspect-video w-full items-center justify-center rounded-2xl border-2 border-dashed border-white/8 bg-white/[0.03]">
          <div className="text-center">
            <ImageIcon size={28} className="mx-auto text-gray-700" />
            <p className="mt-2 text-xs text-gray-700">Image coming soon</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/8" />

        {/* Body */}
        <div className="mt-10 space-y-5">
          {article.body
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-gray-400">
                {paragraph.split("\n").map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
