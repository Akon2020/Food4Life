"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { useInView, motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Wheat, Home, Users, Briefcase } from "lucide-react"

import { getSettings } from "@/lib/api/content"
import { SectionHeading } from "@/components/site/section-heading"
import { StaggerGroup, fadeUp } from "@/components/motion/reveal"

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const duration = 1600
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref} className="tabular">
      {display.toLocaleString("fr-FR")}
      {suffix}
    </span>
  )
}

export function ImpactSection() {
  const t = useTranslations("home")
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  })

  const impact = settings?.impact ?? {
    tonnesProduced: 0,
    householdsServed: 0,
    farmersSupported: 0,
    jobsCreated: 0,
  }

  const stats = [
    { icon: Wheat, value: impact.tonnesProduced, suffix: "+", label: t("impactTonnes") },
    { icon: Home, value: impact.householdsServed, suffix: "+", label: t("impactHouseholds") },
    { icon: Users, value: impact.farmersSupported, suffix: "+", label: t("impactFarmers") },
    { icon: Briefcase, value: impact.jobsCreated, suffix: "+", label: t("impactJobs") },
  ]

  return (
    <section className="bg-green-900 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("impactEyebrow")}
          title={t("impactTitle")}
          tone="inverted"
        />
        <StaggerGroup className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 text-center backdrop-blur md:p-8"
            >
              <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-accent/15 text-gold-400">
                <stat.icon className="size-6" />
              </span>
              <p className="mt-5 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-primary-foreground/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
