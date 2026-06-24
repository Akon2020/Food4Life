"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { Quote } from "lucide-react"
import { getTestimonials } from "@/lib/api/content"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { EmptyState } from "@/components/site/empty-state"
import type { Locale } from "@/i18n/routing"

export function TestimonialsSection() {
  const t = useTranslations("home")
  const locale = useLocale() as Locale

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  })

  const testimonials = data ?? []

  if (!isLoading && testimonials.length === 0) {
    return (
      <section className="bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow={t("testimonialsEyebrow")}
            title={t("testimonialsTitle")}
          />
          <div className="mt-14">
            <EmptyState icon={Quote} title={t("emptyTitle")} message={t("emptyTestimonials")} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow={t("testimonialsEyebrow")}
          title={t("testimonialsTitle")}
        />

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => {
            const role = locale === "fr" ? item.authorRoleFr : item.authorRoleEn
            const quote = locale === "fr" ? item.quoteFr : item.quoteEn
            return (
              <Reveal
                key={item.id}
                className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <Quote className="size-8 text-accent" aria-hidden />
                <p className="mt-4 flex-1 text-pretty leading-relaxed text-card-foreground/90">
                  {quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={item.photoUrl || "/placeholder.svg"}
                    alt={item.authorName}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">
                      {item.authorName}
                    </p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
