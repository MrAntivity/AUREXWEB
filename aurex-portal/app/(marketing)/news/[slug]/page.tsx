import ArticleClient from "./ArticleClient";

export function generateStaticParams() {
  return [{ slug: "placeholder" }];
}

export default function ArticlePage() {
  return <ArticleClient />;
}
