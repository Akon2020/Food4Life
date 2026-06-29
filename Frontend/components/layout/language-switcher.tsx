"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  // pathname natif : inclut le préfixe de langue, ex. /fr/produits/super-energy
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchTo(next: string) {
    if (next === locale) return

    const segments = pathname.split("/")
    // segments[0] = "" (avant le 1er /). segments[1] = locale courante.
    if (
      routing.locales.includes(
        segments[1] as (typeof routing.locales)[number]
      )
    ) {
      segments[1] = next
    } else {
      segments.splice(1, 0, next)
    }
    const url = segments.join("/") || `/${next}`

    startTransition(() => {
      router.replace(url)
    })
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-cream-200 bg-paper p-0.5 text-sm font-semibold",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          disabled={isPending}
          aria-current={l === locale}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            l === locale
              ? "bg-green-500 text-white"
              : "text-ink-muted hover:text-ink"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
