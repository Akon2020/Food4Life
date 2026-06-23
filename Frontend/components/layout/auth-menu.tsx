"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LogIn, LogOut, LayoutDashboard, ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, useRouter } from "@/i18n/navigation"
import { getCurrentUser, logout, type AdminUser } from "@/lib/auth"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function AuthMenu({
  variant = "desktop",
  className,
}: {
  variant?: "desktop" | "mobile"
  className?: string
}) {
  const t = useTranslations("nav")
  const router = useRouter()
  // Read the session user only after mount: getCurrentUser() reads
  // localStorage, so reading during render causes a hydration mismatch.
  const [user, setUser] = useState<AdminUser | null>(null)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  async function handleLogout() {
    await logout()
    setUser(null)
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  // Avoid rendering auth-dependent UI until mounted to keep SSR/CSR in sync.
  if (!mounted) {
    return <div className={cn("h-10", variant === "desktop" && "w-10", className)} aria-hidden />
  }

  // Logged out — show a login link.
  if (!user) {
    if (variant === "mobile") {
      return (
        <Link
          href="/admin/login"
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-full border border-cream-200 bg-paper px-5 py-3 text-sm font-semibold text-ink",
            className
          )}
        >
          <LogIn className="size-4" />
          {t("login")}
        </Link>
      )
    }
    return (
      <Link
        href="/admin/login"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-paper px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-green-300 hover:text-green-700",
          className
        )}
      >
        <LogIn className="size-4" />
        {t("login")}
      </Link>
    )
  }

  // Logged in — mobile: stacked links.
  if (variant === "mobile") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex items-center gap-3 rounded-xl bg-green-50 px-3 py-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
          </div>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-green-50"
        >
          <LayoutDashboard className="size-4" />
          {t("dashboard")}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-green-50"
        >
          <LogOut className="size-4" />
          {t("logout")}
        </button>
      </div>
    )
  }

  // Logged in — desktop: avatar dropdown.
  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-cream-200 bg-paper py-1 pl-1 pr-2.5 text-sm font-semibold text-ink transition-colors hover:border-green-300"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-[8rem] truncate capitalize md:inline">{user.name}</span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+0.5rem)] w-60 overflow-hidden rounded-2xl border border-cream-200 bg-paper p-1.5 shadow-xl"
          >
            <div className="border-b border-cream-200 px-3 py-2.5">
              <p className="truncate text-sm font-semibold capitalize text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-muted">{user.email}</p>
            </div>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-1.5 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-green-50"
              role="menuitem"
            >
              <LayoutDashboard className="size-4" />
              {t("dashboard")}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-ink hover:bg-green-50"
              role="menuitem"
            >
              <LogOut className="size-4" />
              {t("logout")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
