"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { getGallery } from "@/lib/api/content"
import { Link } from "@/i18n/navigation"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/motion/reveal"
import type { Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function GalleryTeaser() {
  const t = useTranslations("home")
  const locale = useLocale() as Locale

  const { data } = useQuery({ queryKey: ["gallery"], queryFn: getGallery })
  const items = (data ?? []).slice(0, 5)

  if (items.length === 0) return null

  // Bento-style spans for the first five items.
  const spans = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
  ]

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow={t("galleryEyebrow")}
          title={t("galleryTitle")}
        />

        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((item, i) => {
            const title = locale === "fr" ? item.titleFr : item.titleEn
            return (
              <Reveal
                key={item.id}
                delay={i * 0.05}
                className={cn(
                  "group relative overflow-hidden rounded-2xl",
                  spans[i],
                )}
              >
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <p className="absolute bottom-3 left-4 right-4 font-heading text-sm font-semibold text-white">
                  {title}
                </p>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-accent"
          >
            {t("galleryEyebrow")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
