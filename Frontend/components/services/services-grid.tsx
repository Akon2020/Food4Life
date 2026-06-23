"use client"

import { useTranslations } from "next-intl"
import { Sprout, Factory, ShieldCheck, GraduationCap, Truck, HeartPulse } from "lucide-react"
import { motion } from "framer-motion"

import { StaggerGroup, fadeUp } from "@/components/motion/reveal"

export function ServicesGrid() {
  const t = useTranslations("services")

  const services = [
    { icon: Sprout, title: t("production"), text: t("productionText") },
    { icon: Factory, title: t("processing"), text: t("processingText") },
    { icon: ShieldCheck, title: t("quality"), text: t("qualityText") },
    { icon: GraduationCap, title: t("training"), text: t("trainingText") },
    { icon: Truck, title: t("distribution"), text: t("distributionText") },
    { icon: HeartPulse, title: t("nutrition"), text: t("nutritionText") },
  ]

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <span className="absolute right-5 top-5 font-heading text-5xl font-bold text-secondary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="size-7" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
