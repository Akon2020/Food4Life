"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"

import { LinkedinIcon } from "@/components/icons/social-icons"

import type { Locale } from "@/lib/types"
import { getTeam } from "@/lib/api/content"
import { pick } from "@/lib/i18n-field"
import { SectionHeading } from "@/components/site/section-heading"
import { StaggerGroup, fadeUp } from "@/components/motion/reveal"

export function AboutTeam() {
  const t = useTranslations("about")
  const locale = useLocale() as Locale
  const { data } = useQuery({ queryKey: ["team"], queryFn: getTeam })
  const team = data ?? []

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading title={t("teamTitle")} description={t("teamSubtitle")} />
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <motion.article
              key={member.id}
              variants={fadeUp}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={member.photoUrl || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-primary">
                  {pick(member, "role", locale)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {pick(member, "bio", locale)}
                </p>
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    className="mt-4 inline-flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label={`LinkedIn — ${member.name}`}
                  >
                    <LinkedinIcon className="size-4" />
                  </a>
                ) : null}
              </div>
            </motion.article>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
