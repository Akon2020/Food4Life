"use client"

import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { LinkButton } from "@/components/site/link-button"

export function CtaSection() {
  const t = useTranslations("home")

  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-green-300/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <SectionHeading
          title={t("ctaTitle")}
          description={t("ctaText")}
          tone="inverted"
        />
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LinkButton href="/partenaires" variant="accent" size="lg">
            {t("ctaPrimary")}
            <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton href="/contact" variant="ghostInverted" size="lg">
            {t("ctaSecondary")}
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
