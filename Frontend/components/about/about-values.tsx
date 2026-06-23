"use client"

import { useTranslations } from "next-intl"
import { Award, HeartHandshake, Leaf, TrendingUp } from "lucide-react"

import { SectionHeading } from "@/components/site/section-heading"
import { StaggerGroup, fadeUp } from "@/components/motion/reveal"
import { motion } from "framer-motion"

export function AboutValues() {
  const t = useTranslations("about")

  const values = [
    { icon: Award, title: t("valueQuality"), text: t("valueQualityText") },
    { icon: HeartHandshake, title: t("valueInclusion"), text: t("valueInclusionText") },
    { icon: Leaf, title: t("valueSustainability"), text: t("valueSustainabilityText") },
    { icon: TrendingUp, title: t("valueImpact"), text: t("valueImpactText") },
  ]

  return (
    <section className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading title={t("valuesTitle")} />
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              className="group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <v.icon className="size-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
