"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X, ArrowUpRight } from "lucide-react"

import { Link, usePathname } from "@/i18n/navigation"
import { publicNav } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "./language-switcher"
import { AuthMenu } from "./auth-menu"

export function SiteHeader() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-cream-200 bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent bg-cream/40 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[var(--container-content)] items-center justify-between gap-4 px-6 md:h-20 md:px-10">
        <Link href="/" className="flex items-center gap-2" aria-label="Food For Life">
          <Image
            src="/logo-green.jpeg"
            alt="Food For Life"
            width={842}
            height={595}
            className="h-9 w-auto rounded-md md:h-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {publicNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-green-700"
                    : "text-ink hover:text-green-600"
                )}
              >
                {t(item.key)}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/contact?tab=partner"
            className="hidden items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-600 sm:inline-flex"
          >
            {t("becomePartner")}
            <ArrowUpRight className="size-4" />
          </Link>
          <AuthMenu variant="desktop" className="hidden sm:block" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-cream-200 bg-paper text-ink lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-cream-200 bg-cream lg:hidden"
          >
            <nav
              className="mx-auto flex max-w-[var(--container-content)] flex-col gap-1 px-6 py-4"
              aria-label="Mobile"
            >
              {publicNav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded-xl px-3 py-2.5 text-base font-medium text-ink hover:bg-green-50"
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between gap-3">
                <LanguageSwitcher />
                <Link
                  href="/contact?tab=partner"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-ink"
                >
                  {t("becomePartner")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <div className="mt-3 border-t border-cream-200 pt-3">
                <AuthMenu variant="mobile" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
