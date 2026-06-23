"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Target, Eye } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"

export function AboutStory() {
  const t = useTranslations("about")

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/about-story.png"
              alt={t("storyTitle")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div className="flex flex-col gap-8">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {t("storyTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{t("storyText")}</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {t("missionTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("missionText")}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Eye className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {t("visionTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("visionText")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
