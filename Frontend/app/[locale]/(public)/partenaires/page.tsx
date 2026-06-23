import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { PartnersDirectory } from "@/components/partners/partners-directory"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("partners")
  return { title: t("title"), description: t("subtitle") }
}

export default async function PartnersPage() {
  const t = await getTranslations("partners")
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <PartnersDirectory />
    </>
  )
}
