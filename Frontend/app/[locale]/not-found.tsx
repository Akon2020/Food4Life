import { useTranslations } from "next-intl"
import { Home, Package, Newspaper, Mail, Leaf } from "lucide-react"

import { Link } from "@/i18n/navigation"

export default function NotFound() {
  const t = useTranslations("system")
  const tc = useTranslations("common")
  const tn = useTranslations("nav")

  const links = [
    { href: "/", label: tn("home"), Icon: Home },
    { href: "/produits", label: tn("products"), Icon: Package },
    { href: "/actualites", label: tn("news"), Icon: Newspaper },
    { href: "/contact", label: tn("contact"), Icon: Mail },
  ] as const

  return (
    <main className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-cream px-4 py-20 text-center">
      {/* Décor */}
      <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-green-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 size-72 rounded-full bg-gold-400/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-green-700 text-cream shadow-lg shadow-green-900/20">
          <Leaf className="size-8" />
        </span>

        <p className="font-heading text-7xl font-extrabold leading-none text-green-900 md:text-8xl">
          4
          <span className="text-gold-500">0</span>
          4
        </p>

        <h1 className="mt-6 text-balance font-heading text-2xl font-bold text-ink md:text-3xl">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-3 max-w-md text-pretty leading-relaxed text-ink-muted">
          {t("notFoundText")}
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800"
        >
          <Home className="size-4" />
          {tc("backHome")}
        </Link>

        {/* Liens utiles */}
        <div className="mt-12 w-full max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {t("popularPages")}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {links.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-5 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-green-600 hover:shadow-md"
              >
                <Icon className="size-5 text-green-700 transition-transform group-hover:scale-110" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
