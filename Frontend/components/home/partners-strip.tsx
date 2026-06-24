"use client"

import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"

import { getPartners } from "@/lib/api/content"
import { PartnersCarousel } from "@/components/partners/partners-carousel"

/**
 * Bandeau "Ils nous font confiance" affiché juste sous le hero.
 * Volontairement SANS état vide : s'il n'y a pas de partenaire, on masque le bloc.
 */
export function HomePartnersStrip() {
  const t = useTranslations("home")
  const { data } = useQuery({ queryKey: ["partners"], queryFn: getPartners })
  const partners = data ?? []

  if (partners.length === 0) return null

  return (
    <section className="border-b border-border bg-background py-10 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-sm font-medium text-ink-muted">
          {t("partnersTrust")}
        </p>
        <PartnersCarousel partners={partners} />
      </div>
    </section>
  )
}
