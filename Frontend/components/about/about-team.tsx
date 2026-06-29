"use client"

import { useState } from "react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Users } from "lucide-react"

import { LinkedinIcon } from "@/components/icons/social-icons"

import type { Locale, TeamMember } from "@/lib/types"
import { getTeam } from "@/lib/api/content"
import { pick } from "@/lib/i18n-field"
import { SectionHeading } from "@/components/site/section-heading"
import { StaggerGroup, fadeUp } from "@/components/motion/reveal"
import { EmptyState } from "@/components/site/empty-state"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const MAX_WORDS = 100

function truncateWords(text: string, max: number) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= max) return { text, truncated: false }
  return { text: words.slice(0, max).join(" ") + "…", truncated: true }
}

export function AboutTeam() {
  const t = useTranslations("about")
  const locale = useLocale() as Locale
  const { data, isLoading } = useQuery({ queryKey: ["team"], queryFn: getTeam })
  const team = data ?? []
  const [selected, setSelected] = useState<TeamMember | null>(null)

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading title={t("teamTitle")} description={t("teamSubtitle")} />
        {!isLoading && team.length === 0 ? (
          <div className="mt-12">
            <EmptyState icon={Users} title={t("teamEmptyTitle")} message={t("teamEmpty")} />
          </div>
        ) : (
          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => {
              const bio = pick(member, "bio", locale)
              const { text, truncated } = truncateWords(bio, MAX_WORDS)
              return (
                <motion.article
                  key={member.id}
                  variants={fadeUp}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
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
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-primary">
                      {pick(member, "role", locale)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {text}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      {truncated ? (
                        <button
                          type="button"
                          onClick={() => setSelected(member)}
                          className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                        >
                          {t("readMore")}
                        </button>
                      ) : null}
                      {member.linkedinUrl ? (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                          aria-label={`LinkedIn — ${member.name}`}
                        >
                          <LinkedinIcon className="size-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </StaggerGroup>
        )}
      </div>

      {/* Modal détails membre */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-stone-100">
                    <Image
                      src={selected.photoUrl || "/placeholder.svg"}
                      alt={selected.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0 text-left">
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription className="text-primary">
                      {pick(selected, "role", locale)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <p className="max-h-[55vh] overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {pick(selected, "bio", locale)}
              </p>

              {selected.linkedinUrl ? (
                <a
                  href={selected.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <LinkedinIcon className="size-4" />
                  LinkedIn
                </a>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
