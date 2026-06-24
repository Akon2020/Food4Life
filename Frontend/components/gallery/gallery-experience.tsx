"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { Play, X, Images } from "lucide-react"

import type { GalleryCategory, GalleryItem, Locale } from "@/lib/types"
import { getGallery } from "@/lib/api/content"
import { pick } from "@/lib/i18n-field"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/site/empty-state"

const CATEGORIES: (GalleryCategory | "all")[] = [
  "all",
  "terrain",
  "produits",
  "evenements",
  "equipe",
]

export function GalleryExperience() {
  const t = useTranslations("gallery")
  const locale = useLocale() as Locale
  const [filter, setFilter] = useState<GalleryCategory | "all">("all")
  const [active, setActive] = useState<GalleryItem | null>(null)

  const { data, isLoading } = useQuery({ queryKey: ["gallery"], queryFn: getGallery })
  const items = useMemo(
    () => (data ?? []).filter((i) => (filter === "all" ? true : i.category === filter)),
    [data, filter]
  )

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              )}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="mb-4 h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={Images} title={t("emptyTitle")} message={t("empty")} />
        ) : (
          <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((item) => (
              <motion.button
                layout
                key={item.id}
                type="button"
                onClick={() => setActive(item)}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="group relative mb-4 block w-full overflow-hidden rounded-2xl"
              >
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={pick(item, "title", locale)}
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {item.type === "video" ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-paper/90 text-primary shadow-lg transition-transform group-hover:scale-110">
                      <Play className="size-6 translate-x-0.5 fill-current" />
                    </span>
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-heading text-sm font-semibold text-paper">
                    {pick(item, "title", locale)}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label={t("close")}
              className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20"
            >
              <X className="size-5" />
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl"
            >
              {active.type === "video" && active.videoUrl ? (
                <video
                  src={active.videoUrl}
                  controls
                  autoPlay
                  className="aspect-video w-full bg-ink"
                />
              ) : (
                <div className="relative aspect-video w-full bg-ink">
                  <Image
                    src={active.imageUrl || "/placeholder.svg"}
                    alt={pick(active, "title", locale)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 80vw"
                    className="object-contain"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {pick(active, "title", locale)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {pick(active, "caption", locale)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
