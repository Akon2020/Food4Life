"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight, Leaf } from "lucide-react"

import { LinkButton } from "@/components/site/link-button"

const easeOut = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  const t = useTranslations("home")

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-field.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-900/80 to-green-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent" />
      </div>

      {/* Floating accents */}
      <motion.div
        aria-hidden
        className="absolute -left-10 top-24 -z-10 hidden text-green-300/30 md:block"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Leaf className="size-40" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute bottom-16 right-10 -z-10 hidden text-gold-400/30 lg:block"
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Leaf className="size-28 rotate-45" />
      </motion.div>

      <div className="mx-auto flex min-h-[88vh] max-w-[1200px] flex-col justify-center px-4 py-28 sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground backdrop-blur"
        >
          <Leaf className="size-3.5" />
          {t("heroEyebrow")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
          className="mt-6 max-w-3xl font-heading text-4xl font-bold leading-[1.05] text-balance text-primary-foreground sm:text-5xl lg:text-6xl"
        >
          {t("heroTitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
          className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/85"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: easeOut }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <LinkButton href="/produits" variant="accent" size="lg">
            {t("heroPrimary")}
            <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton href="/a-propos" variant="ghostInverted" size="lg">
            {t("heroSecondary")}
          </LinkButton>
        </motion.div>
      </div>
    </section>
  )
}
