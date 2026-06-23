import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { ServicesGrid } from "@/components/services/services-grid"
import { CtaSection } from "@/components/home/cta-section"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services")
  return { title: t("title"), description: t("subtitle") }
}

export default async function ServicesPage() {
  const t = await getTranslations("services")
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <ServicesGrid />
      <CtaSection />
    </>
  )
}
