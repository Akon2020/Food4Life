import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { GalleryExperience } from "@/components/gallery/gallery-experience"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("gallery")
  return { title: t("title"), description: t("subtitle") }
}

export default async function GalleryPage() {
  const t = await getTranslations("gallery")
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <GalleryExperience />
    </>
  )
}
