import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { ImpactSection } from "@/components/home/impact-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CtaSection } from "@/components/home/cta-section"
import { Reveal } from "@/components/motion/reveal"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("impactPage")
  return { title: t("title"), description: t("subtitle") }
}

export default async function ImpactPage() {
  const t = await getTranslations("impactPage")
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="bg-cream-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-ink text-balance md:text-4xl">
              {t("introTitle")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted text-pretty">
              {t("introText")}
            </p>
          </Reveal>
        </div>
      </section>
      <ImpactSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
