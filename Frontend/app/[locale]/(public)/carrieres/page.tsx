import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Sparkles, TrendingUp, HeartHandshake } from "lucide-react"

import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal, StaggerGroup } from "@/components/motion/reveal"
import { ApplicationForm } from "@/components/forms/application-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "careersPage" })
  return { title: t("title"), description: t("subtitle") }
}

const PERK_ICONS = [Sparkles, TrendingUp, HeartHandshake]

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "careersPage" })
  const perks = t.raw("perks") as { title: string; text: string }[]

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />

      {/* Intro */}
      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-balance text-ink md:text-4xl">
              {t("introTitle")}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-ink-muted">
              {t("introText")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why join */}
      <section className="bg-cream-50 py-16 md:py-24">
        <div className="mx-auto max-w-[var(--container-content)] px-4">
          <SectionHeading title={t("whyTitle")} />
          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {perks.map((perk, i) => {
              const Icon = PERK_ICONS[i] ?? Sparkles
              return (
                <Reveal key={perk.title}>
                  <article className="h-full rounded-2xl border border-cream-200 bg-paper p-6 shadow-sm">
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-5 font-heading text-lg font-semibold text-ink">
                      {perk.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {perk.text}
                    </p>
                  </article>
                </Reveal>
              )
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* Application form */}
      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading title={t("formTitle")} description={t("formText")} />
          <div className="mt-10">
            <ApplicationForm />
          </div>
        </div>
      </section>
    </>
  )
}
