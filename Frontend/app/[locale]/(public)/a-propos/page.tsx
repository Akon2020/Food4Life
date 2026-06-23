import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { AboutStory } from "@/components/about/about-story"
import { AboutValues } from "@/components/about/about-values"
import { AboutTeam } from "@/components/about/about-team"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about")
  return { title: t("title"), description: t("subtitle") }
}

export default async function AboutPage() {
  const t = await getTranslations("about")
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
    </>
  )
}
