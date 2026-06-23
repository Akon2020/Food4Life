import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getArticleBySlug } from "@/lib/api/content"
import { ArticleDetail } from "@/components/blog/article-detail"
import { pickField } from "@/lib/i18n-field"

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://foodforlifedrc.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: "Article" }

  const title = pickField(article, "title", locale as "fr" | "en")
  const description = pickField(article, "excerpt", locale as "fr" | "en")
  const url = `${siteUrl}/${locale}/actualites/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${siteUrl}/fr/actualites/${slug}`,
        en: `${siteUrl}/en/actualites/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: article.publishedAt ?? undefined,
      images: article.coverImageUrl
        ? [{ url: article.coverImageUrl }]
        : undefined,
    },
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug, locale } = await params
  const article = await getArticleBySlug(slug)
  if (!article || article.status !== "published") notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: pickField(article, "title", locale as "fr" | "en"),
    description: pickField(article, "excerpt", locale as "fr" | "en"),
    image: article.coverImageUrl
      ? `${siteUrl}${article.coverImageUrl}`
      : undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt ?? article.publishedAt ?? undefined,
    author: { "@type": "Organization", name: "Food For Life" },
    publisher: {
      "@type": "Organization",
      name: "Food For Life",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo-green.jpeg` },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetail article={article} />
    </>
  )
}
