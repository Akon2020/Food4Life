import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { BlogList } from "@/components/blog/blog-list"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog")
  return { title: t("title"), description: t("subtitle") }
}

export default async function BlogPage() {
  const t = await getTranslations("blog")
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <BlogList />
    </>
  )
}
