"use client"

import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

import type { Locale, PartnerCategory } from "@/lib/types"
import { getPartners } from "@/lib/api/content"
import { pick } from "@/lib/i18n-field"
import { Link } from "@/i18n/navigation"
import { StaggerGroup, fadeUp } from "@/components/motion/reveal"

const ORDER: PartnerCategory[] = [
  "financier",
  "technique",
  "formation",
  "institutionnel",
]

export function PartnersDirectory() {
  const t = useTranslations("partners")
  const locale = useLocale() as Locale
  const { data } = useQuery({ queryKey: ["partners"], queryFn: getPartners })
  const partners = data ?? []

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {ORDER.map((category) => {
          const group = partners.filter((p) => p.category === category)
          if (group.length === 0) return null
          return (
            <div key={category} className="mb-16 last:mb-0">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-heading text-2xl font-bold text-foreground">{t(category)}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((partner) => (
                  <motion.div
                    key={partner.id}
                    variants={fadeUp}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-16 items-center">
                      <span className="font-heading text-xl font-bold text-foreground">
                        {partner.name}
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {pick(partner, "description", locale)}
                    </p>
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                      >
                        {t("visitSite")}
                        <ArrowUpRight className="size-4" />
                      </a>
                    ) : null}
                  </motion.div>
                ))}
              </StaggerGroup>
            </div>
          )
        })}

        {/* CTA */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-primary p-10 text-center md:p-14">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
            {t("ctaText")}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            {t("ctaButton")}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
