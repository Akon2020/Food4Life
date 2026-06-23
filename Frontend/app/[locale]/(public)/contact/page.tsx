import { Suspense } from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { ContactInfo } from "@/components/contact/contact-info"
import { ContactForms } from "@/components/contact/contact-forms"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact")
  return { title: t("title"), description: t("subtitle") }
}

export default async function ContactPage() {
  const t = await getTranslations("contact")
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="bg-cream-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <Suspense fallback={null}>
            <ContactForms />
          </Suspense>
        </div>
      </section>
      <ContactInfo />
    </>
  )
}
