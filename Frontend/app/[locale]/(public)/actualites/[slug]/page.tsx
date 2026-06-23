import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getArticleBySlug } from "@/lib/api/content"
import { ArticleDetail } from "@/components/blog/article-detail"

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: "Article" }
  return { title: article.titleFr, description: article.excerptFr }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article || article.status !== "published") notFound()

  return <ArticleDetail article={article} />
}
