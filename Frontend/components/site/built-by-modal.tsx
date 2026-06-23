"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Code2, X, ArrowUpRight, Mail } from "lucide-react"
import { useTranslations } from "next-intl"

const STACK = ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]

export function BuiltByModal() {
  const t = useTranslations("builtBy")
  const [open, setOpen] = useState(false)

  // Lock body scroll + close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-1.5 text-sm text-cream/60 transition-colors hover:text-white"
      >
        <Code2 className="size-3.5" />
        {t("trigger")}
        <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-green-950/70 backdrop-blur-md"
            />

            {/* Glass card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="built-by-title"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 text-cream shadow-2xl backdrop-blur-2xl"
            >
              {/* Soft accent glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gold-400/20 blur-3xl"
              />

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
              >
                <X className="size-4" />
              </button>

              <div className="relative flex flex-col items-center text-center">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 font-heading text-2xl font-bold text-green-950 shadow-lg">
                  IA
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
                  {t("eyebrow")}
                </p>
                <h2
                  id="built-by-title"
                  className="mt-2 font-heading text-2xl font-bold text-white"
                >
                  {t("name")}
                </h2>
                <p className="mt-1 text-sm text-cream/70">{t("role")}</p>

                <p className="mt-5 text-pretty text-sm leading-relaxed text-cream/80">
                  {t("bio")}
                </p>

                <div className="mt-6 w-full">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                    {t("stackLabel")}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {STACK.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-cream/85"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex w-full flex-col gap-2.5 sm:flex-row">
                  <a
                    href="https://github.com/isaac-akonkwa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-green-950 transition-colors hover:bg-gold-400"
                  >
                    {t("cta")}
                    <ArrowUpRight className="size-4" />
                  </a>
                  <a
                    href="mailto:isaac@example.com"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-white/10"
                  >
                    <Mail className="size-4" />
                    {t("contact")}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
