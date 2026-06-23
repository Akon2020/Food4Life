"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import {
  LayoutDashboard,
  Newspaper,
  Package,
  Handshake,
  Users,
  Quote,
  Images,
  Inbox,
  Mail,
  Settings,
  UserCog,
  LogOut,
  ChevronLeft,
  ExternalLink,
  X,
} from "lucide-react"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { logout, getCurrentUser } from "@/lib/auth"

const items = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { key: "news", href: "/admin/actualites", icon: Newspaper },
  { key: "products", href: "/admin/produits", icon: Package },
  { key: "partners", href: "/admin/partenaires", icon: Handshake },
  { key: "team", href: "/admin/equipe", icon: Users },
  { key: "testimonials", href: "/admin/temoignages", icon: Quote },
  { key: "gallery", href: "/admin/galerie", icon: Images },
  { key: "messages", href: "/admin/messages", icon: Inbox },
  { key: "newsletter", href: "/admin/newsletter", icon: Mail },
  { key: "users", href: "/admin/utilisateurs", icon: UserCog },
  { key: "settings", href: "/admin/parametres", icon: Settings },
] as const

export function AdminSidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean
  onClose?: () => void
} = {}) {
  const t = useTranslations("admin")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  // Read the current user only after mount: getCurrentUser() relies on a
  // browser cookie, so reading it during render causes a server/client
  // hydration mismatch. Defer it to a client-only effect.
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  // Strip the locale prefix to compare against item hrefs.
  const cleanPath = pathname.replace(new RegExp(`^/${locale}`), "") || "/"

  function isActive(href: string, exact?: boolean) {
    if (exact) return cleanPath === href
    return cleanPath === href || cleanPath.startsWith(`${href}/`)
  }

  function handleLogout() {
    logout()
    router.push(`/${locale}/admin/login`)
    router.refresh()
  }

  return (
    <aside
      className={cn(
        // Mobile : drawer off-canvas (fixed, glissant). Desktop (md+) : colonne sticky.
        "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#14422A] text-cream transition-transform duration-300",
        "md:sticky md:top-0 md:z-auto md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        collapsed ? "md:w-[76px]" : "md:w-64"
      )}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        {!collapsed ? (
          <Image
            src="/logo-white.png"
            alt="Food For Life"
            width={130}
            height={56}
            className="h-9 w-auto"
          />
        ) : null}
        {/* Fermer (mobile) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-cream/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          <X className="size-4" />
        </button>
        {/* Replier (desktop seulement) */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
          className="hidden size-8 shrink-0 items-center justify-center rounded-md text-cream/70 transition-colors hover:bg-white/10 hover:text-white md:inline-flex"
        >
          <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="grid gap-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = isActive(
              item.href,
              "exact" in item ? item.exact : undefined
            )
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  title={collapsed ? t(item.key) : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-gold-400 text-green-900"
                      : "text-cream/75 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon className="size-[18px] shrink-0" />
                  {!collapsed ? <span className="truncate">{t(item.key)}</span> : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <a
          href={`/${locale}`}
          className={cn(
            "mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-cream/70 transition-colors hover:bg-white/10 hover:text-white",
            collapsed && "justify-center"
          )}
          title={collapsed ? t("backToSite") : undefined}
        >
          <ExternalLink className="size-[18px] shrink-0" />
          {!collapsed ? <span>{t("backToSite")}</span> : null}
        </a>

        {!collapsed && user ? (
          <div className="mb-2 rounded-lg bg-white/5 px-3 py-2">
            <p className="truncate text-sm font-semibold capitalize text-white">{user.name}</p>
            <p className="truncate text-xs text-cream/60">{user.email}</p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? t("logout") : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-cream/75 transition-colors hover:bg-white/10 hover:text-white",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="size-[18px] shrink-0" />
          {!collapsed ? <span>{t("logout")}</span> : null}
        </button>
      </div>
    </aside>
  )
}
