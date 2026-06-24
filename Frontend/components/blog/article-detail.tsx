"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { ArrowLeft, CalendarDays, Clock } from "lucide-react"

import type { Article, Locale } from "@/lib/types"
import { Link } from "@/i18n/navigation"
import { pick } from "@/lib/i18n-field"
import { formatDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Reveal } from "@/components/motion/reveal"
import { ShareButtons } from "@/components/blog/share-buttons"

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ")
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function ArticleDetail({ article }: { article: Article }) {
  const t = useTranslations("blog")
  const locale = useLocale() as Locale

  const title = pick(article, "title", locale)
  const excerpt = pick(article, "excerpt", locale)
  const body = pick(article, "body", locale)
  // Contenu de l'éditeur riche = HTML (sanitisé backend) ; ancien contenu = texte brut.
  const isHtml = /<[a-z][\s\S]*>/i.test(body)
  const paragraphs = body.split(/\n\s*\n/).filter(Boolean)
  const minutes = readingTime(body)

  return (
    <article className="bg-background pb-24">
      <div className="mx-auto max-w-3xl px-4">
        {/* Retour */}
        <div className="pt-8 md:pt-12">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {t("backToBlog")}
          </Link>
        </div>

        {/* En-tête : catégorie + titre + méta + chapeau */}
        <header className="mt-8">
          <Badge className="bg-green-100 capitalize text-green-800 hover:bg-green-100">
            {t(article.category)}
          </Badge>
          <h1 className="mt-4 text-balance font-heading text-3xl font-bold leading-tight text-ink md:text-5xl">
            {title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
            {article.publishedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-green-700" />
                {formatDate(article.publishedAt, locale)}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-green-700" />
              {minutes} {locale === "en" ? "min read" : "min de lecture"}
            </span>
          </div>
          {excerpt ? (
            <p className="mt-6 text-lg leading-relaxed text-foreground/90">
              {excerpt}
            </p>
          ) : null}
        </header>

        {/* Image de couverture — pleine et nette (pas d'assombrissement) */}
        {article.coverImageUrl ? (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-stone-100 shadow-sm">
            <Image
              src={article.coverImageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        {/* Ligne de partage (sous l'image) */}
        <div className="mt-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-ink">Food For Life</span>
          <ShareButtons title={title} />
        </div>

        {/* Corps */}
        <Reveal>
          {isHtml ? (
            <div
              className="ffl-prose mt-8 text-base leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : (
            <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-foreground">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </Reveal>

        {/* Pied : partage */}
        <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-base font-semibold text-ink">
              {locale === "en"
                ? "Found this useful? Share it."
                : "Cet article vous a plu ? Partagez-le."}
            </p>
            <p className="text-sm text-ink-muted">
              {locale === "en"
                ? "Help us spread the word about Food For Life."
                : "Aidez-nous à faire connaître Food For Life."}
            </p>
          </div>
          <ShareButtons title={title} />
        </div>
      </div>
    </article>
  )
}
