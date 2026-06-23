import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { LegalSections } from "@/components/site/legal-sections"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "privacyPage" })
  return { title: t("title"), description: t("subtitle") }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "privacyPage" })
  const sections = t.raw("sections") as { title: string; body: string }[]

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <LegalSections sections={sections} updated={t("updated")} />
    </>
  )
}
