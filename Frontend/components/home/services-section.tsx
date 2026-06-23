"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Sprout, Factory, ShieldCheck, GraduationCap, Truck, HeartPulse } from "lucide-react"

import { SectionHeading } from "@/components/site/section-heading"
import { StaggerGroup, fadeUp } from "@/components/motion/reveal"

export function ServicesSection() {
  const t = useTranslations("home")
  const ts = useTranslations("services")

  const services = [
    { icon: Sprout, title: ts("production"), text: ts("productionText") },
    { icon: Factory, title: ts("processing"), text: ts("processingText") },
    { icon: ShieldCheck, title: ts("quality"), text: ts("qualityText") },
    { icon: GraduationCap, title: ts("training"), text: ts("trainingText") },
    { icon: Truck, title: ts("distribution"), text: ts("distributionText") },
    { icon: HeartPulse, title: ts("nutrition"), text: ts("nutritionText") },
  ]

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("servicesEyebrow")}
          title={t("servicesTitle")}
          description={t("servicesText")}
        />
        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <motion.article
              key={service.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-cream-200 bg-paper p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-green-50 text-green-700 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon className="size-6" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {service.text}
              </p>
            </motion.article>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
