"use client"

import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"

import { getPartners } from "@/lib/api/content"
import { SectionHeading } from "@/components/site/section-heading"
import { PartnersCarousel } from "@/components/partners/partners-carousel"

export function HomePartnersSection() {
  const t = useTranslations("home")
  const { data } = useQuery({ queryKey: ["partners"], queryFn: getPartners })
  const partners = data ?? []

  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("partnersEyebrow")}
          title={t("partnersTitle")}
        />
        <div className="mt-12">
          <PartnersCarousel partners={partners} />
        </div>
      </div>
    </section>
  )
}
