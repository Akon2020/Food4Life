"use client"

import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { Newspaper } from "lucide-react"

import { getArticles } from "@/lib/api/content"
import { SectionHeading } from "@/components/site/section-heading"
import { ArticleCard } from "@/components/blog/article-card"
import { RevealGroup, Reveal } from "@/components/motion/reveal"
import { LinkButton } from "@/components/site/link-button"
import { EmptyState } from "@/components/site/empty-state"

export function NewsSection() {
  const t = useTranslations("home")

  const { data, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  })

  const articles = (data ?? []).slice(0, 3)

  return (
    <section className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow={t("newsEyebrow")} title={t("newsTitle")} />

        {!isLoading && articles.length === 0 ? (
          <div className="mt-14">
            <EmptyState icon={Newspaper} title={t("emptyTitle")} message={t("emptyNews")} />
          </div>
        ) : (
          <>
            <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
              {articles.map((article) => (
                <Reveal key={article.id}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </RevealGroup>

            <div className="mt-12 flex justify-center">
              <LinkButton href="/actualites" variant="outline" size="lg">
                {t("newsEyebrow")}
              </LinkButton>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
